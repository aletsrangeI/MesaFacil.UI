import { useMemo, useState, useRef } from "react";
import {
  useSucursalesGetAllQuery,
  useSucursalesInsertMutation,
  useSucursalesUpdateMutation,
  useSucursalesDeleteMutation,
  useEmpresaGetAllQuery
} from "../../../services/generated/api";
import { type ApiFormField } from "../../../forms/types";
import { useToast } from "../../../components/ui/toast";

export function useSucursal() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = useSucursalesGetAllQuery();
  const [insertSucursal, { isLoading: isInserting }] = useSucursalesInsertMutation();
  const [updateSucursal, { isLoading: isUpdating }] = useSucursalesUpdateMutation();
  const [deleteSucursal, { isLoading: isDeleting }] = useSucursalesDeleteMutation();
  const { data: empresasData } = useEmpresaGetAllQuery();
  
  const fields = useMemo<ApiFormField[]>(() => [
    { name: "idEmpresa", label: "Empresa", type: "select", dataSource: "idEmpresa", options: [], validations: [{ type: "required", value: 1 }] },
    { name: "nombre", label: "Nombre", type: "text", validations: [{ type: "required", value: 1 }] },
    { name: "direccion", label: "Dirección", type: "text", validations: [{ type: "required", value: 1 }] },
    { name: "zonaHoraria", label: "Zona Horaria", type: "text", validations: [{ type: "required", value: 1 }] }
  ], []);

  const dataSources = useMemo(() => ({
    idEmpresa: Array.isArray((empresasData as any)?.data) ? (empresasData as any).data.map((e: any) => ({ id: e.id, nombre: e.nombre })) : []
  }), [empresasData]);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "sucursal-form";

  const sucursales = useMemo(() => (responseList as any)?.data || [], [responseList]);

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
        const payload = { ...values, id: editingItem.id, idEmpresa: Number(values.idEmpresa) };
        await updateSucursal({ sucursalDto: payload }).unwrap();
        addToast({ message: "Sucursal actualizada", variant: "success" });
      } else {
        const payload = { ...values, idEmpresa: Number(values.idEmpresa) };
        await insertSucursal({ sucursalDto: payload }).unwrap();
        addToast({ message: "Sucursal creada", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar sucursal?")) return;
    try {
      await deleteSucursal({ id }).unwrap();
      addToast({ message: "Sucursal eliminada", variant: "success" });
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
    sucursales,
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
