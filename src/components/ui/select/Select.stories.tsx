import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    helperText: { control: "text" },
    errorText: { control: "text" },
    leftIcon: { control: false },
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
    <Select {...args} leftIcon={<span>🍽️</span>}>
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
      <Select {...args} size="sm">
        <Options />
      </Select>
      <Select {...args} size="md">
        <Options />
      </Select>
      <Select {...args} size="lg">
        <Options />
      </Select>
    </div>
  ),
  args: { helperText: "" },
};
