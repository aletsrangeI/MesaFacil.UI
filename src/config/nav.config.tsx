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
        key: "roles",
        label: "Roles",
        path: "/admin/roles",
        icon: <Icon name="UserStar" />,
        sortOrder: 10,
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
