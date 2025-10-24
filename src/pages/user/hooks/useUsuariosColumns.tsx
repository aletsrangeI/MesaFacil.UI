import type { ColumnDef } from "@tanstack/react-table";
import type { UsuarioRow } from "./types";
import { Button } from "../../../components/ui/button";
import Icon from "../../../components/ui/icons/Icon";

export function useUsuariosColumns(args: {
  onEdit: (row: UsuarioRow) => void;
  onDelete: (row: UsuarioRow) => Promise<void>;
  canDelete?: (row: UsuarioRow) => boolean;
}): ColumnDef<UsuarioRow, any>[] {
  const canDelete = true;

  return [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombreCompleto", header: "Nombre" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original as UsuarioRow;
        const deletable = canDelete;

        return (
          <div
            // contenedor estable para que no cambie el layout entre filas
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              minWidth: 96, // ~ dos icon-buttons con gap
              paddingInline: 4,
            }}
          >
            <Button
              type="button"
              variant="primary"
              size="sm"
              iconOnly
              aria-label="Editar"
              title="Editar"
              leftIcon={<Icon name="Pencil" />}
              onClick={() => args.onEdit(r)}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconOnly
              aria-label={deletable ? "Eliminar" : "No permitido (Sistema)"}
              title={deletable ? "Eliminar" : "No permitido (Sistema)"}
              leftIcon={<Icon name="Trash2" />}
              disabled={!deletable}
              onClick={() => deletable && args.onDelete(r)}
            />
          </div>
        );
      },
    },
  ];
}
