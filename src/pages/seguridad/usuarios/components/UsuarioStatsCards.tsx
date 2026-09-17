import React from "react";
import Icon from "../../../../components/ui/icons/Icon";
import type { UsuarioStats, EstadoFilterType } from "../types";

interface UsuarioStatsCardsProps {
  stats: UsuarioStats;
  currentFilter: EstadoFilterType;
  onSelectFilter: (filter: EstadoFilterType) => void;
}

export const UsuarioStatsCards: React.FC<UsuarioStatsCardsProps> = ({
  stats,
  currentFilter,
  onSelectFilter,
}) => {
  return (
    <div className="users-stats-grid" role="region" aria-label="Métricas de usuarios">
      {/* 1. Total Personal */}
      <button
        type="button"
        className={`users-stat-card ${currentFilter === "ALL" ? "is-selected" : ""}`}
        onClick={() => onSelectFilter("ALL")}
        title="Ver todos los usuarios"
      >
        <div className="users-stat-card__icon-wrapper is-primary">
          <Icon name="Users" size={20} />
        </div>
        <div className="users-stat-card__content">
          <span className="users-stat-card__label">Total Usuarios</span>
          <span className="users-stat-card__value">{stats.total}</span>
        </div>
      </button>

      {/* 2. Personal Activo */}
      <button
        type="button"
        className={`users-stat-card ${currentFilter === "ACTIVE" ? "is-selected" : ""}`}
        onClick={() => onSelectFilter(currentFilter === "ACTIVE" ? "ALL" : "ACTIVE")}
        title="Filtrar por usuarios activos"
      >
        <div className="users-stat-card__icon-wrapper is-success">
          <Icon name="UserCheck" size={20} />
        </div>
        <div className="users-stat-card__content">
          <span className="users-stat-card__label">Usuarios Activos</span>
          <div className="users-stat-card__value-row">
            <span className="users-stat-card__value">{stats.activos}</span>
            <span className="users-stat-card__sub">
              {stats.total > 0 ? Math.round((stats.activos / stats.total) * 100) : 0}%
            </span>
          </div>
        </div>
      </button>

      {/* 3. En Turno de Caja (POS / Comandero) */}
      <button
        type="button"
        className={`users-stat-card ${currentFilter === "OPEN_TURNO" ? "is-selected" : ""}`}
        onClick={() => onSelectFilter(currentFilter === "OPEN_TURNO" ? "ALL" : "OPEN_TURNO")}
        title="Filtrar por usuarios con turno de caja abierto"
      >
        <div className="users-stat-card__icon-wrapper is-info">
          <Icon name="Clock" size={20} />
        </div>
        <div className="users-stat-card__content">
          <div className="users-stat-card__label-row">
            <span className="users-stat-card__label">En Turno de Caja</span>
            {stats.enTurno > 0 && <span className="users-stat-card__pulse-dot" aria-hidden />}
          </div>
          <span className="users-stat-card__value">{stats.enTurno}</span>
        </div>
      </button>

      {/* 4. Candados de Supervisor (Spec 024) */}
      <button
        type="button"
        className={`users-stat-card ${
          currentFilter === "SUPERVISOR_LOCKED" ? "is-selected" : ""
        } ${stats.supervisoresBloqueados > 0 ? "has-alert" : ""}`}
        onClick={() =>
          stats.supervisoresBloqueados > 0
            ? onSelectFilter(currentFilter === "SUPERVISOR_LOCKED" ? "ALL" : "SUPERVISOR_LOCKED")
            : undefined
        }
        title={
          stats.supervisoresBloqueados > 0
            ? "¡Alerta! Hay supervisores con PIN bloqueado por intentos fallidos. Clic para filtrar."
            : "Supervisores con candado de seguridad activo"
        }
      >
        <div
          className={`users-stat-card__icon-wrapper ${
            stats.supervisoresBloqueados > 0 ? "is-danger" : "is-warning"
          }`}
        >
          <Icon
            name={stats.supervisoresBloqueados > 0 ? "ShieldAlert" : "ShieldCheck"}
            size={20}
          />
        </div>
        <div className="users-stat-card__content">
          <span className="users-stat-card__label">Candado Supervisor</span>
          <div className="users-stat-card__value-row">
            <span className="users-stat-card__value">{stats.conPinSupervisor}</span>
            {stats.supervisoresBloqueados > 0 && (
              <span className="users-stat-card__badge-danger">
                {stats.supervisoresBloqueados} bloqueado(s)
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
