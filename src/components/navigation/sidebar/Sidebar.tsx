import React from "react";
import { NavLink } from "react-router-dom";
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
};

export type SidebarProps = {
  sections: SidebarSection[];
  collapsed?: boolean;
  onToggle?: () => void;
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

export function Sidebar({
  sections,
  collapsed = false,
  onToggle,
  footer,
  brand,
  className = "",
  density = "comfortable",
}: SidebarProps) {
  NavLink;
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
          <div key={sec.key} className="mf-nav__section">
            {!collapsed && (
              <div className="mf-nav__section-label">{sec.label}</div>
            )}
            <ul className="mf-nav__list">
              {sec.items.map((it) => (
                <li key={it.key}>
                  <NavLink
                    to={it.to}
                    className={({ isActive }) =>
                      "mf-nav__link" + (isActive ? " is-active" : "")
                    }
                  >
                    {/* Barra izquierda (activo) */}
                    <span className="mf-nav__rail" aria-hidden />
                    {renderIcon(it.icon)}
                    {!collapsed && (
                      <span className="mf-nav__label">{it.label}</span>
                    )}
                    {!collapsed && it.badge ? (
                      <span className="mf-nav__badge" aria-hidden>
                        {it.badge}
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mf-sidebar__footer">{footer}</div>
    </aside>
  );
}

export default Sidebar;
