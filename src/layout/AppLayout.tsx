import React from "react";
import { Outlet, useLocation } from "react-router-dom";
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
import { NetworkStatusBanner } from "../components/ui/network-status-banner/NetworkStatusBanner";
import { PrinterStatusBadge } from "../components/impresoras/PrinterStatusBadge";

import "../styles/tokens.css";
import "../components/navigation/sidebar/sidebar.css";
import "./app-shell.css";
import Topbar from "../components/navigation/topbar/Topbar";
import { ModuleSkeletonLoader } from "../components/common/loaders/ModuleSkeletonLoader";

export type AppLayoutProps = {
  /** Roles canónicos del usuario logueado (p.ej. ["admin"]) */
  roles?: CanonicalRole[] | null;
  /** Rutas permitidas desde sesión (p.ej. ["/", "/pedidos"]) */
  accesos?: string[] | null;
  /** Contexto para badges dinámicos (p.ej. { pedidosPendientes: 3 }) */
  badgesCtx?: BadgeContext;
  /** Mostrar Topbar */
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
    collapsible: sec.collapsible,
    defaultOpen: sec.defaultOpen,
    icon: sec.icon,
    items: sec.items.map((it) => ({
      key: it.key,
      to: it.path,
      label: it.label,
      icon: it.icon,
      badge: it.badge,
    })),
  }));
}

export default function AppLayout({
  roles = ["guest"],
  accesos = null,
  badgesCtx,
  showTopbar = true,
  topbar,
  density = "comfortable",
}: AppLayoutProps) {
  // Auto-collapse sidebar on intermediate desktop/tablet screens (769px to 1024px) when height is not mobile
  // On mobile devices (<= 768px wide OR mobile landscape with <= 500px height), it operates as an overlay drawer,
  // so it must NEVER be collapsed (labels and text must always be visible).
  const [collapsed, setCollapsed] = React.useState(() => {
    if (typeof window !== "undefined") {
      const isMobileDevice = window.innerWidth <= 768 || window.innerHeight <= 500;
      if (isMobileDevice) return false;
      return window.innerWidth <= 1024;
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Route-aware flush mode: POS and KDS are full-bleed operational views
  const isFlushRoute = React.useMemo(() => {
    const p = location.pathname.toLowerCase();
    return p.startsWith("/ventas/pos") || p.startsWith("/ventas/kds") || p.startsWith("/cocina");
  }, [location.pathname]);

  // Close mobile drawer when route changes
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Listen to window resize to handle collapse between desktop and mobile/landscape
  React.useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth <= 768 || window.innerHeight <= 500;
      if (isMobileDevice) {
        if (collapsed) setCollapsed(false);
      } else if (window.innerWidth <= 1024) {
        if (!collapsed) setCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

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
    <div
      className={`app-shell ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""} ${isFlushRoute ? "has-flush-content" : ""}`}
    >
      {/* Overlay para móviles */}
      {mobileOpen && (
        <div
          className="app-shell__overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`app-shell__side ${mobileOpen ? "is-mobile-open" : ""}`}>
        <Sidebar
          sections={sections}
          collapsed={mobileOpen ? false : collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          onMobileClose={() => setMobileOpen(false)}
          density={density}
          brand={{ text: "MesaFácil", subtext: "" }}
          footer={
            <button
              onClick={handleLogout}
              className="mf-sidebar__logout-btn"
              title="Cerrar sesión"
            >
              <Icon name="LogOut" size={18} />
              {(!collapsed || mobileOpen) && <span>Cerrar sesión</span>}
            </button>
          }
        />
      </aside>

      <div className="app-shell__main">
        <NetworkStatusBanner />
        {showTopbar && !isFlushRoute &&
          (topbar ?? (
            <Topbar
              showBrand={false}
              subtitle="Backoffice"
              onMenuClick={() => setMobileOpen(true)}
              actions={<PrinterStatusBadge />}
            />
          ))}
        <main className={`app-shell__content ${isFlushRoute ? "is-flush" : ""}`}>
          <React.Suspense fallback={<ModuleSkeletonLoader />}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
