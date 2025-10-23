import { Button } from "../ui/button";
import Icon from "../ui/icons/Icon";
import "./data-table.css";

export function DataTablePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  const totalPages = Math.max(
    1,
    Math.ceil((totalCount || 0) / (pageSize || 1))
  );
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mf-pagination">
      <div className="mf-page-status">
        Mostrando {(page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, totalCount)} de {totalCount}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="mf-page-size">
          <select
            aria-label="Tamaño de página"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s} / pág.
              </option>
            ))}
          </select>
        </div>

        <div className="mf-page-group">
          <Button
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!canPrev}
            aria-label="Primera"
            style={{margin: 10}}
          >
            <Icon name="ChevronLeft" />
          </Button>
          <Button
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPrev}
            style={{margin: 10}}
          >
            Anterior
          </Button>
          <span className="mf-page-label">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNext}
            style={{margin: 10}}
          >
            Siguiente
          </Button>
          <Button
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!canNext}
            aria-label="Última"
            style={{margin: 10}}
          >
            <Icon name="ChevronRight" />
          </Button>
        </div>
      </div>
    </div>
  );
}
