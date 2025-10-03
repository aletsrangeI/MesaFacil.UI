import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "./NumberField";

const meta: Meta<typeof NumberField> = {
  title: "UI/NumberField",
  component: NumberField,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    size: "md",
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 1,
  },
};
export default meta;

type Story = StoryObj<typeof NumberField>;

export const Default: Story = {};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <NumberField {...args} size="sm" defaultValue={1} />
      <NumberField {...args} size="md" defaultValue={2} />
      <NumberField {...args} size="lg" defaultValue={3} />
    </div>
  ),
};
export const Limits: Story = { args: { min: 0, max: 3, defaultValue: 3 } };
export const Disabled: Story = { args: { disabled: true } };
