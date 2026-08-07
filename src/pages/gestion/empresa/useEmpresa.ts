import { useMemo, useState, useRef } from "react";
import {
  useEmpresaGetAllQuery,
  useEmpresaInsertMutation,
  useEmpresaUpdateMutation,
  useEmpresaDeleteMutation,
} from "../../../services/generated/api";
import { type ApiFormField } from "../../../forms/types";
import { useToast } from "../../../components/ui/toast";

export function useEmpresa() {
  const { data: responseList, isLoading: isLoadingList, isError: isListError, refetch } = useEmpresaGetAllQuery();
  const [insertEmpresa, { isLoading: isInserting }] = useEmpresaInsertMutation();
  const [updateEmpresa, { isLoading: isUpdating }] = useEmpresaUpdateMutation();
  const [deleteEmpresa, { isLoading: isDeleting }] = useEmpresaDeleteMutation();
  
  const fields = useMemo<ApiFormField[]>(() => [
    { name: "nombre", label: "Nombre", type: "text", validations: [{ type: "required", value: 1 }] },
    { name: "rfc", label: "RFC", type: "text", validations: [{ type: "required", value: 1 }] }
  ], []);

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "empresa-form";

  const empresas = useMemo(() => (responseList as any)?.data || [], [responseList]);

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
        const payload = { ...values, id: editingItem.id };
        await updateEmpresa({ empresaDto: payload }).unwrap();
        addToast({ message: "Empresa actualizada", variant: "success" });
      } else {
        const payload = { ...values };
        await insertEmpresa({ empresaDto: payload }).unwrap();
        addToast({ message: "Empresa creada", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar empresa?")) return;
    try {
      await deleteEmpresa({ id }).unwrap();
      addToast({ message: "Empresa eliminada", variant: "success" });
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
    empresas,
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
    dataSources: {},
    initialValuesOverride,
    openModal,
    closeModal,
    handleFormikSubmit,
    handleDelete,
  };
}
