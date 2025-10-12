import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import Icon from "../../ui/icons/Icon";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    helperText: { control: "text" },
    errorText: { control: "text" },
    leftIcon: { control: false },
    leftIconName: { control: "text" },
    onChange: { action: "changed" },
  },
  args: {
    label: "Categoría",
    size: "md",
    helperText: "Elige una opción",
    value: "tacos",
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

const Options = () => (
  <>
    <option value="tacos">Tacos</option>
    <option value="burgers">Burgers</option>
    <option value="ensaladas">Ensaladas</option>
    <option value="postres">Postres</option>
    <option value="bebidas">Bebidas</option>
  </>
);

export const Default: Story = {
  render: (args) => (
    <Select
      {...args}
      leftIconName="Utensils" // 👈 lucide, sin emojis
      aria-label="Seleccionar categoría"
    >
      <Options />
    </Select>
  ),
};

export const ConIconManual: Story = {
  render: (args) => (
    <Select
      {...args}
      leftIcon={<Icon name="ChefHat" />}
      helperText="Opcional: puedes pasar un JSX manual"
    >
      <Options />
    </Select>
  ),
};

export const Error: Story = {
  render: (args) => (
    <Select {...args} errorText="Selecciona una categoría válida">
      <Options />
    </Select>
  ),
  args: { helperText: "" },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <Select {...args} size="sm" leftIconName="Utensils">
        <Options />
      </Select>
      <Select {...args} size="md" leftIconName="Utensils">
        <Options />
      </Select>
      <Select {...args} size="lg" leftIconName="Utensils">
        <Options />
      </Select>
    </div>
  ),
  args: { helperText: "" },
};

export const Disabled: Story = {
  render: (args) => (
    <Select {...args} disabled leftIconName="SquareSlash">
      <Options />
    </Select>
  ),
  args: { helperText: "Control deshabilitado" },
};
