import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type DataTableProps } from "./types";
import { DataTablePagination } from "./DataTablePagination";
import "./data-table.css";
import Icon from "../ui/icons/Icon";

export function DataTable<T extends object>({
  columns,
  data,
  rowId,
  page,
  pageSize,
  totalCount,
  isLoading,
  error,
  onPageChange,
  onPageSizeChange,
  toolbar,
  emptyCta,
  rowActions,
  actionsHeader = "Acciones",
  stickyActions = false,
  revealActionsOnHover = true,
}: DataTableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns: columns as ColumnDef<T, any>[],
    getCoreRowModel: getCoreRowModel(),
  });

  const colCount = table.getAllLeafColumns().length || columns.length || 4;
  const skelRows = Math.max(4, Math.min(pageSize || 10, 8));
  const colHasActions = typeof rowActions === "function";

  return (
    <div
      className={`mf-table ${isLoading ? "is-loading" : ""} ${stickyActions ? "is-sticky-actions" : ""}`}
    >
      <div className="mf-table__toolbar">{toolbar}</div>

      {isLoading ? (
        <div className="mf-table__scroll">
          <table>
            <thead className="mf-thead">
              <tr>
                {Array.from({ length: colCount }).map((_, i) => (
                  <th key={i} className="mf-th">
                    <span
                      className="mf-skel is-line-sm"
                      style={{ width: `${60 - i * 5}%` }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: skelRows }).map((_, r) => (
                <tr key={r} className="mf-tr">
                  {Array.from({ length: colCount }).map((__, c) => (
                    <td key={c} className="mf-td">
                      <span
                        className="mf-skel"
                        style={{ width: `${70 - ((r + c) % 5) * 10}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div role="alert" aria-live="polite" className="mf-error">
          <div className="mf-error__icon" aria-hidden>
            <Icon name="AlertTriangle" size={18} />
          </div>

          <div>
            <p className="mf-error__title">
              Ocurrió un error:{" "}
              {typeof error === "string" ? error : "No se pudo cargar"}
            </p>
            <p className="mf-error__desc">Reintenta o ajusta los filtros.</p>
          </div>

          <div className="mf-error__actions"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="mf-empty" role="status" aria-live="polite">
          <div className="mf-empty-illo" aria-hidden>
            <Icon name="Inbox" size={28} />
          </div>
          <h3 className="mf-empty-title">Sin resultados</h3>
          <p className="mf-empty-desc">
            No encontramos coincidencias. Ajusta filtros o crea un elemento.
          </p>
          <div className="mf-empty-actions">{emptyCta}</div>
        </div>
      ) : (
        !isLoading &&
        !error &&
        data.length > 0 && (
          <div className="mf-table__scroll">
            <table>
              <thead className="mf-thead">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th key={header.id} className="mf-th">
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </th>
                    ))}

                    {colHasActions && (
                      <th
                        className={`mf-th --actions ${stickyActions ? "is-sticky" : ""}`}
                        aria-label={
                          typeof actionsHeader === "string"
                            ? actionsHeader
                            : undefined
                        }
                      >
                        {actionsHeader}
                      </th>
                    )}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => {
                  if (!row || !row.original) return null;
                  return (
                  <tr
                    key={String(rowId(row.original))}
                    className={`mf-tr ${revealActionsOnHover ? "" : "show-actions"}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="mf-td">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}

                    {colHasActions && (
                      <td
                        className={`mf-td --actions ${stickyActions ? "is-sticky" : ""}`}
                      >
                        <div className="mf-actions">
                          {rowActions!(row.original)}
                        </div>
                      </td>
                    )}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )
      )}

      <div className="mf-table__footer">
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
