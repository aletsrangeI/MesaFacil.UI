import { useCallback } from "react";
import { useToast } from "../../../components/ui/toast/";
import { useRolesTableState } from "./useRolesTableState";
import { useRolesData } from "./useRolesData";
import { useRoleMutations } from "./useRoleMutations";
import { useRoleCreate } from "./useRoleCreate";
import { useRoleEdit } from "./useRoleEdit";
import { useRolesColumns } from "./useRolesColumns";
import type { RolRow } from "./types";
import { useConfirm } from "../../../components/ui/toast/feedback";

export function useRolesTable() {
  // Estado de tabla
  const table = useRolesTableState();

  // Datos
  const data = useRolesData(table);

  // Mutations (usamos solo delete en el façade)
  const { deleteRol, isMutating } = useRoleMutations();

  // Toasts y confirms
  const { addToast } = useToast();
  const confirm = useConfirm();

  // Modales (refetch al terminar)
  const create = useRoleCreate(async () => {
    await data.refetch();
  });
  const edit = useRoleEdit(async () => {
    await data.refetch();
  });

  const canDelete = useCallback((row: RolRow) => !row.isSystem, []);
  const onEdit = useCallback((row: RolRow) => edit.openEdit(row), [edit]);

  const onDelete = useCallback(
    async (row: RolRow) => {
      // Mostramos el diálogo de confirmación antes de eliminar
      const ok = await confirm({
        variant: "confirm",
        title: "¿Eliminar rol?",
        description: `¿Seguro que deseas eliminar el rol "${row.nombre}"? Esta acción no se puede deshacer.`,
        confirmLabel: "Eliminar",
        cancelLabel: "Cancelar",
        destructive: true,
        iconName: "Trash2",
        showButtons: false,
      });

      if (!ok) return; // el usuario canceló

      try {
        await deleteRol({ id: row.id }).unwrap();

        addToast({
          message: "Rol eliminado.",
          variant: "success",
          duration: 3000,
        });

        await data.refetch();
      } catch (e: any) {
        const msg =
          e?.data?.message ??
          e?.error ??
          e?.message ??
          "No fue posible eliminar el rol.";
        addToast({ message: msg, variant: "error", duration: 4000 });
      }
    },
    [addToast, confirm, data, deleteRol]
  );
  const columns = useRolesColumns({ onEdit, onDelete, canDelete });

  const refresh = useCallback(() => data.refetch(), [data]);
  // API pública
  return {
    // Tabla
    columns,
    rows: data.rows,
    totalCount: data.totalCount,
    page: table.page,
    pageSize: table.pageSize,
    sort: table.sort,
    filter: table.filter,
    onPageChange: table.onPageChange,
    onPageSizeChange: table.onPageSizeChange,
    onSortChange: table.onSortChange,
    onFilterChange: table.onFilterChange,
    refresh,

    // Estados
    isLoading: data.isLoading,
    isFetching: data.isFetching,
    isBusy: data.isFetching || isMutating || create.isSaving || edit.isSaving,

    // Crear
    create: {
      formFields: create.formFields,
      initialValues: create.initialValues,
      isFetching: create.isFetching,
      isOpen: create.isOpen,
      isError: create.isError,
      isSaving: create.isSaving,
      saveError: create.saveError,
      openCreate: create.openCreate,
      closeCreate: create.closeCreate,
      formId: create.formId,
      // Ya no pasamos trigger; el hook interna usa unwrap()
      handleCreateSubmit: (values: any) => create.handleCreateSubmit(values),
      components: create.components,
      title: create.title,
      description: create.description,
    },

    // Editar
    edit: {
      current: edit.current,
      isOpen: edit.isOpen,
      formFields: edit.formFields,
      initialValues: edit.initialValues,
      isFetching: edit.isFetching,
      isError: edit.isError,
      isSaving: edit.isSaving,
      saveError: edit.saveError,
      openEdit: edit.openEdit,
      closeEdit: edit.closeEdit,
      // Igual, sin trigger externo
      handleEditSubmit: (values: any) => edit.handleEditSubmit(values),
      components: edit.components,
      title: edit.title,
      description: edit.description,
      formId: edit.formId,
    },
  };
}
