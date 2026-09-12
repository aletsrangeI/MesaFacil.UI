// src/pages/catalogos/useCatalogoGenerico.ts
import { useState, useRef, useMemo } from "react";
import {
  useCatalogosGetAllQuery,
  useCatalogosInsertMutation,
  useCatalogosUpdateMutation,
  useCatalogosDeleteMutation,
  useFormFieldGetFormFieldByFormCatIdQuery,
  type GenericCatalogDto,
} from "../../services/generated/api";
import { useToast } from "../../components/ui/toast/Toast";
import { useConfirm } from "../../components/ui/confirm-dialog";
import { FORM_CATEGORY_IDS } from "../../forms/types";
import type { ApiFormField, ValidationRule, ValidationType, SelectOptionApi } from "../../forms/types";

/* ───── Helpers de normalización (igual que useUsuariosForm) ───── */
const FIELD_TYPES: ReadonlyArray<ApiFormField["type"]> = ["text", "select", "password", "date", "checkbox"];

function asUiFieldType(t: unknown): ApiFormField["type"] {
  const v = String(t ?? "text").toLowerCase() as ApiFormField["type"];
  return (FIELD_TYPES.includes(v) ? v : "text") as ApiFormField["type"];
}

const VALIDATION_TYPES: ReadonlyArray<ValidationType> = [
  "required", "email", "confirmPassword", "phone", "date", "minLength", "maxLength",
];

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
  id?: number | string;
  type?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  validations?: Array<{ type?: string; value?: number | string }>;
  options?: BackendOption[];
  order?: number;
  dataSource?: string;
};

function normalizeFields(resp: unknown): ApiFormField[] {
  const list = Array.isArray((resp as any)?.data) ? ((resp as any).data as BackendField[]) : [];
  const uniq = new Map<string, BackendField>();
  for (const f of list) {
    const key = `${f.id ?? ""}|${f.name ?? ""}`;
    if (!uniq.has(key)) uniq.set(key, f);
  }
  return Array.from(uniq.values())
    .map<ApiFormField>((dto) => ({
      type: asUiFieldType(dto.type),
      name: dto.name ?? "",
      placeholder: dto.placeholder ?? "",
      label: dto.label ?? dto.name ?? "",
      value: dto.value ?? "",
      validations: Array.isArray(dto.validations)
        ? dto.validations.map<ValidationRule>((v) => {
            const type = asValidationType(v?.type);
            return { type, value: coerceValidationValue(type, v?.value) };
          })
        : [],
      options: toSelectOptions(dto.options),
      catalogoId: null,
      order: dto.order ?? 0,
      dataSource: dto.dataSource ?? null,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/* ───── Hook principal ───── */
export function useCatalogoGenerico(catalog: string) {
  const { addToast } = useToast();
  const confirm = useConfirm();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<GenericCatalogDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* SDUI: estructura del formulario (form cat id = 8) */
  const {
    data: fieldsResp,
    isFetching: isLoadingFields,
    isError: isFieldsError,
  } = useFormFieldGetFormFieldByFormCatIdQuery({ id: FORM_CATEGORY_IDS.CATALOGO_GENERICO });

  const fields = useMemo(() => normalizeFields(fieldsResp), [fieldsResp]);

  /* CRUD */
  const {
    data: listResp,
    isLoading: isLoadingList,
    isError: isListError,
    refetch,
  } = useCatalogosGetAllQuery({ catalog });

  const [insertItem, { isLoading: isInserting }] = useCatalogosInsertMutation();
  const [updateItem, { isLoading: isUpdating }] = useCatalogosUpdateMutation();
  const [deleteItem, { isLoading: isDeleting }] = useCatalogosDeleteMutation();

  /* Lista filtrada */
  const allItems: GenericCatalogDto[] = useMemo(() => {
    const raw = (listResp as any)?.data;
    return Array.isArray(raw) ? raw : [];
  }, [listResp]);

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allItems;
    return allItems.filter((i) =>
      i.descripcion?.toLowerCase().includes(q)
    );
  }, [allItems, search]);

  /* Valores iniciales para el FormGenerator al editar */
  const initialValuesOverride = useMemo(() => {
    if (!editingItem) return undefined;
    return {
      descripcion: editingItem.descripcion ?? "",
      isActive: editingItem.isActive !== false ? "true" : "false",
    };
  }, [editingItem]);

  /* Modal */
  const openModal = (item: GenericCatalogDto | null = null) => {
    setFormError(null);
    setEditingItem(item);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  /* Submit del FormGenerator */
  const handleFormikSubmit = async (values: Record<string, unknown>) => {
    setFormError(null);

    const descripcion = String(values.descripcion ?? "").trim();
    const isActive = String(values.isActive ?? "true").toLowerCase() === "true";

    if (!descripcion) {
      setFormError("La descripción es obligatoria.");
      return;
    }

    try {
      if (editingItem) {
        const res = await updateItem({
          catalog,
          genericCatalogDto: { id: editingItem.id, descripcion, isActive },
        }).unwrap();

        if ((res as any)?.isSuccess) {
          addToast({ message: "Registro actualizado con éxito.", variant: "success" });
          closeModal();
          refetch();
        } else {
          setFormError((res as any)?.message || "Error al actualizar el registro.");
        }
      } else {
        const res = await insertItem({
          catalog,
          genericCatalogDto: { descripcion, isActive },
        }).unwrap();

        if ((res as any)?.isSuccess) {
          addToast({ message: "Registro creado con éxito.", variant: "success" });
          closeModal();
          refetch();
        } else {
          setFormError((res as any)?.message || "Error al crear el registro.");
        }
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      setFormError(apiError?.data?.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number, descripcion: string) => {
    const ok = await confirm({
      title: "¿Eliminar registro?",
      message: `Se eliminará "${descripcion}" de forma permanente.`,
      confirmLabel: "Sí, eliminar",
      variant: "danger",
    });
    if (!ok) return;

    try {
      const res = await deleteItem({ catalog, id }).unwrap();
      if ((res as any)?.isSuccess) {
        addToast({ message: "Registro eliminado correctamente.", variant: "success" });
        refetch();
      } else {
        addToast({ message: (res as any)?.message || "Error al eliminar el registro.", variant: "error" });
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      addToast({ message: apiError?.data?.message || "Error al eliminar el registro.", variant: "error" });
    }
  };

  return {
    /* estado tabla */
    search, setSearch,
    filteredItems, allItems,
    isLoadingList, isListError,
    isDeleting,
    /* formulario SDUI */
    fields, isLoadingFields, isFieldsError,
    /* modal */
    dialogRef, editingItem, formError,
    initialValuesOverride,
    openModal, closeModal,
    handleFormikSubmit, handleDelete,
    isInserting, isUpdating,
    formId: `catalogo-${catalog}-form`,
  };
}
