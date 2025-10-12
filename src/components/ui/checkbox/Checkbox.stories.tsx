import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    helperText: { control: "text" },
    errorText: { control: "text" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    onChange: { action: "changed" },
  },
  args: {
    size: "md",
    label: "Aceptar términos",
    checked: false,
    indeterminate: false,
    disabled: false,
    helperText: "Lee y acepta los términos antes de continuar",
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 10 }}>
      <Checkbox {...args} size="sm" label="Small" />
      <Checkbox {...args} size="md" label="Medium" />
      <Checkbox {...args} size="lg" label="Large" />
    </div>
  ),
  args: { helperText: "" },
};

export const ErrorState: Story = {
  args: { errorText: "Campo requerido", helperText: "" },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Selección parcial" },
};

export const ControlledExample: Story = {
  render: (args) => {
    const [val, setVal] = React.useState<boolean>(false);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <Checkbox
          {...args}
          checked={val}
          onChange={(e) => setVal(e.currentTarget.checked)}
          label={`Estado: ${val ? "Marcado" : "Desmarcado"}`}
          helperText="Controlado vía estado local"
        />
      </div>
    );
  },
  args: { helperText: "" },
};
