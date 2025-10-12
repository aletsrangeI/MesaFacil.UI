import { FormGenerator } from "../forms/FormGenerator";
import { mesaFacilFields } from "../components/ui/adapters";
import type { ApiFormResponse } from "../forms/types";
import Container from "../components/ui/layout/Container";
import { Button } from "../components/ui/button";
``;

export default function RegistroUsuario() {
  const payload: ApiFormResponse = {
    data: [
      {
        type: "text",
        name: "email",
        placeholder: "Email",
        label: "Email",
        value: "",
        validations: [
          { type: "required", value: 0 },
          { type: "email", value: 0 },
        ],
        options: [],
        leftIconName: "Shield",

        catalogoId: null,

        order: 0,
      },
      {
        type: "password",
        name: "password",
        placeholder: "Password",
        label: "Password",
        value: "",
        validations: [{ type: "required", value: 0 }],
        options: [],

        catalogoId: null,

        order: 1,
      },
      {
        type: "password",
        name: "confirmPassword",
        placeholder: "Confirmar Password",
        label: "Confirmar Password",
        value: "",
        validations: [
          { type: "required", value: 0 },
          { type: "confirmPassword", value: 0 },
        ],
        options: [],

        catalogoId: null,

        order: 2,
      },
      {
        type: "text",
        name: "nombres",
        placeholder: "Nombres",
        label: "Nombres",
        value: "",
        validations: [{ type: "required", value: 0 }],
        options: [],

        catalogoId: null,

        order: 3,
      },
      {
        type: "text",
        name: "apellidos",
        placeholder: "Apellidos",
        label: "Apellidos",
        value: "",
        validations: [{ type: "required", value: 0 }],
        options: [],
        catalogoId: null,

        order: 4,
      },
      {
        type: "select",
        name: "rol",
        placeholder: "Selecciona",
        label: "Rol de Usuario",
        value: " ",
        validations: [{ type: "required", value: 0 }],
        options: [{ id: 6, nombre: "root" }],
        leftIconName: "Shield",
        catalogoId: 1,

        order: 5,
        helperText: "Selecciona Rol",
      },
      {
        type: "text",
        name: "telefono",
        placeholder: "Telefono",
        label: "Telefono",
        value: " ",
        validations: [
          { type: "required", value: 0 },
          { type: "phone", value: 0 },
        ],
        options: [],

        catalogoId: null,

        order: 6,
      },
      {
        type: "date",
        name: "fechaNacimiento",
        placeholder: "Fecha de Nacimiento",
        label: "Fecha de Nacimiento",
        value: " ",
        validations: [
          { type: "required", value: 0 },
          { type: "date", value: 0 },
        ],
        options: [],

        catalogoId: null,

        order: 7,
      },
    ],
    isSuccess: true,
    message: "Se han obtenido correctamente los campos del formulario",
    errors: null,
  };
  return (
    <Container>
      <FormGenerator
        formId="registro-usuario-form"
        showDefaultSubmit={false}
        fields={payload.data}
        components={mesaFacilFields}
        onSubmit={async (values) => {
          console.log(values);
        }}
      />
      <Button
        type="submit"
        form="registro-usuario-form" // ← apunta al form de arriba
        variant="primary"
        style={{ marginTop: 15 }}
      >
        Crear cuenta
      </Button>
    </Container>
  );
}
