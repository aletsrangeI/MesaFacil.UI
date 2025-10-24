import type { ColumnDef } from "@tanstack/react-table";

export type UsuarioRow = {
  id: number;
  idEmpresa: string;
  nombreCompleto: boolean;
  correo: boolean;
};

export type UsuarioFormValues = {
  idEmpresa: string;
  nombreCompleto: boolean;
  correo: boolean;
};

export type RolesColumnsBuilder = (args: {
  canDelete: (row: UsuarioRow) => boolean;
  onEdit: (row: UsuarioRow) => void;
  onDelete: (row: UsuarioRow) => Promise<void>;
}) => ColumnDef<UsuarioRow, any>[];
