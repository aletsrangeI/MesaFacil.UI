import { useMemo, useState, useRef } from "react";
import {
  useTiposPedidoGetAllQuery,
  useTiposPedidoInsertMutation,
  useTiposPedidoUpdateMutation,
  useTiposPedidoDeleteMutation
} from "../../../services/generated/api";
import { type ApiFormField } from "../../../forms/types";
import { useToast } from "../../../components/ui/toast";

export function useTipoPedido() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = useTiposPedidoGetAllQuery();
  const [insertTipoPedido, { isLoading: isInserting }] = useTiposPedidoInsertMutation();
  const [updateTipoPedido, { isLoading: isUpdating }] = useTiposPedidoUpdateMutation();
  const [deleteTipoPedido, { isLoading: isDeleting }] = useTiposPedidoDeleteMutation();
  
  const fields = useMemo<ApiFormField[]>(() => [
    { name: "descripcion", label: "Descripción", type: "text", validations: [{ type: "required", value: 1 }] },
    { name: "isComedor", label: "Es Comedor", type: "checkbox", validations: [] },
    { name: "isActive", label: "Activo", type: "checkbox", validations: [] }
  ], []);

  const dataSources = useMemo(() => ({}), []);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "tipo-pedido-form";

  const tiposPedido = useMemo(() => (responseList as any)?.data || [], [responseList]);

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
        const payload = { ...values, id: editingItem.id, isComedor: !!values.isComedor, isActive: values.isActive === undefined ? true : !!values.isActive };
        await updateTipoPedido({ tipoPedidoDto: payload }).unwrap();
        addToast({ message: "Tipo de Pedido actualizado", variant: "success" });
      } else {
        const payload = { ...values, isComedor: !!values.isComedor, isActive: values.isActive === undefined ? true : !!values.isActive };
        await insertTipoPedido({ tipoPedidoDto: payload }).unwrap();
        addToast({ message: "Tipo de Pedido creado", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar Tipo de Pedido?")) return;
    try {
      await deleteTipoPedido({ id }).unwrap();
      addToast({ message: "Tipo de Pedido eliminado", variant: "success" });
      refetch();
    } catch (err: any) {
      addToast({ message: err.data?.message || err.message, variant: "error" });
    }
  };

  const initialValuesOverride = useMemo(() => {
    if (!editingItem) return { isActive: true, isComedor: false };
    return { ...editingItem };
  }, [editingItem]);

  return {
    tiposPedido,
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
