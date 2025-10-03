import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    errorText: { control: "text" },
    helperText: { control: "text" },
  },
  args: {
    label: "Etiqueta",
    placeholder: "Escribe aquí…",
    size: "md",
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithHelper: Story = { args: { helperText: "Helper de ejemplo" } };
export const Error: Story = { args: { errorText: "Mensaje de error" } };
export const WithIcons: Story = {
  args: {
    leftIcon: <span>🍔</span>,
    rightIcon: <span>✔</span>,
    placeholder: "Con íconos",
  },
};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};
