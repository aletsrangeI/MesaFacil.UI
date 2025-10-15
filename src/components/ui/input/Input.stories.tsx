// Input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import Icon from "../../ui/icons/Icon";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    inputSize: { control: { type: "number" } },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    errorText: { control: "text" },
    clearable: { control: "boolean" },
    passwordToggle: { control: "boolean" },
    showCounter: { control: "boolean" },
    selectOnFocus: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    type: { control: "text" }, // "text" | "password" | ...
  },
  args: {
    size: "md",
    label: "Etiqueta",
    placeholder: "Escribe aquí…",
    helperText: "Texto de ayuda opcional",
    errorText: "",
    clearable: false,
    passwordToggle: false,
    showCounter: false,
    selectOnFocus: false,
    required: false,
    disabled: false,
    readOnly: false,
    type: "text",
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

/** Playground controlado por Args */
export const Playground: Story = {};

/** Caso real: Buscar platillo (usa tu <Icon /> basado en lucide-react) */
export const BuscarPlatillo: Story = {
  args: {
    label: "Buscar platillo",
    placeholder: "Ej. Taco, Hamburguesa…",
    rightIcon: <Icon name="Search" />,
  },
};

/** Tamaños visuales con identidad de marca aplicada */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, width: 420 }}>
      <Input {...args} size="sm" label="Pequeño (sm)" placeholder="Small" />
      <Input {...args} size="md" label="Mediano (md)" placeholder="Medium" />
      <Input {...args} size="lg" label="Grande (lg)" placeholder="Large" />
    </div>
  ),
};

/** Precio con MXN usando prefix/suffix y teclado decimal en móviles */
export const PrecioMXN: Story = {
  args: {
    label: "Precio",
    placeholder: "0.00",
    prefix: "$",
    suffix: "MXN",
    inputMode: "decimal",
    selectOnFocus: true,
    helperText: "Precio en pesos mexicanos",
  },
};

/** Estado de error coherente con el ring y los bordes de la marca */
export const ConError: Story = {
  args: {
    label: "Nombre del platillo",
    placeholder: "Requerido",
    errorText: "Este campo es obligatorio.",
    state: "error",
  },
};

/** Contraseña con toggle de visibilidad */
export const Password: Story = {
  args: {
    type: "password",
    passwordToggle: true,
    label: "Contraseña",
    placeholder: "••••••••",
  },
};

/** Clearable con valor inicial, para UX rápida */
export const Clearable: Story = {
  args: {
    clearable: true,
    defaultValue: "Texto inicial",
    label: "Limpiable",
  },
};

/** Contador (requiere maxLength) */
export const Counter: Story = {
  args: {
    label: "Con contador",
    showCounter: true,
    maxLength: 20,
    placeholder: "Máximo 20 caracteres",
  },
};

/** Combinado: ejemplos representativos en MesaFacil */
export const Combinado: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 480 }}>
      <Input
        label="Buscar platillo"
        placeholder="Ej. Taco, Hamburguesa…"
        rightIcon={<Icon name="Search" />}
        helperText="Puedes buscar por nombre o código interno."
      />
      <Input
        label="Código"
        defaultValue="ABC-123-XYZ"
        selectOnFocus
        helperText="Se selecciona todo al enfocar"
        rightIcon={<Icon name="Barcode" />}
      />
      <Input
        label="URL menú"
        prefix="https://"
        suffix=".com"
        placeholder="tu-dominio"
        rightIcon={<Icon name="Link" />}
      />
    </div>
  ),
};
