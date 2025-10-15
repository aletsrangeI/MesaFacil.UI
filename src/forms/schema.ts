import * as Yup from "yup";
import type { ApiFormField, ValidationRule } from "./types";

const MX_PHONE_REGEX =
  /^(\+?52)?\s*(\d{2,3})?[-.\s]*\d{3}[-.\s]*\d{2}[-.\s]*\d{2}$/;

function applyRule(
  shape: Yup.ObjectSchema<object>,
  field: ApiFormField,
  rule: ValidationRule,
  allFields: ApiFormField[]
): Yup.ObjectSchema<object> {
  const current = (shape.fields as any)[field.name] as Yup.StringSchema<string>;
  // Si aún no existe, parte de string por defecto (todos los campos de este JSON son strings)
  let base = current ?? Yup.string();

  switch (rule.type) {
    case "required":
      base = base.required("Este campo es obligatorio");
      break;
    case "email":
      base = base.email("Formato de correo inválido");
      break;
    case "phone":
      base = base.matches(MX_PHONE_REGEX, "Teléfono inválido");
      break;
    case "date":
      // Para inputs <input type="date" />, validamos formato simple YYYY-MM-DD
      base = base.matches(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)");
      break;
    case "confirmPassword": {
      // Busca el campo 'password' definido en el payload
      const pwdField =
        allFields.find((f) => f.name.toLowerCase() === "password")?.name ??
        "password";
      base = base
        .oneOf([Yup.ref(pwdField)], "Las contraseñas no coinciden")
        .required("Confirma tu contraseña");
      break;
    }
    default:
      break;
  }

  // Devuelve un nuevo shape con el campo actualizado
  return shape.shape({ [field.name]: base });
}

export function buildYupSchema(
  fields: ApiFormField[]
): Yup.ObjectSchema<object> {
  let shape = Yup.object({});
  for (const f of fields) {
    // base por tipo
    let base: Yup.StringSchema<string | undefined> = Yup.string();
    if (f.type === "date") {
      base = Yup.string(); // seguimos como string (input date entrega string)
    }
    shape = shape.shape({ [f.name]: base });

    // aplica reglas
    for (const r of f.validations ?? []) {
      shape = applyRule(shape, f, r, fields);
    }
  }
  return shape;
}
