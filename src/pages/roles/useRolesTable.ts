import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { mesaFacilFields } from "../../components/ui/adapters";
import {
  useFormFieldGetFormFieldByFormCatIdQuery,
  useRolGetAllWithPaginationQuery,
  useRolInsertMutation,
  useRolUpdateMutation,
  useRolDeleteMutation,
  type RolGetAllWithPaginationApiResponse,
} from "../../services/generated/api";
import type { ApiFormField } from "../../forms/types";
import { useToast } from "../../components/ui/toast/";

export type RolRow = {
  id: number;
  nombre: string;
  isSystem: boolean;
  isAssignable: boolean;
};

type UseRolesTableOptions = {
  apiPageStartsAt?: 0 | 1;
  onEditRequested?: (row: RolRow) => void;
  onCreateRequested?: () => void;
};

// Utilidad para coercer boolean
const toBool = (v: unknown): boolean =>
  typeof v === "boolean" ? v : String(v ?? "false").toLowerCase() === "true";

// Helper para leer propiedades del objeto de forma insensible a mayúsculas/minúsculas y variaciones de idioma
const getVal = (obj: Record<string, unknown>, key: string): any => {
  const normalizedKey = key.toLowerCase();
  const foundKey = Object.keys(obj).find((k) => {
    const normK = k.toLowerCase();
    return (
      normK === normalizedKey ||
      (normalizedKey === "issystem" && (normK === "sistema" || normK === "system")) ||
      (normalizedKey === "isassignable" && (normK === "asignable" || normK === "assignable"))
    );
  });
  return foundKey ? obj[foundKey] : undefined;
};

