import { FormGenerator } from "../forms/FormGenerator";
import { mesaFacilFields } from "../components/ui/adapters";
import type { ApiFormResponse } from "../forms/types";
import Container from "../components/ui/layout/Container";
import { Button } from "../components/ui/button";
import Icon from "../components/ui/icons/Icon";
``;

export default function RegistroUsuario() {
  const payload: ApiFormResponse = {
  data: [
    {
      type: "text",
      name: "username",
      placeholder: "Ingresa tu usuario o email",
      label: "Usuario",
      value: "",
      validations: [
        { type: "required", value: 1 }
      ],
      options: [],
      leftIconName: "Shield",
      catalogoId: null,
      order: 1,
    },
    {
      type: "password",
      name: "password",
      placeholder: "Ingresa tu contraseña",
      label: "Contraseña",
      value: "",
      validations: [
        { type: "required", value: 1 },
        { type: "minLength", value: 8 }
      ],
      options: [],
      catalogoId: null,
      order: 2,
    }
  ],
  isSuccess: true,
  message: "FormField encontrado",
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
        rightIcon={<Icon name="UserPlus" />}
      >
        Crear cuenta
      </Button>
    </Container>
  );
}
