import React from "react";
import { Input } from "../../../../components/ui/input/Input";
import { Button } from "../../../../components/ui/button/Button";
import Icon from "../../../../components/ui/icons/Icon";
import type { UsuarioFiltersState, EstadoFilterType } from "../types";

interface UsuarioFiltersProps {
  filters: UsuarioFiltersState;
  onChangeFilter: <K extends keyof UsuarioFiltersState>(key: K, value: UsuarioFiltersState[K]) => void;
  onResetFilters: () => void;
  sucursales: Array<{ id: number; nombre: string }>;
  roles: Array<{ id: number; nombre: string }>;
  totalFiltered: number;
  totalUsers: number;
}

export const UsuarioFilters: React.FC<UsuarioFiltersProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  sucursales,
  roles,
  totalFiltered,
  totalUsers,
}) => {
  const isFiltered =
    Boolean(filters.search.trim()) ||
    Boolean(filters.idSucursal) ||
    Boolean(filters.idRol) ||
    filters.estado !== "ALL";

  return (
    <div className="users-filters-bar">
      <div className="users-filters-bar__inputs">
        {/* Búsqueda por texto */}
        <div className="users-filters-bar__search">
          <Input
            placeholder="Buscar por nombre, correo o rol..."
            leftIcon={<Icon name="Search" size={16} />}
            value={filters.search}
            onChange={(e) => onChangeFilter("search", e.target.value)}
            clearable
            onClear={() => onChangeFilter("search", "")}
          />
        </div>

        {/* Filtro por Sucursal */}
        <div className="users-filters-bar__select-wrapper">
          <label htmlFor="filter-sucursal" className="users-filters-bar__label">
            <Icon name="Building2" size={14} />
            <span>Sucursal</span>
          </label>
          <select
            id="filter-sucursal"
            className="users-filters-bar__select"
            value={filters.idSucursal}
            onChange={(e) => onChangeFilter("idSucursal", e.target.value)}
          >
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Rol */}
        <div className="users-filters-bar__select-wrapper">
          <label htmlFor="filter-rol" className="users-filters-bar__label">
            <Icon name="Shield" size={14} />
            <span>Rol</span>
          </label>
          <select
            id="filter-rol"
            className="users-filters-bar__select"
            value={filters.idRol}
            onChange={(e) => onChangeFilter("idRol", e.target.value)}
          >
            <option value="">Todos los roles</option>
            {roles.map((r) => (
              <option key={r.id} value={String(r.id)}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div className="users-filters-bar__select-wrapper">
          <label htmlFor="filter-estado" className="users-filters-bar__label">
            <Icon name="Filter" size={14} />
            <span>Estado</span>
          </label>
          <select
            id="filter-estado"
            className="users-filters-bar__select"
            value={filters.estado}
            onChange={(e) => onChangeFilter("estado", e.target.value as EstadoFilterType)}
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Solo Activos</option>
            <option value="INACTIVE">Solo Inactivos</option>
            <option value="OPEN_TURNO">En Turno de Caja</option>
            <option value="SUPERVISOR_LOCKED">PIN Bloqueado</option>
          </select>
        </div>
      </div>

      <div className="users-filters-bar__meta">
        <span className="users-filters-bar__counter">
          Mostrando <strong>{totalFiltered}</strong> de {totalUsers} usuarios
        </span>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Icon name="RotateCcw" size={14} />}
            onClick={onResetFilters}
          >
            Restablecer
          </Button>
        )}
      </div>
    </div>
  );
};
