import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "../../ui/icons/Icon";

export type SidebarItem = {
  key: string;
  to: string;
  label: string;
  /** Igual que en Button: recibe un ReactNode (tu <Icon name="..."/> o emoji/SVG). */
  icon?: React.ReactNode;
  /** Badge opcional (contadores, estados) */
  badge?: React.ReactNode;
};

export type SidebarSection = {
  key: string;
  label: string;
  items: SidebarItem[];
  /** Si es true, el encabezado de la sección actúa como acordeón colapsable. */
  collapsible?: boolean;
  /** Estado inicial del acordeón (solo aplica si collapsible=true). Default: false (cerrado). */
  defaultOpen?: boolean;
  /** Icono descriptivo para la sección. */
  icon?: React.ReactNode;
};

export type SidebarProps = {
  sections: SidebarSection[];
  collapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void; // Para cerrar el menú en móviles (Drawer)
  footer?: React.ReactNode; // slot de pie (Salir, versión, etc.)
  brand?: { icon?: React.ReactNode; text?: string; subtext?: string };
  className?: string;
  /** Densidad visual */
  density?: "comfortable" | "compact";
};

function renderIcon(icon?: React.ReactNode) {
  if (!icon) return null;
  return (
    <span className="mf-nav__icon" aria-hidden>
      {icon}
    </span>
  );
}

/** Sección con soporte de acordeón colapsable */
function NavSection({
  section,
  sidebarCollapsed,
  onNavClick,
}: {
  section: SidebarSection;
  sidebarCollapsed: boolean;
  onNavClick?: () => void;
}) {
  const location = useLocation();

  // Si algún item de la sección está activo, la abrimos por defecto
  const hasActiveChild = section.items.some((it) =>
    location.pathname.startsWith(it.to === "/" ? "/" : it.to)
  );

  const [open, setOpen] = useState(
    section.defaultOpen ?? hasActiveChild ?? false
  );

  // Cuando el sidebar está colapsado mostramos todos los items sin acordeón
  const isCollapsible = section.collapsible && !sidebarCollapsed;
  const isOpen = !isCollapsible || open;

  return (
    <div
      className={[
        "mf-nav__section",
        isCollapsible ? "is-collapsible" : "",
        isCollapsible && open ? "is-open" : "",
        hasActiveChild ? "has-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Encabezado de sección */}
      {!sidebarCollapsed && (
        isCollapsible ? (
          <button
            type="button"
            className="mf-nav__section-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <span className="mf-nav__section-toggle-content">
              {section.icon && (
                <span className="mf-nav__section-icon" aria-hidden>
                  {section.icon}
                </span>
              )}
              <span className="mf-nav__section-toggle-label">{section.label}</span>
            </span>
            <span
              className="mf-nav__section-chevron"
              aria-hidden
            >
              <Icon name="ChevronDown" />
            </span>
          </button>
        ) : (
          <div className="mf-nav__section-label">
            {section.icon && (
              <span className="mf-nav__section-icon mf-nav__section-icon--static" aria-hidden>
                {section.icon}
              </span>
            )}
            {section.label}
          </div>
        )
      )}

      {/* Lista de items con animación de acordeón */}
      <div className="mf-nav__section-body">
        <ul className="mf-nav__list" aria-hidden={isCollapsible && !open}>
          {isOpen &&
            section.items.map((it) => (
              <li key={it.key}>
                <NavLink
                  to={it.to}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    "mf-nav__link" + (isActive ? " is-active" : "")
                  }
                >
                  {/* Barra izquierda (activo) */}
                  <span className="mf-nav__rail" aria-hidden />
                  {renderIcon(it.icon)}
                  {!sidebarCollapsed && (
                    <span className="mf-nav__label">{it.label}</span>
                  )}
                  {!sidebarCollapsed && it.badge ? (
                    <span className="mf-nav__badge" aria-hidden>
                      {it.badge}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export function Sidebar({
  sections,
  collapsed = false,
  onToggle,
  onMobileClose,
  footer,
  brand,
  className = "",
  density = "comfortable",
}: SidebarProps) {
  return (
    <aside
      className={[
        "mf-sidebar",
        collapsed ? "is-collapsed" : "",
        density === "compact" ? "is-compact" : "",
        className,
      ].join(" ")}
      aria-label="Menú principal"
    >
      <div onClick={onToggle} className="mf-sidebar__brand">
        <div className="mf-brand__logo">
          {brand?.icon ?? (
            <span className="mf-brand__icon" aria-hidden>
              <Icon name="UtensilsCrossed" />
            </span>
          )}
        </div>
        {!collapsed && (
          <div className="mf-brand__textwrap">
            <div className="mf-brand__title">{brand?.text ?? "MesaFácil"}</div>
            {brand?.subtext ? (
              <div className="mf-brand__subtitle">{brand.subtext}</div>
            ) : null}
          </div>
        )}
        {onToggle && (
          <button
            className="mf-iconbtn mf-sidebar__collapse"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <span className="mf-chevron" aria-hidden>
              {collapsed ? "›" : "‹"}
            </span>
          </button>
        )}
      </div>

      <nav className="mf-sidebar__nav" role="navigation">
        {sections.map((sec) => (
          <NavSection
            key={sec.key}
            section={sec}
            sidebarCollapsed={collapsed}
            onNavClick={onMobileClose}
          />
        ))}
      </nav>

      <div className="mf-sidebar__footer">{footer}</div>
    </aside>
  );
}

export default Sidebar;
