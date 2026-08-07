import { useMemo, useState, useRef } from "react";
import {
  usePreciosGetAllQuery,
  usePreciosInsertMutation,
  usePreciosUpdateMutation,
  usePreciosDeleteMutation,
  useFormFieldGetFormFieldByFormCatIdQuery,
  useVarianteProductosGetAllQuery,
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

export function usePrecios() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = usePreciosGetAllQuery();
  const [insertPrecio, { isLoading: isInserting }] = usePreciosInsertMutation();
  const [updatePrecio, { isLoading: isUpdating }] = usePreciosUpdateMutation();
  const [deletePrecio, { isLoading: isDeleting }] = usePreciosDeleteMutation();
  const { data: variantesData } = useVarianteProductosGetAllQuery();
  const { data: monedasData } = useCatalogosGetAllAsyncQuery({ catalog: "monedas" });
  const { data: impuestosData } = useCatalogosGetAllAsyncQuery({ catalog: "impuestos" });
  
  const { data: fieldsResp, isLoading: isLoadingFields, isError: isFieldsError } = useFormFieldGetFormFieldByFormCatIdQuery({ id: FORM_CATEGORY_IDS.PRECIO_CRUD });
  const fields = useMemo(() => normalizeFields(fieldsResp), [fieldsResp]);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "precios-form";

  const precios = useMemo(() => (responseList as any)?.data || [], [responseList]);

  // Map data sources for selects
  const dataSources = useMemo(() => ({
    variantes: Array.isArray((variantesData as any)?.data) ? (variantesData as any).data.map((v: any) => ({ id: v.id, nombre: v.nombre })) : [],
    monedas: Array.isArray((monedasData as any)?.data) ? (monedasData as any).data.map((m: any) => ({ id: m.id, nombre: m.descripcion })) : [],
    impuestos: Array.isArray((impuestosData as any)?.data) ? (impuestosData as any).data.map((i: any) => ({ id: i.id, nombre: i.descripcion })) : []
  }), [variantesData, monedasData, impuestosData]);

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
          monto: Number(values.monto)
        };
        await updatePrecio({ precioDto: payload }).unwrap();
        addToast({ message: "Precio actualizado", variant: "success" });
      } else {
        const payload = { 
          ...values, 
          activo: values.activo === "true" || values.activo === true,
          monto: Number(values.monto)
        };
        await insertPrecio({ precioDto: payload }).unwrap();
        addToast({ message: "Precio creado", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Desactivar precio?")) return;
    try {
      await deletePrecio({ id }).unwrap();
      addToast({ message: "Precio desactivado", variant: "success" });
      refetch();
    } catch (err: any) {
      addToast({ message: err.data?.message || err.message, variant: "error" });
    }
  };

  const initialValuesOverride = useMemo(() => {
    if (!editingItem) return { activo: "true" };
    
    // Convert to strings for HTML inputs, and format dates to YYYY-MM-DD
    const overrides: any = { ...editingItem };
    for (const key in overrides) {
      if (overrides[key] !== null && overrides[key] !== undefined) {
        if (typeof overrides[key] === "number") overrides[key] = String(overrides[key]);
      }
    }

    if (overrides.validoDesde && overrides.validoDesde.includes("T")) {
      overrides.validoDesde = overrides.validoDesde.split("T")[0];
    }
    if (overrides.validoHasta && overrides.validoHasta.includes("T")) {
      overrides.validoHasta = overrides.validoHasta.split("T")[0];
    }
    
    return {
      ...overrides,
      activo: editingItem.activo !== false ? "true" : "false",
    };
  }, [editingItem]);

  return {
    precios,
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
