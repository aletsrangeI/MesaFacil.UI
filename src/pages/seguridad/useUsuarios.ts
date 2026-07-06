import { useState, useRef, useMemo } from "react";
import {
  useUsuarioGetAllQuery,
  useUsuarioInsertMutation,
  useUsuarioUpdateMutation,
  useUsuarioDeleteMutation,
  useRolGetAllQuery,
  useEmpresaGetAllQuery,
  type UsuarioDto,
} from "../../services/generated/api";
import { useToast } from "../../components/ui/toast/Toast";
import { useUsuariosForm } from "./useUsuariosForm";

export function useUsuarios() {
  const { addToast } = useToast();
  const { data: resp, isLoading: isLoadingUsers, isError, refetch } = useUsuarioGetAllQuery();
  
  const { data: rolesResp } = useRolGetAllQuery();
  const { data: empresasResp } = useEmpresaGetAllQuery();

  const [insertUser, { isLoading: isInserting }] = useUsuarioInsertMutation();
  const [updateUser, { isLoading: isUpdating }] = useUsuarioUpdateMutation();
  const [deleteUser, { isLoading: isDeleting }] = useUsuarioDeleteMutation();

  const [search, setSearch] = useState("");
  
  // Modal states & SDUI fields
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [editingUser, setEditingUser] = useState<UsuarioDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { formId, fields, isLoadingFields, isFieldsError } = useUsuariosForm();

  const dataSources = useMemo(() => {
    return {
      roles: Array.isArray(rolesResp?.data)
        ? rolesResp.data.map((r) => ({ id: r.id ?? 0, nombre: r.nombre ?? "" }))
        : [],
      empresas: Array.isArray(empresasResp?.data)
        ? empresasResp.data.map((e) => ({ id: e.id ?? 0, nombre: e.nombre ?? "" }))
        : [],
    };
  }, [rolesResp, empresasResp]);

  const dynamicFields = useMemo(() => {
    if (!editingUser) {
      // Crear: la contraseña es obligatoria
      return fields.map((f) => {
        if (f.name === "password") {
          return {
            ...f,
            validations: [...(f.validations ?? []), { type: "required" as const, value: 1 }],
          };
        }
        return f;
      });
    } else {
      // Editar: la contraseña es opcional, cambiamos label/placeholder para que sea amigable
      return fields.map((f) => {
        if (f.name === "password") {
          return {
            ...f,
            label: "Nueva Contraseña (opcional)",
            placeholder: "Dejar en blanco para mantener la contraseña actual",
            validations: (f.validations ?? []).filter((v) => v.type !== "required"),
          };
        }
        return f;
      });
    }
  }, [fields, editingUser]);

  // Users list
  const users: UsuarioDto[] = useMemo(() => {
    if (Array.isArray(resp?.data)) {
      return resp.data;
    }
    return [];
  }, [resp]);

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.nombreCompleto?.toLowerCase().includes(q) ||
        u.correo?.toLowerCase().includes(q) ||
        u.nombreEmpresa?.toLowerCase().includes(q) ||
        u.nombreRol?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const openModal = (user: UsuarioDto | null = null) => {
    setFormError(null);
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser(null);
    }
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const initialValuesOverride = useMemo(() => {
    if (!editingUser) return undefined;
    return {
      nombreCompleto: editingUser.nombreCompleto ?? "",
      correo: editingUser.correo ?? "",
      password: "",
      pin: editingUser.pin ?? "",
      idRol: editingUser.idRol ? String(editingUser.idRol) : "",
      idEmpresa: editingUser.idEmpresa ? String(editingUser.idEmpresa) : "1",
    };
  }, [editingUser]);

  const handleFormikSubmit = async (values: Record<string, unknown>) => {
    setFormError(null);

    const name = String(values.nombreCompleto ?? "").trim();
    const email = String(values.correo ?? "").trim();
    const password = String(values.password ?? "").trim();
    const pin = values.pin ? String(values.pin).trim() : undefined;
    const idRol = values.idRol ? Number(values.idRol) : undefined;
    const idEmpresa = values.idEmpresa ? Number(values.idEmpresa) : 1;

    if (!name || !email) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (editingUser) {
        // Update user
        const res = await updateUser({
          usuarioDto: {
            id: editingUser.id,
            idEmpresa,
            nombreCompleto: name,
            correo: email,
            password: password || undefined,
            pin: pin || undefined,
            idRol,
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Usuario actualizado con éxito.", variant: "success" });
          closeModal();
          refetch();
        } else {
          setFormError(res.message || "Error al actualizar el usuario.");
        }
      } else {
        // Create user
        const res = await insertUser({
          usuarioDto: {
            idEmpresa,
            nombreCompleto: name,
            correo: email,
            password: password || undefined,
            pin: pin || undefined,
            idRol,
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Usuario creado con éxito.", variant: "success" });
          closeModal();
          refetch();
        } else {
          setFormError(res.message || "Error al crear el usuario.");
        }
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      setFormError(apiError?.data?.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteUser({ id }).unwrap();
      if (res.isSuccess) {
        addToast({ message: "Usuario eliminado correctamente.", variant: "success" });
        refetch();
      } else {
        addToast({ message: res.message || "Error al eliminar el usuario.", variant: "error" });
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      addToast({
        message: apiError?.data?.message || "Ocurrió un error al intentar eliminar el usuario.",
        variant: "error",
      });
    }
  };

  return {
    search,
    setSearch,
    isLoadingUsers,
    isError,
    refetch,
    isDeleting,
    filteredUsers,
    dialogRef,
    editingUser,
    formError,
    formId,
    dynamicFields,
    isLoadingFields,
    isFieldsError,
    dataSources,
    initialValuesOverride,
    openModal,
    closeModal,
    handleFormikSubmit,
    handleDelete,
    isInserting,
    isUpdating,
  };
}
