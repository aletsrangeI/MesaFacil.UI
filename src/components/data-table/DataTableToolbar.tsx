import type { ReactNode } from "react";
import { Button } from "../../components/ui/button";
import Icon from "../../components/ui/icons/Icon";
import "./data-table.css";

type Props = {
  title?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;

  /** Acciones a la izquierda (ej. Crear) */
  leftActions?: ReactNode;
  /** Acciones a la derecha (ej. Exportar, Columnas, Densidad…) */
  rightActions?: ReactNode;

  /** Slot bajo el toolbar para filtros avanzados (chips, selects) */
  filtersInline?: ReactNode;
};

export default function DataTableToolbar({
  title,
  searchValue = "",
  onSearchChange,
  onRefresh,
  isRefreshing = false,
  leftActions,
  rightActions,
  filtersInline,
}: Props) {
  return (
    <div className="mf-toolbar">
      <div className="mf-toolbar__row">
        <div className="mf-toolbar__left">
          {title ? <h3 className="mf-toolbar__title">{title}</h3> : null}
          {leftActions}
        </div>

        <div className="mf-toolbar__right">
          {/* Buscador */}
          {onSearchChange && (
            <label className="mf-input mf-input--search">
              <Icon name="Search" size={18} aria-hidden />
              <input
                placeholder="Buscar…"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Buscar en la tabla"
              />
              {searchValue ? (
                <button
                  type="button"
                  className="mf-input__clear"
                  aria-label="Limpiar búsqueda"
                  onClick={() => onSearchChange("")}
                >
                  <Icon name="X" size={16} />
                </button>
              ) : null}
            </label>
          )}

          {/* Refresh */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              leftIcon={<Icon name="RefreshCw" />}
            >
              Actualizar
            </Button>
          )}

          {/* Acciones derechas (Exportar, Columnas, Densidad…) */}
          {rightActions}
        </div>
      </div>

      {filtersInline ? (
        <>
          <div className="mf-toolbar__sep" />
          <div className="mf-toolbar__filters">{filtersInline}</div>
        </>
      ) : null}
    </div>
  );
}
