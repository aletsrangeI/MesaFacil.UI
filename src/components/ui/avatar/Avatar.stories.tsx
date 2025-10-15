import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar, type AvatarProps } from "./Avatar";
import "./avatar.css";

const IconCamera = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
    <path
      d="M9 7l1.5-2h3L15 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      fill="currentColor"
    />
  </svg>
);

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    shape: {
      control: "inline-radio",
      options: ["circle", "rounded", "square"],
    },
    status: {
      control: "select",
      options: ["none", "online", "busy", "away", "offline"],
    },
    ring: { control: "boolean" },
    src: { control: "text" },
    forceImageError: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: {
    name: "Alex Rangel",
    size: "md",
    shape: "circle",
    status: "none",
    ring: false,
  },
} satisfies Meta<typeof Avatar>;
export default meta;

export const Playground: StoryObj<typeof Avatar> = {};

export const Sizes: StoryObj<typeof Avatar> = {
  render: (args: AvatarProps) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
};

export const Shapes: StoryObj<typeof Avatar> = {
  render: (args: AvatarProps) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="rounded" />
      <Avatar {...args} shape="square" />
    </div>
  ),
};

export const StatusDot: StoryObj<typeof Avatar> = {
  render: (args: AvatarProps) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Avatar {...args} status="online" />
      <Avatar {...args} status="busy" />
      <Avatar {...args} status="away" />
      <Avatar {...args} status="offline" />
    </div>
  ),
};

export const WithImage: StoryObj<typeof Avatar> = {
  args: {
    src: "https://picsum.photos/seed/mesafacil/96", // Solo demo
  },
};

export const Clickable: StoryObj<typeof Avatar> = {
  args: { ring: true },
};

export const WithOverlay: StoryObj<typeof Avatar> = {
  render: (args: AvatarProps) => (
    <Avatar
      {...args}
      overlay={
        <div style={{ display: "grid", placeItems: "center", gap: 6 }}>
          <IconCamera />
          <span style={{ fontSize: 12 }}>Cambiar</span>
        </div>
      }
    />
  ),
};

export const FallbackOnError: StoryObj<typeof Avatar> = {
  args: { src: "https://invalid.url/img.png", forceImageError: true },
};

export const Matrix: StoryObj<typeof Avatar> = {
  render: () => {
    const shapes: AvatarProps["shape"][] = ["circle", "rounded", "square"];
    const sizes: AvatarProps["size"][] = ["sm", "md", "lg", "xl"];
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, auto)",
          gap: 16,
          alignItems: "center",
        }}
      >
        {shapes.map((shape) =>
          sizes.map((size) => (
            <div
              key={`${shape}-${size}`}
              style={{ display: "grid", gap: 6, justifyItems: "center" }}
            >
              <Avatar name={`${shape}-${size}`} shape={shape} size={size} />
              <small style={{ color: "#555" }}>
                {shape}/{size}
              </small>
            </div>
          ))
        )}
      </div>
    );
  },
};
