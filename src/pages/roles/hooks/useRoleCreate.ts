import { useCallback, useMemo, useState } from "react";
import { useToast } from "../../../components/ui/toast/";
import {
  useFormFieldGetFormFieldByFormCatIdQuery,
  useRolInsertMutation,
  type RolInsertApiArg,
} from "../../../services/generated/api";
import type { ApiFormField } from "../../../forms/types";
import { mesaFacilFields } from "../../../components/ui/adapters";
import type { RoleFormValues } from "./types";

const formId = "ROL";

const toBool = (v: unknown): boolean =>
  typeof v === "boolean" ? v : String(v ?? "").toLowerCase() === "true";

const toRolInsertArg = (f: RoleFormValues): RolInsertApiArg => ({
  rolDto: {
    id: 0,
    nombre: f.nombre,
    isSystem: toBool(f.isSystem),
    isAssignable: toBool(f.isAssignable),
    concurrencyStamp: null,
  },
});

export function useRoleCreate(onCreated?: () => Promise<void> | void) {
  const [createRol] = useRolInsertMutation();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const {
    data: createFormFields,
    isFetching: isFetchingCreateForm,
    isError: isCreateFormError,
  } = useFormFieldGetFormFieldByFormCatIdQuery({ code: formId });

  const initialValues = useMemo<RoleFormValues>(
    () => ({
      nombre: "",
      isAssignable: true,
      isSystem: false,
    }),
    []
  );

  const openCreate = useCallback(() => setOpen(true), []);
  const closeCreate = useCallback(() => setOpen(false), []);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCreateSubmit = useCallback(
    async (payload: RoleFormValues) => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await createRol(toRolInsertArg(payload)).unwrap();
        addToast({
          message: "Rol creado correctamente.",
          variant: "success",
          duration: 3000,
        });
        closeCreate();
        await onCreated?.();
      } catch (e: any) {
        const msg =
          e?.data?.message ??
          e?.error ??
          e?.message ??
          "No fue posible crear el rol.";
        setSaveError(msg);
        addToast({ message: msg, variant: "error", duration: 4000 });
      } finally {
        setIsSaving(false);
      }
    },
    [addToast, closeCreate, createRol, onCreated, toRolInsertArg]
  );
  return {
    openCreate,
    closeCreate,
    formId,
    isOpen: open,
    formFields: (createFormFields?.data as ApiFormField[]) ?? [],
    initialValues,
    isFetching: isFetchingCreateForm,
    isError: isCreateFormError,
    isSaving,
    saveError,
    handleCreateSubmit,
    components: mesaFacilFields,
    title: "Nuevo rol",
    description: "Completa los campos para crear un nuevo rol.",
  };
}
