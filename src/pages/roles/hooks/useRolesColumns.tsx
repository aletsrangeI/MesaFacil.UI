// src/pages/roles/hooks/useRolesColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { RolRow } from "./types";

// Usa TUS componentes
import { Button } from "../../../components/ui/button";
import Icon from "../../../components/ui/icons/Icon";

export function useRolesColumns(args: {
  onEdit: (row: RolRow) => void;
  onDelete: (row: RolRow) => Promise<void>;
  canDelete?: (row: RolRow) => boolean;
}): ColumnDef<RolRow, any>[] {
  const canDelete = args.canDelete ?? ((r) => !r.isSystem);
  const yesNo = (v: boolean) =>
    v ? (
      <Button
        variant="confirm"
        disabled
        iconOnly
        leftIcon={<Icon name="Check" />}
      />
    ) : (
      <Button
        variant="primary"
        disabled
        iconOnly
        leftIcon={<Icon name="X" />}
      />
    );
  return [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    {
      accessorKey: "isSystem",
      header: "Sistema",
      cell: ({ row }) => yesNo(row.original.isSystem),
    },
    {
      accessorKey: "isAssignable",
      header: "Asignable",
      cell: ({ row }) => yesNo(row.original.isAssignable),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original as RolRow;
        const deletable = canDelete(r);

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
