import React from "react";
import { Outlet } from "react-router-dom";
import {
  Sidebar,
  type SidebarSection,
} from "../components/navigation/sidebar/Sidebar";
import {
  buildNavSections,
  type CanonicalRole,
  type BadgeContext,
  type NavSectionConfig,
} from "../config/nav.config";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../state/authSlice";
import Icon from "../components/ui/icons/Icon";

import "../styles/tokens.css"; // asegúrate que esté cargado globalmente
import "../components/navigation/sidebar/sidebar.css"; // estilos del Sidebar
import "./app-shell.css"; // estilos del layout (abajo)
import Topbar from "../components/navigation/topbar/Topbar";

export type AppLayoutProps = {
  /** Roles canónicos del usuario logueado (p.ej. ["admin"]) */
  roles?: CanonicalRole[] | null;
  /** Rutas permitidas desde sesión (p.ej. ["/", "/pedidos"]) */
  accesos?: string[] | null;
  /** Contexto para badges dinámicos (p.ej. { pedidosPendientes: 3 }) */
  badgesCtx?: BadgeContext;
  /** Mostrar Topbar (cuando lo integremos en el siguiente paso) */
  showTopbar?: boolean;
  /** Slot opcional si ya tienes un Topbar *temporal* */
  topbar?: React.ReactNode;
  /** Densidad de navegación */
  density?: "comfortable" | "compact";
};

function toSidebarSections(src: NavSectionConfig[]): SidebarSection[] {
  return src.map((sec) => ({
    key: sec.key,
    label: sec.label,
    items: sec.items.map((it) => ({
      key: it.key,
      to: it.path, // <-- mapea path -> to
      label: it.label,
      icon: it.icon,
      badge: it.badge, // si SidebarItem tiene badge (lo añadiste)
    })),
  }));
}

export default function AppLayout({
  roles = ["guest"],
  accesos = null,
  badgesCtx,
  showTopbar = false,
  topbar,
  density = "comfortable",
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = React.useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const navSections = React.useMemo(
    () => buildNavSections({ roles, accesos, badgesCtx }),
    [roles, accesos, badgesCtx]
  );

  const sections: SidebarSection[] = React.useMemo(
    () => toSidebarSections(navSections),
    [navSections]
  );

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="app-shell__side">
        <Sidebar
          sections={sections}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          density={density}
          brand={{ text: "MesaFácil", subtext: "" }}
          footer={
            <button
              onClick={handleLogout}
              className="mf-sidebar__logout-btn"
              title="Cerrar sesión"
            >
              <Icon name="LogOut" size={18} />
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          }
        />
      </aside>

      <div className="app-shell__main">
        {showTopbar &&
          (topbar ?? <Topbar showBrand={false} subtitle="Backoffice" />)}
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
