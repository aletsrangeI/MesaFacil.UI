import { useMemo, useRef, useState } from "react";
import {
  useGetImpresorasAllQuery,
  useInsertImpresoraMutation,
  useUpdateImpresoraMutation,
  useDeleteImpresoraMutation,
} from "../../../services/impresorasApi";
import { useSucursalesGetAllQuery } from "../../../services/generated/api";
import { type ApiFormField } from "../../../forms/types";
import { useToast } from "../../../components/ui/toast";

export function useImpresoras() {
  const {
    data: responseList,
    isLoading: isLoadingList,
    isError: isListError,
    refetch,
  } = useGetImpresorasAllQuery();
  const [insertImpresora, { isLoading: isInserting }] = useInsertImpresoraMutation();
  const [updateImpresora, { isLoading: isUpdating }] = useUpdateImpresoraMutation();
  const [deleteImpresora, { isLoading: isDeleting }] = useDeleteImpresoraMutation();
  const { data: sucursalesData } = useSucursalesGetAllQuery();

  const fields = useMemo<ApiFormField[]>(
    () => [
      {
        name: "idSucursal",
        label: "Sucursal",
        type: "select",
        dataSource: "idSucursal",
        options: [],
        validations: [{ type: "required", value: 1 }],
      },
      { name: "nombre", label: "Nombre", type: "text", validations: [{ type: "required", value: 1 }] },
      {
        name: "tipoConexion",
        label: "Tipo de Conexión",
        type: "select",
        options: [
          { id: "RedLAN", nombre: "Red LAN (Ethernet/IP + Puerto 9100)" },
          { id: "USBLocal", nombre: "USB Local (Driver Windows/SPOOL)" },
          { id: "NavegadorDialogo", nombre: "Diálogo del Navegador (window.print)" },
        ],
        validations: [{ type: "required", value: 1 }],
      },
      {
        name: "anchoPapel",
        label: "Ancho de Papel",
        type: "select",
        options: [
          { id: "58", nombre: "58 mm" },
          { id: "80", nombre: "80 mm" },
        ],
        validations: [{ type: "required", value: 1 }],
      },
      { name: "direccionIp", label: "Dirección IP", type: "text" },
      { name: "puerto", label: "Puerto", type: "text" },
      { name: "estacionAsociada", label: "Estación Asociada", type: "text" },
      { name: "aperturaCajon", label: "Apertura de Cajón al cobrar en efectivo", type: "checkbox" },
      { name: "autocorte", label: "Autocorte", type: "checkbox" },
    ],
    []
  );

  const dataSources = useMemo(
    () => ({
      idSucursal: Array.isArray((sucursalesData as any)?.data)
        ? (sucursalesData as any).data.map((s: any) => ({ id: s.id, nombre: s.nombre }))
        : [],
    }),
    [sucursalesData]
  );

  const { addToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formId = "impresora-form";

  const impresoras = useMemo(() => (responseList as any)?.data || [], [responseList]);

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
      const base = {
        ...values,
        idSucursal: Number(values.idSucursal),
        puerto: values.puerto ? Number(values.puerto) : 0,
        anchoPapel: Number(values.anchoPapel),
        aperturaCajon: String(values.aperturaCajon).toLowerCase() === "true",
        autocorte: String(values.autocorte).toLowerCase() === "true",
      };
      if (editingItem) {
        const payload = { ...base, id: editingItem.id };
        await updateImpresora(payload).unwrap();
        addToast({ message: "Impresora actualizada", variant: "success" });
      } else {
        await insertImpresora(base).unwrap();
        addToast({ message: "Impresora creada", variant: "success" });
      }
      closeModal();
      refetch();
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar impresora?")) return;
    try {
      await deleteImpresora(id).unwrap();
      addToast({ message: "Impresora eliminada", variant: "success" });
      refetch();
    } catch (err: any) {
      addToast({ message: err.data?.message || err.message, variant: "error" });
    }
  };

  const initialValuesOverride = useMemo(() => {
    if (!editingItem) return {};
    return { ...editingItem, anchoPapel: String(editingItem.anchoPapel) };
  }, [editingItem]);

  return {
    impresoras,
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