export function useRolesTable(opts?: UseRolesTableOptions) {
  const { addToast } = useToast();
  const apiStartsAt = opts?.apiPageStartsAt ?? 1;
  // ---------------------------
  // Estado de tabla (solo page/pageSize; el resto lo da la query)
  // ---------------------------
  const [page, setPage] = useState<number>(apiStartsAt);
  const [pageSize, setPageSize] = useState<number>(10);

  // 🔗 Query real de paginación
  const {
    data: paged,
    isLoading: isPageLoading,
    isFetching: isPageFetching,
    refetch: refetchPage,
    error: pageError,
  } = useRolGetAllWithPaginationQuery({ page, pageSize });

  const rows: RolRow[] = useMemo(() => {
    const list = (paged as RolGetAllWithPaginationApiResponse | undefined)?.data ?? [];
    return list.map((r: any) => ({
      id: r.id,
      nombre: r.nombre,
      isSystem: Boolean(r.isSystem),
      isAssignable: Boolean(r.isAssignable),
    }));
  }, [paged]);

  const totalCount =
    (paged as RolGetAllWithPaginationApiResponse | undefined)?.totalCount ?? 0;

  const error = pageError
    ? "status" in (pageError as any) && (pageError as any).status
      ? "Error al cargar roles"
      : String(pageError)
    : null;

  const isLoading = isPageLoading && !paged;
  const isFetching = isPageFetching;

  const refetch = useCallback(() => {
    refetchPage();
  }, [refetchPage]);
  // ---------------------------
  // Columnas y acciones de fila
  // ---------------------------
  const columns: ColumnDef<RolRow, any>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "nombre", header: "Nombre" },
      {
        accessorKey: "isSystem",
        header: "Sistema",
        cell: ({ row }) => (row.original.isSystem ? "Sí" : "No"),
      },
      {
        accessorKey: "isAssignable",
        header: "Asignable",
        cell: ({ row }) => (row.original.isAssignable ? "Sí" : "No"),
      },
    ],
    []
  );
  const openEdit = useCallback((row: RolRow) => {
    setEditing(row);
    setEditSaveError(null);
    setIsEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setIsEditOpen(false);
    setEditing(null);
    setEditSaveError(null);
  }, []);

  const [deleteRol] = useRolDeleteMutation();

  const rowActionFor = useCallback(
    (row: RolRow) => {
      const canDelete = !row.isSystem;

      const onEdit = () => openEdit(row);

      const onDelete = async () => {
        if (!canDelete) return;
        try {
          await deleteRol({ id: row.id }).unwrap();
          addToast({
            message: "Rol eliminado correctamente.",
            variant: "success",
          });
          closeEdit(); // por si venías del modal
          refetch();
        } catch (e: any) {
          const msg =
            e?.data?.message ??
            e?.error ??
            e?.message ??
            "No fue posible eliminar el rol.";
          addToast({ message: msg, variant: "error", duration: 4000 });
        }
      };

      return { canDelete, onEdit, onDelete };
    },
    [openEdit, deleteRol, refetch, addToast, closeEdit]
  );

  // ---------------------------
  // Modal de creación (form dinámico)
  // ---------------------------
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const formId = "crear-rol-form";

  const openCreate = useCallback(() => {
    setIsCreateOpen(true);
    setSaveError(null);
    opts?.onCreateRequested?.();
  }, [opts]);

  const closeCreate = useCallback(() => {
    setIsCreateOpen(false);
    setSaveError(null);
  }, []);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<RolRow | null>(null);
  const [editSaveError, setEditSaveError] = useState<string | null>(null);
  const editFormId = "editar-rol-form";

  const {
    data: editFormResp,
    isFetching: isFetchingEditForm,
    isError: isEditFormError,
  } = useFormFieldGetFormFieldByFormCatIdQuery(
    { id: 3 },
    { skip: !isEditOpen }
  );

  const editFields: ApiFormField[] = useMemo(() => {
    if (!Array.isArray(editFormResp?.data)) return [];
    return [...(editFormResp.data as ApiFormField[])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [editFormResp]);

  // valores iniciales a partir del row seleccionado
  const editInitialValues = useMemo(() => {
    if (!editing) return {};
    const vals: Record<string, any> = {};

    const nameField = editFields.find((f) => f.name.toLowerCase() === "nombre");
    const nameKey = nameField?.name ?? "nombre";

    const systemField = editFields.find(
      (f) =>
        f.name.toLowerCase() === "issystem" ||
        f.name.toLowerCase() === "sistema" ||
        f.name.toLowerCase() === "system"
    );
    const systemKey = systemField?.name ?? "isSystem";

    const assignableField = editFields.find(
      (f) =>
        f.name.toLowerCase() === "isassignable" ||
        f.name.toLowerCase() === "asignable" ||
        f.name.toLowerCase() === "assignable"
    );
    const assignableKey = assignableField?.name ?? "isAssignable";

    vals[nameKey] = editing.nombre;
    vals[systemKey] = editing.isSystem ? "true" : "false";
    vals[assignableKey] = editing.isAssignable ? "true" : "false";

    return vals;
  }, [editing, editFields]);

  const [updateRol, updateState] = useRolUpdateMutation();
  const isUpdating = updateState.isLoading;

  const handleEditSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      console.log("Roles Formik Submit Values (Edit):", JSON.stringify(values, null, 2));
      if (!editing) return;
      setEditSaveError(null);

      const nombre = String(getVal(values, "nombre") ?? "").trim();

      if (!nombre) {
        const msg = "El nombre del rol es obligatorio.";
        setEditSaveError(msg);
        addToast({ message: msg, variant: "error" });
        return;
      }

      const dto = {
        id: editing.id,
        nombre,
        isSystem: toBool(getVal(values, "issystem")),
        isAssignable: toBool(getVal(values, "isassignable")),
      };

      try {
        await updateRol({ rolDto: dto }).unwrap();
        closeEdit();
        refetch();
        addToast({
          message: "Rol actualizado correctamente.",
          variant: "success",
        });
      } catch (e: any) {
        const msg =
          e?.data?.message ??
          e?.error ??
          e?.message ??
          "No fue posible actualizar el rol.";
        setEditSaveError(msg);
        addToast({ message: msg, variant: "error", duration: 4000 });
      }
    },
    [editing, updateRol, closeEdit, refetch, addToast]
  );

  // Metadata del formulario directo desde backend, solo ordenado por 'order'
  // Ajusta "ROL_CREATE" al code real si usas otro.
  const {
    data: createFormResp,
    isFetching: isFetchingCreateForm,
    isError: isCreateFormError,
  } = useFormFieldGetFormFieldByFormCatIdQuery(
    { id: 3 },
    { skip: !isCreateOpen }
  );

  const createFields: ApiFormField[] = useMemo(() => {
    if (!Array.isArray(createFormResp?.data)) return [];
    return [...(createFormResp!.data as ApiFormField[])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [createFormResp]);

  const [createRol, createState] = useRolInsertMutation(); // <- RTK Query mutation
  const isSaving = createState.isLoading;

  const handleCreateSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      console.log("Roles Formik Submit Values (Create):", JSON.stringify(values, null, 2));
      setSaveError(null);

      const nombre = String(getVal(values, "nombre") ?? "").trim();

      if (!nombre) {
        const msg = "El nombre del rol es obligatorio.";
        setSaveError(msg);
        addToast({ message: msg, variant: "error" });
        return;
      }

      const payload = {
        nombre,
        isSystem: toBool(getVal(values, "issystem")),
        isAssignable: toBool(getVal(values, "isassignable")),
      };

      try {
        await createRol({ rolDto: payload }).unwrap();
        closeCreate();
        refetch();
        addToast({ message: "Rol creado correctamente.", variant: "success" });
      } catch (e: any) {
        const msg =
          e?.data?.message ??
          e?.error ??
          e?.message ??
          "No fue posible guardar el rol.";
        setSaveError(msg);
        addToast({ message: msg, variant: "error", duration: 4000 });
      }
    },
    [createRol, closeCreate, refetch, addToast]
  );

  return {
    // Tabla
    table: {
      columns,
      rows,
      totalCount,
      page,
      pageSize,
      isLoading,
      isFetching,
      error,
      setPage,
      setPageSize,
      refetch,
      rowActionFor,
    },

    // Modal crear
    createModal: {
      open: isCreateOpen,
      formId,
      fields: createFields,
      isFetching: isFetchingCreateForm,
      isError: isCreateFormError,
      isSaving,
      saveError,
      openCreate,
      closeCreate,
      handleCreateSubmit,
      components: mesaFacilFields,
      title: "Nuevo rol",
      description: "Completa los campos para registrar un rol.",
    },

    editModal: {
      open: isEditOpen,
      formId: editFormId,
      fields: editFields,
      initialValues: editInitialValues,
      isFetching: isFetchingEditForm,
      isError: isEditFormError,
      isSaving: isUpdating,
      saveError: editSaveError,
      openEdit,
      closeEdit,
      handleEditSubmit,
      components: mesaFacilFields,
      title: "Editar rol",
      description: "Modifica los campos y guarda los cambios.",
    },
  };
}
