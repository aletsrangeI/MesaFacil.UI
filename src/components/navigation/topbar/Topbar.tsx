// src/components/navigation/topbar/Topbar.tsx
import React from "react";
import "./topbar.css";
import Icon from "../../ui/icons/Icon";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { logout } from "../../../state/authSlice";

export type TopbarProps = {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;     // botones extra (notificaciones, etc.)
  onSearch?: (term: string) => void;
  showBrand?: boolean;           // si no quieres repetir la marca con la del Sidebar
  onMenuClick?: () => void;      // callback para el menú hamburguesa en mobile
};

export default function Topbar({
  title,
  subtitle,
  actions,
  onSearch,
  showBrand = true,
  onMenuClick,
}: TopbarProps) {
  const dispatch = useDispatch();
  const { nombreCompleto, correo, nombreSucursal, idSucursal } = useSelector((s: RootState) => s.auth);

  return (
    <header className="mf-topbar" role="banner" aria-label="Barra superior">
      <div className="mf-topbar__left">
        {onMenuClick && (
          <button 
            className="mf-topbar__menu-btn" 
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Icon name="Menu" />
          </button>
        )}
        {showBrand && (
          <div className="mf-topbar__brand">
            <span className="mf-brand__logo" aria-hidden>
              <Icon name="UtensilsCrossed" />
            </span>
            <div className="mf-brand__text">
              <strong className="mf-brand__title">MesaFácil</strong>
              {subtitle && <span className="mf-brand__subtitle">{subtitle}</span>}
            </div>
          </div>
        )}

        {title && <h1 className="mf-topbar__title">{title}</h1>}

        {onSearch && (
          <label className="mf-topbar__search" aria-label="Buscar">
            <Icon name="Search" className="mf-topbar__search-icon" />
            <input
              className="mf-topbar__search-input"
              type="search"
              placeholder="Buscar…"
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>
        )}
      </div>

      <div className="mf-topbar__right">
        {actions}
        {(nombreSucursal || idSucursal) && (
          <div
            className="mf-topbar__branch"
            title={`Sucursal asignada: ${nombreSucursal || `Sucursal #${idSucursal}`}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 8,
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: '#2563eb',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <Icon name="MapPin" size={14} />
            <span>{nombreSucursal || `Sucursal #${idSucursal}`}</span>
          </div>
        )}
        <div className="mf-topbar__user">
          <div className="mf-topbar__name">{nombreCompleto ?? "Usuario"}</div>
          <div className="mf-topbar__email">{correo ?? ""}</div>
        </div>
        <button
          className="mf-topbar__logout"
          onClick={() => dispatch(logout())}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <Icon name="LogOut" />
        </button>
      </div>
    </header>
  );
}
