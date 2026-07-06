// src/config/nav.config.ts
import React from "react";
import Icon from "../components/ui/icons/Icon";
/** === Tipos de roles canónicos (ajusta si lo necesitas) === */
export type CanonicalRole =
  | "admin"
  | "manager"
  | "cashier"
  | "waiter"
  | "kitchen"
  | "delivery"
  | "guest";

/** Item del Sidebar con metadatos de seguridad y UI */
export type NavItemConfig = {
  key: string;
  label: string;
  path: string; // debe coincidir con react-router
  icon: React.ReactNode; // <Icon name="..."/>
  sortOrder?: number;
  /** visibilidad por rol (si se omite => visible para todos) */
  allowedRoles?: CanonicalRole[];
  /** badge estático (opcional) */
  badge?: React.ReactNode;
  /** resolver de badge dinámico (opcional). Se evalúa en buildNavSections */
  badge$?: (ctx: BadgeContext) => React.ReactNode | null | undefined;
};

/** Sección del Sidebar */
export type NavSectionConfig = {
  key: string;
  label: string;
  items: NavItemConfig[];
  sortOrder?: number;
};

/** Contexto que puedes pasar desde Redux/Query para pintar badges dinámicos */
export type BadgeContext = {
  pedidosPendientes?: number;
  inventarioBajo?: number;
  notificaciones?: number;
  [k: string]: unknown;
};

export const NAV_SECTIONS_ALL: NavSectionConfig[] = [
  {
    key: "operacion",
    label: "Operación",
    sortOrder: 10,
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: "/",
        icon: <Icon name="LayoutDashboard" />,
        sortOrder: 10,
        allowedRoles: [
          "admin",
          "manager",
          "cashier",
          "waiter",
          "kitchen",
          "delivery",
        ],
      },
      {
        key: "pedidos",
        label: "Pedidos",
        path: "/pedidos",
        icon: <Icon name="ClipboardList" />,
        sortOrder: 20,
        allowedRoles: ["admin", "manager", "cashier", "waiter"],
        badge$: ({ pedidosPendientes }) =>
          pedidosPendientes ? <span>{pedidosPendientes}</span> : null,
      },
      {
        key: "mesas",
        label: "Mesas",
        path: "/mesas",
        icon: <Icon name="Utensils" />,
        sortOrder: 30,
        allowedRoles: ["admin", "manager", "waiter"],
      },
      {
        key: "delivery",
        label: "Delivery",
        path: "/delivery",
        icon: <Icon name="PackageSearch" />,
        sortOrder: 40,
        allowedRoles: ["admin", "manager", "delivery"],
      },
      {
        key: "cocina",
        label: "Cocina KDS",
        path: "/cocina",
        icon: <Icon name="ChefHat" />,
        sortOrder: 50,
        allowedRoles: ["admin", "manager", "kitchen"],
      },
      {
        key: "caja-rapida",
        label: "Caja Rápida",
        path: "/caja/rapida",
        icon: <Icon name="HandCoins" />,
        sortOrder: 60,
        allowedRoles: ["admin", "manager", "cashier"],
      },
    ],
  },
  {
    key: "admin",
    label: "Administrador",
    sortOrder: 999,
    items: [
      {
        key: "cuentas",
        label: "Cuentas",
        path: "/cobro/cuentas",
        icon: <Icon name="Receipt" />,
        sortOrder: 10,
        allowedRoles: ["admin", "manager", "cashier"],
      },
      {
        key: "pagos",
        label: "Pagos",
        path: "/cobro/pagos",
        icon: <Icon name="CreditCard" />,
        sortOrder: 20,
        allowedRoles: ["admin", "manager", "cashier"],
      },
      {
        key: "desc",
        label: "Descuentos",
        path: "/cobro/descuentos",
        icon: <Icon name="BadgePercent" />,
        sortOrder: 30,
        allowedRoles: ["admin", "manager"],
      },
    ],
  },
  {
    key: "caja",
    label: "Caja",
    sortOrder: 30,
    items: [
      {
        key: "turnos",
        label: "Turnos",
        path: "/caja/turnos",
        icon: <Icon name="CalendarClock" />,
        sortOrder: 10,
        allowedRoles: ["admin", "manager", "cashier"],
      },
      {
        key: "movimientos",
        label: "Movimientos",
        path: "/caja/movimientos",
        icon: <Icon name="ArrowUpDown" />,
        sortOrder: 20,
        allowedRoles: ["admin", "manager", "cashier"],
      },
      {
        key: "cortes",
        label: "Cortes de Caja",
        path: "/caja/cortes",
        icon: <Icon name="FileSpreadsheet" />,
        sortOrder: 30,
        allowedRoles: ["admin", "manager"],
      },
    ],
  },
  {
    key: "menu",
    label: "Menú",
    sortOrder: 40,
    items: [
      {
        key: "menues",
        label: "Menús",
        path: "/menu/menues",
        icon: <Icon name="ListChecks" />,
        sortOrder: 10,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "categorias",
        label: "Categorías",
        path: "/menu/categorias",
        icon: <Icon name="Folders" />,
        sortOrder: 20,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "productos",
        label: "Productos",
        path: "/menu/productos",
        icon: <Icon name="Salad" />,
        sortOrder: 30,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "variantes",
        label: "Variantes",
        path: "/menu/variantes",
        icon: <Icon name="Rows2" />,
        sortOrder: 40,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "precios",
        label: "Precios",
        path: "/menu/precios",
        icon: <Icon name="CircleDollarSign" />,
        sortOrder: 50,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "mods",
        label: "Modificadores",
        path: "/menu/modificadores",
        icon: <Icon name="SlidersHorizontal" />,
        sortOrder: 60,
        allowedRoles: ["admin", "manager"],
      },
    ],
  },
  {
    key: "clientes",
    label: "Clientes",
    sortOrder: 50,
    items: [
      {
        key: "clientes",
        label: "Clientes",
        path: "/clientes",
        icon: <Icon name="BookUser" />,
        sortOrder: 10,
        allowedRoles: ["admin", "manager", "cashier", "waiter"],
      },
    ],
  },
  {
    key: "reportes",
    label: "Reportes",
    sortOrder: 60,
    items: [
      {
        key: "ventas",
        label: "Ventas",
        path: "/reportes/ventas",
        icon: <Icon name="BarChart3" />,
        sortOrder: 10,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "productos",
        label: "Productos",
        path: "/reportes/productos",
        icon: <Icon name="PieChart" />,
        sortOrder: 20,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "pedidos",
        label: "Pedidos",
        path: "/reportes/pedidos",
        icon: <Icon name="LineChart" />,
        sortOrder: 30,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "caja",
        label: "Caja",
        path: "/reportes/caja",
        icon: <Icon name="Table2" />,
        sortOrder: 40,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "kds",
        label: "KDS",
        path: "/reportes/kds",
        icon: <Icon name="Timer" />,
        sortOrder: 50,
        allowedRoles: ["admin", "manager"],
      },
    ],
  },
  {
    key: "gestion",
    label: "Gestión",
    sortOrder: 70,
    items: [
      {
        key: "empresa",
        label: "Empresa",
        path: "/gestion/empresa",
        icon: <Icon name="Landmark" />,
        sortOrder: 10,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "sucursales",
        label: "Sucursales",
        path: "/gestion/sucursales",
        icon: <Icon name="Store" />,
        sortOrder: 20,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "areas",
        label: "Áreas",
        path: "/gestion/areas",
        icon: <Icon name="LayoutList" />,
        sortOrder: 30,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "mesas",
        label: "Mesas",
        path: "/gestion/mesas",
        icon: <Icon name="Grid" />,
        sortOrder: 40,
        allowedRoles: ["admin", "manager"],
      },
    ],
  },
  {
    key: "seguridad",
    label: "Usuarios y Seguridad",
    sortOrder: 80,
    items: [
      {
        key: "usuarios",
        label: "Usuarios",
        path: "/admin/users",
        icon: <Icon name="Users" />,
        sortOrder: 10,
        allowedRoles: ["admin", "manager"],
      },
      {
        key: "roles",
        label: "Roles",
        path: "/admin/roles",
        icon: <Icon name="UserStar" />,
        sortOrder: 20,
        allowedRoles: ["admin"],
      },
      {
        key: "formularios",
        label: "Formularios",
        path: "/admin/forms",
        icon: <Icon name="Settings" />,
        sortOrder: 30,
        allowedRoles: ["admin"],
      },
    ],
  },
];

