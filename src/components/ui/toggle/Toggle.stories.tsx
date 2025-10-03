import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { action: "changed" },
  },
  args: {
    label: "Disponible para pedidos",
    checked: true,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Unchecked: Story = {
  args: { checked: false },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithoutLabel: Story = {
  args: { label: "", checked: true },
};

export const ControlledExample: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<boolean>(Boolean(args.checked));
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Toggle
          {...args}
          checked={value}
          onChange={(e) => setValue(e.currentTarget.checked)}
        />
        <div>Estado: {value ? "Activo" : "Inactivo"}</div>
      </div>
    );
  },
};
