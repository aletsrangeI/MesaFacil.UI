import { useMemo, useState, useRef } from "react";
import {
  useMesasGetAllQuery,
  useMesasInsertMutation,
  useMesasUpdateMutation,
  useMesasDeleteMutation,
  useAreasGetAllQuery,
  useSucursalesGetAllQuery
} from "../../../services/generated/api";
import { type ApiFormField } from "../../../forms/types";
import { useToast } from "../../../components/ui/toast";

export function useMesa() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = useMesasGetAllQuery();
  const [insertMesa, { isLoading: isInserting }] = useMesasInsertMutation();
  const [updateMesa, { isLoading: isUpdating }] = useMesasUpdateMutation();
  const [deleteMesa, { isLoading: isDeleting }] = useMesasDeleteMutation();
  const { data: areasData } = useAreasGetAllQuery();
  const { data: sucursalesData } = useSucursalesGetAllQuery();
  
  const fields = useMemo<ApiFormField[]>(() => [
    { name: "idSucursal", label: "Sucursal", type: "select", dataSource: "idSucursal", options: [], validations: [{ type: "required", value: 1 }] },
    { name: "idArea", label: "Área", type: "select", dataSource: "idArea", options: [], validations: [{ type: "required", value: 1 }] },
    { name: "codigo", label: "Código / Nombre", type: "text", validations: [{ type: "required", value: 1 }] },
    { name: "asientos", label: "Asientos", type: "text", validations: [{ type: "required", value: 1 }] }
  ], []);

  const dataSources = useMemo(() => ({
    idArea: Array.isArray((areasData as any)?.data) ? (areasData as any).data.map((a: any) => ({ id: a.id, nombre: a.nombre })) : [],
    idSucursal: Array.isArray((sucursalesData as any)?.data) ? (sucursalesData as any).data.map((s: any) => ({ id: s.id, nombre: s.nombre })) : []
  }), [areasData, sucursalesData]);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "mesa-form";

  const mesas = useMemo(() => (responseList as any)?.data || [], [responseList]);

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
        const payload = { ...values, id: editingItem.id, idSucursal: Number(values.idSucursal), idArea: Number(values.idArea), asientos: Number(values.asientos) };
        await updateMesa({ mesaDto: payload }).unwrap();
        addToast({ message: "Mesa actualizada", variant: "success" });
      } else {
        const payload = { ...values, idSucursal: Number(values.idSucursal), idArea: Number(values.idArea), asientos: Number(values.asientos), idEstadoMesa: 1 };
        await insertMesa({ mesaDto: payload }).unwrap();
        addToast({ message: "Mesa creada", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar mesa?")) return;
    try {
      await deleteMesa({ id }).unwrap();
      addToast({ message: "Mesa eliminada", variant: "success" });
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
    mesas,
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