/** === Helpers de construcción/filtrado === */

/** Orden estable por sortOrder, luego label */
function sortBy<T extends { sortOrder?: number; label?: string }>(
  arr: T[]
): T[] {
  return [...arr].sort((a, b) => {
    const soA = a.sortOrder ?? 9999;
    const soB = b.sortOrder ?? 9999;
    if (soA !== soB) return soA - soB;
    return (a.label ?? "").localeCompare(b.label ?? "");
  });
}

/** Filtra por roles (si el item define allowedRoles) */
export function filterByRoles(
  sections: NavSectionConfig[],
  roles: CanonicalRole[]
): NavSectionConfig[] {
  const roleSet = new Set(roles);
  return sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) => !it.allowedRoles || it.allowedRoles.some((r) => roleSet.has(r))
      ),
    }))
    .filter((sec) => sec.items.length > 0);
}

function norm(p: string) {
  const lower = String(p || "").toLowerCase();
  // quita slashes finales salvo la raíz
  return lower !== "/" ? lower.replace(/\/+$/, "") : "/";
}

/** Filtra por session.accesos (lista de paths permitidos) */
function filterByAccesos(
  sections: NavSectionConfig[],
  accesos?: string[] | null
): NavSectionConfig[] {
  if (!accesos || accesos.length === 0) return sections;

  const acc = new Set((accesos ?? []).map(norm));
  return sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((it) => acc.has(norm(it.path))),
    }))
    .filter((sec) => sec.items.length > 0);
}

/** Inyecta badges dinámicos usando un contexto (Redux/Query) */
export function withBadges(
  sections: NavSectionConfig[],
  ctx: BadgeContext
): NavSectionConfig[] {
  return sections.map((sec) => ({
    ...sec,
    items: sec.items.map((it) => ({
      ...it,
      badge: it.badge$ ? (it.badge$(ctx) ?? undefined) : it.badge,
    })),
  }));
}

export function buildNavSections(
  params: {
    roles?: CanonicalRole[] | null; // ← solo roles canónicos
    accesos?: string[] | null;
    badgesCtx?: BadgeContext;
  } = {}
): NavSectionConfig[] {
  const rolesCanon: CanonicalRole[] =
    params.roles && params.roles.length ? params.roles : ["guest"];

  let result = NAV_SECTIONS_ALL.map((s) => ({
    ...s,
    items: s.items.map((i) => ({ ...i })),
  }));

  if (params.badgesCtx) result = withBadges(result, params.badgesCtx);
  result = filterByRoles(result, rolesCanon);
  result = filterByAccesos(result, params.accesos);
  result = sortBy(result).map((sec) => ({ ...sec, items: sortBy(sec.items) }));
  return result;
}
