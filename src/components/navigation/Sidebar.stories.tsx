// src/components/navigation/Sidebar.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Sidebar, type SidebarSection } from "./Sidebar";
import "./sidebar.css";

// Usa tu wrapper de lucide
import Icon from "../ui/icons/Icon";
import { useState } from "react";

const SECTIONS: SidebarSection[] = [
  {
    key: "operacion",
    label: "Operación",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        to: "/",
        icon: <Icon name="LayoutDashboard" />,
      },
      {
        key: "pedidos",
        label: "Pedidos",
        to: "/pedidos",
        icon: <Icon name="ClipboardList" />,
        badge: <span>3</span>,
      },
      {
        key: "mesas",
        label: "Mesas",
        to: "/mesas",
        icon: <Icon name="Utensils" />,
      },
      {
        key: "caja",
        label: "Caja",
        to: "/caja",
        icon: <Icon name="Banknote" />,
      },
      {
        key: "cocina",
        label: "Cocina",
        to: "/cocina",
        icon: <Icon name="ChefHat" />,
      },
      {
        key: "delivery",
        label: "Delivery",
        to: "/delivery",
        icon: <Icon name="PackageSearch" />,
      },
    ],
  },
  {
    key: "gestion",
    label: "Gestión",
    items: [
      {
        key: "menu",
        label: "Menú",
        to: "/menu",
        icon: <Icon name="Receipt" />,
      },
      {
        key: "inventario",
        label: "Inventario",
        to: "/inventario",
        icon: <Icon name="Boxes" />,
        badge: <span>12</span>,
      },
      {
        key: "clientes",
        label: "Clientes",
        to: "/clientes",
        icon: <Icon name="BookUser" />,
      },
      {
        key: "reportes",
        label: "Reportes",
        to: "/reportes",
        icon: <Icon name="FileBarChart2" />,
      },
    ],
  },
  {
    key: "config",
    label: "Configuración",
    items: [
      {
        key: "usuarios",
        label: "Usuarios",
        to: "/usuarios",
        icon: <Icon name="Users" />,
      },
      {
        key: "roles",
        label: "Roles y Permisos",
        to: "/roles",
        icon: <Icon name="Shield" />,
      },
      {
        key: "apariencia",
        label: "Apariencia",
        to: "/apariencia",
        icon: <Icon name="Paintbrush" />,
      },
      {
        key: "integraciones",
        label: "Integraciones",
        to: "/integraciones",
        icon: <Icon name="PlugZap" />,
      },
      {
        key: "sistema",
        label: "Sistema",
        to: "/sistema",
        icon: <Icon name="ServerCog" />,
      },
      {
        key: "auditoria",
        label: "Auditoría",
        to: "/auditoria",
        icon: <Icon name="ScrollText" />,
      },
    ],
  },
];

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    collapsed: { control: "boolean" },
    density: { control: "inline-radio", options: ["comfortable", "compact"] },
    onToggle: { action: "toggle" },
  },
  args: {
    sections: SECTIONS,
    collapsed: false,
    density: "comfortable",
    brand: {
      text: "MesaFácil",
      subtext: "Backoffice",
      icon: <Icon name="Home" />,
    },
    footer: (
      <a
        href="#"
        style={{ textDecoration: "none", color: "var(--color-text)" }}
      >
        <Icon name="DoorOpen" style={{ marginRight: 8, verticalAlign: -2 }} />
        Salir
      </a>
    ),
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

/** Playground controlado por args */
export const Playground: StoryObj<typeof Sidebar> = {
  render: (args) => (
    <MemoryRouter initialEntries={["/"]}>
      <Sidebar {...args} />
    </MemoryRouter>
  ),
};

/** Demostración colapsada */
export const Collapsed: StoryObj<typeof Sidebar> = {
  render: (args) => (
    <MemoryRouter initialEntries={["/"]}>
      <Sidebar {...args} collapsed />
    </MemoryRouter>
  ),
};

/** Con estado local para alternar colapso */
export const Toggleable: StoryObj<typeof Sidebar> = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar
          {...args}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          brand={{
            text: "MesaFácil",
            subtext: collapsed ? "" : "Backoffice",
            icon: <Icon name="Home" />,
          }}
        />
      </MemoryRouter>
    );
  },
};

/** Lista larga para validar scroll + focus */
export const LongList: StoryObj<typeof Sidebar> = {
  render: (args) => {
    const longSections: SidebarSection[] = [
      {
        key: "larga",
        label: "Catálogo",
        items: Array.from({ length: 18 }).map((_, i) => ({
          key: `item-${i}`,
          label: `Item ${i + 1}`,
          to: `/item-${i}`,
          icon: <Icon name="Dot" />, // Lucide minimal
          badge: i % 4 === 0 ? <span>{(i % 3) + 1}</span> : undefined,
        })),
      },
    ];
    return (
      <MemoryRouter initialEntries={["/item-3"]}>
        <div style={{ height: 520 }}>
          <Sidebar {...args} sections={longSections} />
        </div>
      </MemoryRouter>
    );
  },
};

/** Visualizar item activo al entrar con ruta concreta */
export const ActiveItem: StoryObj<typeof Sidebar> = {
  render: (args) => (
    <MemoryRouter initialEntries={["/inventario"]}>
      <Sidebar {...args} />
    </MemoryRouter>
  ),
};
