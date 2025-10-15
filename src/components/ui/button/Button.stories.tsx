import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

// Iconitos inline para las demos (sin dependencias)
const IconPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
    <path d="M11 5v6H5v2h6v6h2v-6h6v-2h-6V5h-2z" fill="currentColor" />
  </svg>
);
const IconDownload = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
    <path
      d="M12 3v10l4-4 1.4 1.4L12 16.8 6.6 10.4 8 9l4 4V3h0zM5 19h14v2H5z"
      fill="currentColor"
    />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "ghost", "link"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    block: { control: "boolean" },
    fullWidth: { control: "boolean" },
    iconOnly: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    isLoading: false,
    disabled: false,
    block: false,
    fullWidth: false,
    iconOnly: false,
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

/** Playground controlado por Args */
export const Playground: Story = {};

export const Block: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Button {...args} block>
        Continuar
      </Button>
      <div style={{ height: 8 }} />
      <Button {...args} block variant="secondary" size="lg">
        Comprar ahora
      </Button>
    </div>
  ),
};

/** Variantes (misma altura por CSS) */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...args} variant="primary">
        primary
      </Button>
      <Button {...args} variant="secondary">
        secondary
      </Button>
      <Button {...args} variant="ghost">
        ghost
      </Button>
      <Button {...args} variant="link">
        link
      </Button>
    </div>
  ),
};

/** Tamaños lado a lado */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

/** Con iconos a la izquierda y derecha */
export const WithIcons: Story = {
  args: {
    leftIcon: <IconDownload />,
    rightIcon: <IconPlus />,
    children: "Descargar",
  },
};

/** Solo icono (usa aria-label en el propio botón cuando iconOnly=true) */
export const IconOnly: Story = {
  args: {
    iconOnly: true,
    leftIcon: <IconPlus />,
    "aria-label": "Agregar",
    children: "", // oculto por CSS para iconOnly
  } as any,
};

/** Estado cargando */
export const Loading: Story = {
  args: { isLoading: true, children: "Guardando…" },
};

/** Disabled */
export const Disabled: Story = {
  args: { disabled: true },
};

/** Full width dentro de un contenedor */
export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Button {...args} fullWidth>
        Continuar
      </Button>
    </div>
  ),
};

/** Grupo “adjunto” simple (sin dependencia de ButtonGroup) */
export const AttachedGroup: Story = {
  render: (args) => (
    <div style={{ display: "inline-flex" }}>
      <Button
        {...args}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        Izquierda
      </Button>
      <Button
        {...args}
        variant="ghost"
        style={{
          borderRadius: 0,
          marginLeft: -1, // evita doble borde
        }}
      >
        Centro
      </Button>
      <Button
        {...args}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          marginLeft: -1,
        }}
      >
        Derecha
      </Button>
    </div>
  ),
};

/** Mosaico: variantes x tamaños (útil para revisar tokens y alturas) */
export const Matrix: Story = {
  render: () => {
    const variants = ["primary", "secondary", "ghost"] as const;
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, auto)",
          gap: 12,
        }}
      >
        {variants.map((v) =>
          sizes.map((s) => (
            <Button key={`${v}-${s}`} variant={v} size={s}>
              {v} / {s}
            </Button>
          ))
        )}
      </div>
    );
  },
};
