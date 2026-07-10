import { useMemo, useState, useRef } from "react";
import {
  useGrupoModificadoresGetAllQuery,
  useGrupoModificadoresInsertMutation,
  useGrupoModificadoresUpdateMutation,
  useGrupoModificadoresDeleteMutation,
  useFormFieldGetFormFieldByFormCatIdQuery
} from "../../services/generated/api";
import { type ApiFormField, FORM_CATEGORY_IDS, type SelectOptionApi, type ValidationRule, type ValidationType } from "../../forms/types";
import { useToast } from "../../components/ui/toast";

// SDUI Normalization Helpers
const FIELD_TYPES: ReadonlyArray<ApiFormField["type"]> = ["text", "select", "password", "date", "checkbox"];
function asUiFieldType(t: unknown): ApiFormField["type"] {
  const v = String(t ?? "text").toLowerCase() as ApiFormField["type"];
  return (FIELD_TYPES.includes(v) ? v : "text") as ApiFormField["type"];
}
const VALIDATION_TYPES: ReadonlyArray<ValidationType> = ["required", "email", "confirmPassword", "phone", "date", "minLength", "maxLength"];
function asValidationType(t: unknown): ValidationType {
  const v = String(t ?? "required") as ValidationType;
  return (VALIDATION_TYPES.includes(v) ? v : "required") as ValidationType;
}
function coerceValidationValue(type: ValidationType, raw: unknown): number {
  if (type === "minLength" || type === "maxLength") return Number(raw ?? 0) || 0;
  return Number(raw ?? 1) || 1;
}
type BackendOption = { id?: string | number; nombre?: string; label?: string; value?: string | number; };
function toSelectOptions(list?: unknown): SelectOptionApi[] {
  if (!Array.isArray(list)) return [];
  return (list as BackendOption[]).map((o) => ({
    id: (o.value ?? o.id ?? "") as string | number,
    nombre: String(o.label ?? o.nombre ?? o.value ?? o.id ?? ""),
  }));
}
type BackendField = {
  id?: number | string; type?: string; name?: string; placeholder?: string;
  label?: string; value?: string; validations?: Array<{ type?: string; value?: number | string }>;
  options?: BackendOption[]; order?: number; dataSource?: string;
};
function normalizeFields(resp: unknown): ApiFormField[] {
  const list = Array.isArray((resp as any)?.data) ? ((resp as any).data as BackendField[]) : [];
  return list.map<ApiFormField>((dto) => ({
    type: asUiFieldType(dto.type),
    name: dto.name ?? "",
    placeholder: dto.placeholder ?? "",
    label: dto.label ?? dto.name ?? "",
    value: dto.value ?? "",
    validations: Array.isArray(dto.validations) ? dto.validations.map<ValidationRule>((v) => {
      const type = asValidationType(v?.type);
      return { type, value: coerceValidationValue(type, v?.value) };
    }) : [],
    options: toSelectOptions(dto.options),
    catalogoId: null,
    order: dto.order ?? 0,
    dataSource: dto.dataSource ?? null,
  })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function useGrupoModificadores() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = useGrupoModificadoresGetAllQuery();
  const [insertGrupo, { isLoading: isInserting }] = useGrupoModificadoresInsertMutation();
  const [updateGrupo, { isLoading: isUpdating }] = useGrupoModificadoresUpdateMutation();
  const [deleteGrupo, { isLoading: isDeleting }] = useGrupoModificadoresDeleteMutation();
  
  const { data: fieldsResp, isLoading: isLoadingFields, isError: isFieldsError } = useFormFieldGetFormFieldByFormCatIdQuery({ id: FORM_CATEGORY_IDS.GRUPO_MODIFICADOR_CRUD });
  const fields = useMemo(() => normalizeFields(fieldsResp), [fieldsResp]);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "grupo-modificadores-form";

  const grupos = useMemo(() => (responseList as any)?.data || [], [responseList]);

  // Mock data sources for selects until their APIs are implemented
  const dataSources = useMemo(() => ({
    productos: [{ id: 1, nombre: "Hamburguesa Clásica" }]
  }), []);

  const openModal = (item?: any) => {
    setFormError(null);
    setEditingItem(item || null);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleFormikSubmit = async (values: any) => {
    setFormError(null);
    try {
      if (editingItem) {
        const payload = { 
          ...values, 
          id: editingItem.id, 
          activo: values.activo === "true" || values.activo === true,
          obligatorio: values.obligatorio === "true" || values.obligatorio === true,
          minSeleccion: Number(values.minSeleccion),
          maxSeleccion: Number(values.maxSeleccion)
        };
        await updateGrupo({ grupoModificadorDto: payload }).unwrap();
        addToast({ message: "Grupo actualizado", variant: "success" });
      } else {
        const payload = { 
          ...values, 
          activo: values.activo === "true" || values.activo === true,
          obligatorio: values.obligatorio === "true" || values.obligatorio === true,
          minSeleccion: Number(values.minSeleccion),
          maxSeleccion: Number(values.maxSeleccion)
        };
        await insertGrupo({ grupoModificadorDto: payload }).unwrap();
        addToast({ message: "Grupo creado", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Desactivar grupo?")) return;
    try {
      await deleteGrupo({ id }).unwrap();
      addToast({ message: "Grupo desactivado", variant: "success" });
      refetch();
    } catch (err: any) {
      addToast({ message: err.data?.message || err.message, variant: "error" });
    }
  };

  const initialValuesOverride = useMemo(() => {
    if (!editingItem) return { activo: "true", obligatorio: "false", minSeleccion: "0", maxSeleccion: "1" };
    return {
      ...editingItem,
      activo: editingItem.activo !== false ? "true" : "false",
      obligatorio: editingItem.obligatorio === true ? "true" : "false",
    };
  }, [editingItem]);

  return {
    grupos,
    isLoadingList,
    isListError,
    isInserting,
    isUpdating,
    isDeleting,
    fields,
    isLoadingFields,
    isFieldsError,
    formId,
    dialogRef,
    editingItem,
    formError,
    dataSources,
    initialValuesOverride,
    openModal,
    closeModal,
    handleFormikSubmit,
    handleDelete,
  };
}
