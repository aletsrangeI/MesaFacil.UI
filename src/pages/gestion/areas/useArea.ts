import { useMemo, useState, useRef } from "react";
import {
  useAreasGetAllQuery,
  useAreasInsertMutation,
  useAreasUpdateMutation,
  useAreasDeleteMutation,
  useSucursalesGetAllQuery
} from "../../../services/generated/api";
import { type ApiFormField } from "../../../forms/types";
import { useToast } from "../../../components/ui/toast";

export function useArea() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = useAreasGetAllQuery();
  const [insertArea, { isLoading: isInserting }] = useAreasInsertMutation();
  const [updateArea, { isLoading: isUpdating }] = useAreasUpdateMutation();
  const [deleteArea, { isLoading: isDeleting }] = useAreasDeleteMutation();
  const { data: sucursalesData } = useSucursalesGetAllQuery();
  
  const fields = useMemo<ApiFormField[]>(() => [
    { name: "idSucursal", label: "Sucursal", type: "select", dataSource: "idSucursal", options: [], validations: [{ type: "required", value: 1 }] },
    { name: "nombre", label: "Nombre", type: "text", validations: [{ type: "required", value: 1 }] },
    { name: "orden", label: "Orden", type: "text", validations: [{ type: "required", value: 1 }] }
  ], []);

  const dataSources = useMemo(() => ({
    idSucursal: Array.isArray((sucursalesData as any)?.data) ? (sucursalesData as any).data.map((s: any) => ({ id: s.id, nombre: s.nombre })) : []
  }), [sucursalesData]);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "area-form";

  const areas = useMemo(() => (responseList as any)?.data || [], [responseList]);

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
        const payload = { ...values, id: editingItem.id, idSucursal: Number(values.idSucursal), orden: Number(values.orden) };
        await updateArea({ areaDto: payload }).unwrap();
        addToast({ message: "Área actualizada", variant: "success" });
      } else {
        const payload = { ...values, idSucursal: Number(values.idSucursal), orden: Number(values.orden) };
        await insertArea({ areaDto: payload }).unwrap();
        addToast({ message: "Área creada", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar área?")) return;
    try {
      await deleteArea({ id }).unwrap();
      addToast({ message: "Área eliminada", variant: "success" });
      refetch();
    } catch (err: any) {
      addToast({ message: err.data?.message || err.message, variant: "error" });
    }
  };

  const initialValuesOverride = useMemo(() => {
    if (!editingItem) return {};
    return { ...editingItem };
  }, [editingItem]);

  return {
    areas,
    isLoadingList,
    isListError,
    isInserting,
    isUpdating,
    isDeleting,
    fields,
    isLoadingFields: false,
    isFieldsError: false,
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
