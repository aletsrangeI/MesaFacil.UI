import { useState, useRef, useMemo } from "react";
import {
  useFormularioGetAllQuery,
  useFormularioInsertMutation,
  useFormularioUpdateMutation,
  useFormularioDeleteMutation,
  useFormFieldInsertMutation,
  useFormFieldUpdateMutation,
  useFormFieldDeleteMutation,
  type FormularioDto,
  type FormFieldDto,
  type FormValidation,
  type SelectFormOption,
} from "../../services/generated/api";
import { useToast } from "../../components/ui/toast/Toast";
import { useConfirm } from "../../components/ui/confirm-dialog";

export function useFormularios() {
  const { addToast } = useToast();
  const confirm = useConfirm();
  
  // Queries y mutaciones de Cabecera (Formulario)
  const { data: resp, isLoading: isLoadingForms, isError, refetch } = useFormularioGetAllQuery();
  const [insertForm, { isLoading: isInsertingForm }] = useFormularioInsertMutation();
  const [updateForm, { isLoading: isUpdatingForm }] = useFormularioUpdateMutation();
  const [deleteForm, { isLoading: isDeletingForm }] = useFormularioDeleteMutation();

  // Mutaciones de Detalle (FormField)
  const [insertField, { isLoading: isInsertingField }] = useFormFieldInsertMutation();
  const [updateField, { isLoading: isUpdatingField }] = useFormFieldUpdateMutation();
  const [deleteField, { isLoading: isDeletingField }] = useFormFieldDeleteMutation();

  const formularios = useMemo(() => {
    return Array.isArray(resp?.data) ? resp.data : [];
  }, [resp]);

  // Estados de navegación interna / selección
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  
  const selectedForm = useMemo(() => {
    return formularios.find((f) => f.id === selectedFormId) || null;
  }, [formularios, selectedFormId]);

  // Refs de Diálogos Modales
  const formDialogRef = useRef<HTMLDialogElement>(null);
  const fieldDialogRef = useRef<HTMLDialogElement>(null);

  // Estado para Crear/Editar Cabecera (Formulario)
  const [editingForm, setEditingForm] = useState<FormularioDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Estado para Crear/Editar Detalle (FormField)
  const [editingField, setEditingField] = useState<FormFieldDto | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  // ------------------------------------
  // Acciones de Formulario (Cabecera)
  // ------------------------------------
  const openFormModal = (form: FormularioDto | null = null) => {
    setFormError(null);
    setEditingForm(form);
    formDialogRef.current?.showModal();
  };

  const closeFormModal = () => {
    formDialogRef.current?.close();
    setEditingForm(null);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const data = new FormData(e.currentTarget);
    const codigo = String(data.get("codigo") ?? "").trim();
    const nombre = String(data.get("nombre") ?? "").trim();
    const descripcion = String(data.get("descripcion") ?? "").trim();

    if (!codigo || !nombre) {
      setFormError("El código y el nombre son campos obligatorios.");
      return;
    }

    try {
      if (editingForm?.id) {
        const res = await updateForm({
          id: editingForm.id,
          formularioDto: {
            id: editingForm.id,
            codigo,
            nombre,
            descripcion,
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Formulario actualizado con éxito.", variant: "success" });
          closeFormModal();
          refetch();
        } else {
          setFormError(res.message || "Error al actualizar el formulario.");
        }
      } else {
        const res = await insertForm({
          formularioDto: {
            codigo,
            nombre,
            descripcion,
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Formulario creado con éxito.", variant: "success" });
          closeFormModal();
          refetch();
        } else {
          setFormError(res.message || "Error al crear el formulario.");
        }
      }
    } catch (err: any) {
      setFormError(err?.data?.message ?? "Ocurrió un error en el servidor.");
    }
  };

  const handleFormDelete = async (id: number, name: string) => {
    const ok = await confirm({
      title: "¿Eliminar formulario?",
      message: `Se eliminará "${name}" y todos sus campos asociados. Esta acción no se puede deshacer.`,
      confirmLabel: "Sí, eliminar",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await deleteForm({ id }).unwrap();
      if (res.isSuccess) {
        addToast({ message: "Formulario eliminado con éxito.", variant: "success" });
        if (selectedFormId === id) {
          setSelectedFormId(null);
        }
        refetch();
      } else {
        addToast({ message: res.message || "Error al eliminar el formulario.", variant: "error" });
      }
    } catch (err: any) {
      addToast({ message: err?.data?.message ?? "Error en el servidor al eliminar.", variant: "error" });
    }
  };

  // ------------------------------------
  // Acciones de FormField (Detalle)
  // ------------------------------------
  const openFieldModal = (field: FormFieldDto | null = null) => {
    setFieldError(null);
    setEditingField(field);
    fieldDialogRef.current?.showModal();
  };

  const closeFieldModal = () => {
    fieldDialogRef.current?.close();
    setEditingField(null);
    setFieldError(null);
  };

  const handleFieldSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFormId) return;
    setFieldError(null);

    const data = new FormData(e.currentTarget);
    const type = String(data.get("type") ?? "text").trim();
    const name = String(data.get("name") ?? "").trim();
    const label = String(data.get("label") ?? "").trim();
    const placeholder = String(data.get("placeholder") ?? "").trim();
    const dataSource = String(data.get("dataSource") ?? "").trim() || null;
    const orden = Number(data.get("orden") ?? 0);
    const isActive = data.get("isActive") === "true";
    
    const rawOptions = String(data.get("options") ?? "").trim();

    if (!type || !name || !label) {
      setFieldError("El tipo, nombre clave y etiqueta son campos obligatorios.");
      return;
    }

    // Construir validaciones basadas en controles interactivos
    const validations: FormValidation[] = [];
    if (data.get("validation_required") === "true") {
      validations.push({ type: "required", value: 1 });
    }
    if (data.get("validation_email") === "true") {
      validations.push({ type: "email", value: 1 });
    }
    const minLengthVal = data.get("validation_minLength");
    if (minLengthVal && String(minLengthVal).trim() !== "") {
      const minLength = Number(minLengthVal);
      if (!isNaN(minLength) && minLength > 0) {
        validations.push({ type: "minLength", value: minLength });
      }
    }
    const maxLengthVal = data.get("validation_maxLength");
    if (maxLengthVal && String(maxLengthVal).trim() !== "") {
      const maxLength = Number(maxLengthVal);
      if (!isNaN(maxLength) && maxLength > 0) {
        validations.push({ type: "maxLength", value: maxLength });
      }
    }

    // Construir opciones (acepta JSON o texto plano separado por comas)
    let options: SelectFormOption[] = [];
    if (rawOptions) {
      if (rawOptions.startsWith("[")) {
        try {
          options = JSON.parse(rawOptions);
          if (!Array.isArray(options)) throw new Error();
        } catch {
          setFieldError("El campo de opciones JSON no es válido.");
          return;
        }
      } else {
        options = rawOptions
          .split(",")
          .map((opt, index) => ({
            id: index + 1,
            nombre: opt.trim(),
          }))
          .filter((opt) => opt.nombre !== "");
      }
    }

    // Validaciones de frontend específicas para cumplir con el contrato del backend
    if (type === "select" && !dataSource && options.length === 0) {
      setFieldError("Para campos de tipo 'select' debes definir un Origen de Datos (DataSource) o proporcionar Opciones Estáticas.");
      return;
    }

    if (type === "checkbox" && !dataSource && options.length === 0) {
      // Un checkbox simple necesita opciones en el backend, inyectamos Sí/No por defecto
      options = [
        { id: 1, nombre: "Sí" },
        { id: 2, nombre: "No" }
      ];
    }

    const fieldPayload: FormFieldDto = {
      type,
      name,
      label,
      placeholder: placeholder || null,
      idFormulario: selectedFormId,
      dataSource,
      orden,
      isActive,
      validations,
      options,
    };

    try {
      if (editingField?.id) {
        const res = await updateField({
          id: editingField.id,
          formFieldDto: {
            ...fieldPayload,
            id: editingField.id,
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Campo actualizado con éxito.", variant: "success" });
          closeFieldModal();
          refetch();
        } else {
          setFieldError(res.message || "Error al actualizar el campo.");
        }
      } else {
        const res = await insertField({
          formFieldDto: fieldPayload,
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Campo creado con éxito.", variant: "success" });
          closeFieldModal();
          refetch();
        } else {
          setFieldError(res.message || "Error al crear el campo.");
        }
      }
    } catch (err: any) {
      setFieldError(err?.data?.message ?? "Ocurrió un error en el servidor.");
    }
  };

  const handleFieldDelete = async (id: number, labelName: string) => {
    const ok = await confirm({
      title: "¿Eliminar campo?",
      message: `Se eliminará el campo "${labelName}" de forma permanente.`,
      confirmLabel: "Sí, eliminar",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await deleteField({ id }).unwrap();
      if (res.isSuccess) {
        addToast({ message: "Campo eliminado con éxito.", variant: "success" });
        refetch();
      } else {
        addToast({ message: res.message || "Error al eliminar el campo.", variant: "error" });
      }
    } catch (err: any) {
      addToast({ message: err?.data?.message ?? "Error en el servidor al eliminar.", variant: "error" });
    }
  };

  return {
    formularios,
    isLoadingForms,
    isError,
    refetch,
    selectedFormId,
    setSelectedFormId,
    selectedForm,

    // Modal Formulario (Cabecera)
    formDialogRef,
    editingForm,
    formError,
    openFormModal,
    closeFormModal,
    handleFormSubmit,
    handleFormDelete,
    isInsertingForm,
    isUpdatingForm,
    isDeletingForm,

    // Modal FormField (Detalle)
    fieldDialogRef,
    editingField,
    fieldError,
    openFieldModal,
    closeFieldModal,
    handleFieldSubmit,
    handleFieldDelete,
    isInsertingField,
    isUpdatingField,
    isDeletingField,
  };
}
