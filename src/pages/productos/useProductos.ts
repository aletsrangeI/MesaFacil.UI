import { useMemo, useState, useRef } from "react";
import {
  useProductosGetAllQuery,
  useProductosInsertMutation,
  useProductosUpdateMutation,
  useProductosDeleteMutation,
  useFormFieldGetFormFieldByFormCatIdQuery,
  useMenusGetAllQuery,
  useCategoriasGetAllQuery,
  useCatalogosGetAllAsyncQuery
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

export function useProductos() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = useProductosGetAllQuery();
  const [insertProducto, { isLoading: isInserting }] = useProductosInsertMutation();
  const [updateProducto, { isLoading: isUpdating }] = useProductosUpdateMutation();
  const [deleteProducto, { isLoading: isDeleting }] = useProductosDeleteMutation();
  const { data: menusData } = useMenusGetAllQuery();
  const { data: categoriasData } = useCategoriasGetAllQuery();
  const { data: estacionesData } = useCatalogosGetAllAsyncQuery({ catalog: "estaciones-cocina" });
  
  const { data: fieldsResp, isLoading: isLoadingFields, isError: isFieldsError } = useFormFieldGetFormFieldByFormCatIdQuery({ id: FORM_CATEGORY_IDS.PRODUCTO_CRUD });
  const fields = useMemo(() => normalizeFields(fieldsResp), [fieldsResp]);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "productos-form";

  const productos = useMemo(() => (responseList as any)?.data || [], [responseList]);

  // Map data sources for selects
  const dataSources = useMemo(() => ({
    menus: Array.isArray((menusData as any)?.data) ? (menusData as any).data.map((m: any) => ({ id: m.id, nombre: m.nombre })) : [],
    categorias: Array.isArray((categoriasData as any)?.data) ? (categoriasData as any).data.map((c: any) => ({ id: c.id, nombre: c.nombre })) : [],
    estaciones: Array.isArray((estacionesData as any)?.data) ? (estacionesData as any).data.map((e: any) => ({ id: e.id, nombre: e.descripcion })) : []
  }), [menusData, categoriasData, estacionesData]);

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
        const payload = { ...values, id: editingItem.id, activo: values.activo === "true" || values.activo === true };
        await updateProducto({ productoDto: payload }).unwrap();
        addToast({ message: "Producto actualizado", variant: "success" });
      } else {
        const payload = { ...values, activo: values.activo === "true" || values.activo === true };
        await insertProducto({ productoDto: payload }).unwrap();
        addToast({ message: "Producto creado", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Desactivar producto?")) return;
    try {
      await deleteProducto({ id }).unwrap();
      addToast({ message: "Producto desactivado", variant: "success" });
      refetch();
    } catch (err: any) {
      addToast({ message: err.data?.message || err.message, variant: "error" });
    }
  };

  const initialValuesOverride = useMemo(() => {
    if (!editingItem) return { activo: "true" };
    return {
      ...editingItem,
      activo: editingItem.activo !== false ? "true" : "false",
    };
  }, [editingItem]);

  return {
    productos,
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
