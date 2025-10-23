import { type ColumnDef } from "@tanstack/react-table";

export type RowId = string | number;

export type PagedResponse<T> = {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: T[];
  isSuccess: boolean;
  message: string;
  errors: any[];
};

export type DataTableProps<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  rowId: (row: T) => RowId;
  page: number; // 1-based
  pageSize: number;
  totalCount: number;
  isLoading?: boolean;
  error?: string | null;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  toolbar?: React.ReactNode; // opcional: search/filtros
  emptyCta?: React.ReactNode; // opcional: botón "Crear"
  rowActions?: (row: T) => React.ReactNode;
  /** Opcional: texto/elemento para el header de acciones (default: "Acciones") */
  actionsHeader?: React.ReactNode;
  /** Opcional: fija la columna de acciones al final (sticky) */
  stickyActions?: boolean;
  /** Opcional: mostrar acciones solo al hover (default: true) */
  revealActionsOnHover?: boolean;
};
