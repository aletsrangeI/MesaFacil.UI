import { useCallback, useMemo, useState } from "react";
import { useToast } from "../../../components/ui/toast/";
import {
  useFormFieldGetFormFieldByFormCatIdQuery,
  useRolUpdateMutation,
  type RolUpdateApiArg,
} from "../../../services/generated/api";
import type { ApiFormField } from "../../../forms/types";
import { mesaFacilFields } from "../../../components/ui/adapters";
import type { RolRow, RoleFormValues } from "./types";

export function useRoleEdit(onUpdated?: () => Promise<void> | void) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<RolRow | null>(null);

  const formId = "ROL";

  const toBool = (v: unknown): boolean =>
    typeof v === "boolean" ? v : String(v ?? "").toLowerCase() === "true";

  const {
    data: editFormFields,
    isFetching: isFetchingEditForm,
    isError: isEditFormError,
  } = useFormFieldGetFormFieldByFormCatIdQuery({ code: formId });

  const initialValues = useMemo<RoleFormValues>(
    () => ({
      nombre: current?.nombre ?? "",
      isAssignable: toBool(current?.isAssignable) ?? true,
      isSystem: toBool(current?.isSystem) ?? false,
    }),
    [current]
  );

  const openEdit = useCallback((row: RolRow) => {
    setCurrent(row);
    setOpen(true);
  }, []);

  const closeEdit = useCallback(() => setOpen(false), []);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [updateRol] = useRolUpdateMutation();

  const toRolUpdateArg = useCallback(
    (id: number, f: RoleFormValues): RolUpdateApiArg => ({
      id,
      rolDto: {
        nombre: f.nombre,
        isSystem: toBool(f.isSystem),
        isAssignable: toBool(f.isAssignable),
      },
    }),
    []
  );

  const handleEditSubmit = useCallback(
    async (payload: RoleFormValues) => {
      if (!current) return;
      setIsSaving(true);
      setSaveError(null);
      try {
        await updateRol(toRolUpdateArg(current.id, payload)).unwrap();
        addToast({
          message: "Rol actualizado.",
          variant: "success",
          duration: 3000,
        });
        closeEdit();
        await onUpdated?.();
      } catch (e: any) {
        const msg =
          e?.data?.message ??
          e?.error ??
          e?.message ??
          "No fue posible actualizar el rol.";
        setSaveError(msg);
        addToast({ message: msg, variant: "error", duration: 4000 });
      } finally {
        setIsSaving(false);
      }
    },
    [addToast, closeEdit, current, onUpdated, toRolUpdateArg, updateRol]
  );

  return {
    openEdit,
    closeEdit,
    isOpen: open,
    current,
    formFields: (editFormFields?.data as ApiFormField[]) ?? [],
    initialValues,
    isFetching: isFetchingEditForm,
    isError: isEditFormError,
    isSaving,
    saveError,
    handleEditSubmit,
    components: mesaFacilFields,
    title: "Editar rol",
    description: "Modifica los campos y guarda los cambios.",
    formId,
  };
}
