import type { ColumnDef } from "@tanstack/react-table";

export type RolRow = {
  id: number;
  nombre: string;
  isSystem: boolean;
  isAssignable: boolean;
};

export type RoleFormValues = {
  nombre: string;
  isSystem: boolean;
  isAssignable: boolean;
};

// Helper para columnas (opcional)
export type RolesColumnsBuilder = (args: {
  canDelete: (row: RolRow) => boolean;
  onEdit: (row: RolRow) => void;
  onDelete: (row: RolRow) => Promise<void>;
}) => ColumnDef<RolRow, any>[];
