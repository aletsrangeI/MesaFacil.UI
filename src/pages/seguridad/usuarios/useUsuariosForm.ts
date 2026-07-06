import { useMemo } from "react";
import { useFormFieldGetFormFieldByFormCatIdQuery } from "../../../services/generated/api";
import type {
  ApiFormField,
  ValidationRule,
  ValidationType,
  SelectOptionApi,
  FormCategoryId,
} from "../../../forms/types";
import { FORM_CATEGORY_IDS } from "../../../forms/types";

/* -------------------- Helpers (normalización mínima y segura) -------------------- */

const FIELD_TYPES: ReadonlyArray<ApiFormField["type"]> = [
  "text",
  "select",
  "password",
  "date",
];

function asUiFieldType(t: unknown): ApiFormField["type"] {
  const v = String(t ?? "text").toLowerCase() as ApiFormField["type"];
  return (FIELD_TYPES.includes(v) ? v : "text") as ApiFormField["type"];
}

const VALIDATION_TYPES: ReadonlyArray<ValidationType> = [
  "required",
  "email",
  "confirmPassword",
  "phone",
  "date",
  "minLength",
];

function asValidationType(t: unknown): ValidationType {
  const v = String(t ?? "required") as ValidationType;
  return (VALIDATION_TYPES.includes(v) ? v : "required") as ValidationType;
}

function coerceValidationValue(type: ValidationType, raw: unknown): number {
  if (type === "minLength") return Number(raw ?? 0) || 0;
  return Number(raw ?? 1) || 1;
}

type BackendOption = { id?: string | number; nombre?: string; label?: string; value?: string | number; text?: string; };
function toSelectOptions(list?: unknown): SelectOptionApi[] {
  if (!Array.isArray(list)) return [];
  return (list as BackendOption[]).map((o) => {
    const label = String(o.label ?? o.nombre ?? o.text ?? o.value ?? o.id ?? "");
    const value = (o.value ?? o.id ?? label) as string | number;
    return { id: value, nombre: label, label, value } as unknown as SelectOptionApi;
  });
}

export function useUsuariosForm(formCatId: FormCategoryId = FORM_CATEGORY_IDS.GESTION_USUARIOS) {
  // Obtener esquema del formulario para gestión de usuarios
  const { data: resp, isFetching: isFetchingFields, isError: isFieldsError, error: fieldsError } =
    useFormFieldGetFormFieldByFormCatIdQuery({ id: formCatId });

  const formId = "usuarios-sdui-form";

  type BackendField = {
    id?: number | string;
    type?: string;
    name?: string;
    placeholder?: string;
    label?: string;
    value?: string;
    validations?: Array<{ type?: string; value?: number | string }>;
    options?: BackendOption[];
    order?: number;
    dataSource?: string;
  };

  const fields: ApiFormField[] = useMemo(() => {
    const list = Array.isArray((resp as any)?.data)
      ? ((resp as any).data as BackendField[])
      : [];

    const uniq = new Map<string, BackendField>();
    for (const f of list) {
      const key = `${f.id ?? ""}|${f.name ?? ""}`;
      if (!uniq.has(key)) uniq.set(key, f);
    }

    return Array.from(uniq.values())
      .map<ApiFormField>((dto) => ({
        type: asUiFieldType(dto.type),
        name: dto.name ?? "",
        placeholder: dto.placeholder ?? "",
        label: dto.label ?? dto.name ?? "",
        value: dto.value ?? "",
        validations: Array.isArray(dto.validations)
          ? dto.validations.map<ValidationRule>((v) => {
              const type = asValidationType(v?.type);
              return { type, value: coerceValidationValue(type, v?.value) };
            })
          : [],
        options: toSelectOptions(dto.options),
        catalogoId: null,
        order: dto.order ?? 0,
        dataSource: dto.dataSource ?? null,
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [resp]);

  return {
    formId,
    fields,
    isLoadingFields: isFetchingFields,
    isFieldsError,
    fieldsError,
  };
}
