import { useState, useMemo } from "react";
import {
  useUsuarioGetAllQuery,
  useUsuarioInsertMutation,
  useUsuarioUpdateMutation,
  useUsuarioDeleteMutation,
  useRolGetAllQuery,
  useSucursalesGetAllQuery,
} from "../../../services/generated/api";
import { useToast } from "../../../components/ui/toast/Toast";
import { useConfirm } from "../../../components/ui/confirm-dialog";
import type {
  UsuarioExtendedDto,
  UsuarioFiltersState,
  UsuarioStats,
  UsuarioFormData,
} from "./types";

export function useUsuarios() {
  const { addToast } = useToast();
  const confirm = useConfirm();

  // Queries
  const { data: usersResp, isLoading: isLoadingUsers, isError, refetch } = useUsuarioGetAllQuery();
  const { data: rolesResp, isLoading: isLoadingRoles } = useRolGetAllQuery();
  const { data: sucursalesResp, isLoading: isLoadingSucursales } = useSucursalesGetAllQuery();

  // Mutations
  const [insertUser, { isLoading: isInserting }] = useUsuarioInsertMutation();
  const [updateUser, { isLoading: isUpdating }] = useUsuarioUpdateMutation();
  const [deleteUser, { isLoading: isDeleting }] = useUsuarioDeleteMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioExtendedDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<UsuarioFiltersState>({
    search: "",
    idSucursal: "",
    idRol: "",
    estado: "ALL",
  });

  // Normalización de listas
  const users: UsuarioExtendedDto[] = useMemo(() => {
    if (Array.isArray(usersResp?.data)) {
      return usersResp.data as UsuarioExtendedDto[];
    }
    return [];
  }, [usersResp]);

  const roles = useMemo(() => {
    if (Array.isArray(rolesResp?.data)) {
      return rolesResp.data.map((r) => ({ id: r.id ?? 0, nombre: r.nombre ?? "" }));
    }
    return [];
  }, [rolesResp]);

  const sucursales = useMemo(() => {
    if (Array.isArray(sucursalesResp?.data)) {
      return sucursalesResp.data.map((s) => ({ id: s.id ?? 0, nombre: s.nombre ?? "" }));
    }
    return [];
  }, [sucursalesResp]);

  // Cálculo de estadísticas / KPIs
  const stats: UsuarioStats = useMemo(() => {
    const total = users.length;
    let activos = 0;
    let enTurno = 0;
    let conPinSupervisor = 0;
    let supervisoresBloqueados = 0;

    for (const u of users) {
      if (u.isActive !== false) activos++;
      if (u.hasOpenTurno) enTurno++;
      if (u.hasPinSupervisor) conPinSupervisor++;
      if (u.isPinSupervisorLocked) supervisoresBloqueados++;
    }

    return {
      total,
      activos,
      enTurno,
      conPinSupervisor,
      supervisoresBloqueados,
    };
  }, [users]);

  // Filtrado reactivo de usuarios
  const filteredUsers = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const branchId = filters.idSucursal ? Number(filters.idSucursal) : null;
    const roleId = filters.idRol ? Number(filters.idRol) : null;
    const estado = filters.estado;

    return users.filter((u) => {
      // Búsqueda por texto
      if (q) {
        const matchesName = u.nombreCompleto?.toLowerCase().includes(q);
        const matchesEmail = u.correo?.toLowerCase().includes(q);
        const matchesRole = u.nombreRol?.toLowerCase().includes(q);
        const matchesBranch = u.nombreSucursal?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole && !matchesBranch) {
          return false;
        }
      }

      // Filtro por Sucursal
      if (branchId !== null) {
        if (u.idSucursal !== branchId) return false;
      }

      // Filtro por Rol
      if (roleId !== null) {
        if (u.idRol !== roleId) return false;
      }

      // Filtro por Estado
      if (estado === "ACTIVE" && u.isActive === false) return false;
      if (estado === "INACTIVE" && u.isActive !== false) return false;
      if (estado === "OPEN_TURNO" && !u.hasOpenTurno) return false;
      if (estado === "SUPERVISOR_LOCKED" && !u.isPinSupervisorLocked) return false;

      return true;
    });
  }, [users, filters]);

  // Modales
  const openCreateModal = () => {
    setFormError(null);
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UsuarioExtendedDto) => {
    setFormError(null);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormError(null);
  };

  // Manejo de Filtros
  const setFilterField = <K extends keyof UsuarioFiltersState>(
    key: K,
    value: UsuarioFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      idSucursal: "",
      idRol: "",
      estado: "ALL",
    });
  };

  // Enviar formulario (Crear / Actualizar)
  const handleFormSubmit = async (formData: UsuarioFormData): Promise<boolean> => {
    setFormError(null);

    try {
      if (editingUser) {
        // Actualizar usuario
        const res = await updateUser({
          usuarioDto: {
            id: editingUser.id,
            idEmpresa: formData.idEmpresa,
            idSucursal: formData.idSucursal ?? undefined,
            nombreCompleto: formData.nombreCompleto,
            correo: formData.correo || undefined,
            isActive: formData.isActive,
            password: formData.password || undefined,
            pin: formData.pin || undefined,
            idRol: formData.idRol ?? undefined,
            ...({
              pinSupervisor: formData.pinSupervisor || undefined,
              desbloquearPinSupervisor: formData.desbloquearPinSupervisor || undefined,
            } as any),
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Usuario actualizado con éxito.", variant: "success" });
          refetch();
          return true;
        } else {
          setFormError(res.message || "Error al actualizar el usuario.");
          return false;
        }
      } else {
        // Crear nuevo usuario
        const res = await insertUser({
          usuarioDto: {
            idEmpresa: formData.idEmpresa,
            idSucursal: formData.idSucursal ?? undefined,
            nombreCompleto: formData.nombreCompleto,
            correo: formData.correo || undefined,
            isActive: formData.isActive,
            password: formData.password || undefined,
            pin: formData.pin || undefined,
            idRol: formData.idRol ?? undefined,
            ...({
              pinSupervisor: formData.pinSupervisor || undefined,
            } as any),
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Usuario creado con éxito.", variant: "success" });
          refetch();
          return true;
        } else {
          setFormError(res.message || "Error al crear el usuario.");
          return false;
        }
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      setFormError(apiError?.data?.message || "Ocurrió un error inesperado al guardar.");
      return false;
    }
  };

  // Desbloqueo rápido de supervisor (1 clic desde la fila de la tabla)
  const handleQuickUnlockSupervisor = async (user: UsuarioExtendedDto) => {
    const ok = await confirm({
      title: "¿Desbloquear Candado de Supervisor?",
      message: `El supervisor "${user.nombreCompleto}" fue bloqueado por 3 intentos fallidos. ¿Deseas restablecer su candado de seguridad inmediatamente?`,
      confirmLabel: "Sí, desbloquear",
      variant: "info",
    });
    if (!ok) return;

    try {
      const res = await updateUser({
        usuarioDto: {
          id: user.id,
          idEmpresa: user.idEmpresa,
          idSucursal: user.idSucursal ?? undefined,
          nombreCompleto: user.nombreCompleto,
          correo: user.correo || undefined,
          isActive: user.isActive ?? true,
          idRol: user.idRol ?? undefined,
          ...({
            desbloquearPinSupervisor: true,
          } as any),
        },
      }).unwrap();

      if (res.isSuccess) {
        addToast({
          message: `Candado de supervisor de "${user.nombreCompleto}" desbloqueado con éxito.`,
          variant: "success",
        });
        refetch();
      } else {
        addToast({ message: res.message || "Error al desbloquear el supervisor.", variant: "error" });
      }
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      addToast({
        message: apiError?.data?.message || "No fue posible desbloquear el supervisor.",
        variant: "error",
      });
    }
  };

  // Eliminación con validación de seguridad de turno
  const handleDelete = async (user: UsuarioExtendedDto) => {
    if (user.hasOpenTurno) {
      addToast({
        message: `No es posible eliminar al usuario "${user.nombreCompleto}" porque tiene un turno de caja abierto en el POS. Debe cerrar el turno antes de continuar.`,
        variant: "error",
      });
      return;
    }

    const ok = await confirm({
      title: "¿Eliminar usuario?",
      message: `Se eliminará la cuenta de "${user.nombreCompleto}". Esta acción revocará sus accesos y es irreversible.`,
      confirmLabel: "Sí, eliminar",
      variant: "danger",
    });
    if (!ok) return;

    try {
      const res = await deleteUser({ id: user.id ?? 0 }).unwrap();
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
    // Data
    users,
    filteredUsers,
    sucursales,
    roles,
    stats,
    isLoading: isLoadingUsers || isLoadingRoles || isLoadingSucursales,
    isError,
    refetch,
    // Mutations loading
    isSubmitting: isInserting || isUpdating,
    isDeleting,
    // Modals
    isModalOpen,
    editingUser,
    formError,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
    // Actions
    handleQuickUnlockSupervisor,
    handleDelete,
    // Filters
    filters,
    setFilterField,
    resetFilters,
  };
}
