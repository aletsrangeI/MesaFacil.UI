import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button/Button";
import Icon from "../../../components/ui/icons/Icon";
import Container from "../../../components/ui/layout/Container";
import { DataTable } from "../../../components/data-table/DataTable";
import { useUsuarios } from "./useUsuarios";
import { UsuarioStatsCards } from "./components/UsuarioStatsCards";
import { UsuarioFilters } from "./components/UsuarioFilters";
import { UsuarioFormModal } from "./components/UsuarioFormModal";
import type { UsuarioExtendedDto } from "./types";

import "./usuarios.css";

export default function UsuariosPage() {
  const {
    users,
    filteredUsers,
    sucursales,
    roles,
    stats,
    isLoading,
    isError,
    refetch,
    isSubmitting,
    isDeleting,
    isModalOpen,
    editingUser,
    formError,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
    handleQuickUnlockSupervisor,
    handleDelete,
    filters,
    setFilterField,
    resetFilters,
  } = useUsuarios();

  // Helper para asignar color semántico al rol
  const getRoleBadgeClass = (roleName?: string | null) => {
    const r = (roleName ?? "").toLowerCase();
    if (r.includes("admin")) return "users-badge--admin";
    if (r.includes("manager") || r.includes("gerente")) return "users-badge--manager";
    if (r.includes("cajero")) return "users-badge--cashier";
    if (r.includes("mesero")) return "users-badge--waiter";
    if (r.includes("cocin") || r.includes("kds")) return "users-badge--kitchen";
    return "users-badge--neutral";
  };

  const getRoleIcon = (roleName?: string | null) => {
    const r = (roleName ?? "").toLowerCase();
    if (r.includes("admin")) return "Shield";
    if (r.includes("manager") || r.includes("gerente")) return "ShieldCheck";
    if (r.includes("cajero")) return "Wallet";
    if (r.includes("mesero")) return "UtensilsCrossed";
    if (r.includes("cocin") || r.includes("kds")) return "ChefHat";
    return "User";
  };

  const columns = useMemo<ColumnDef<UsuarioExtendedDto>[]>(
    () => [
      {
        accessorKey: "nombreCompleto",
        header: "Usuario",
        cell: (info) => {
          const user = info.row.original;
          const name = user.nombreCompleto || "Sin nombre";
          const initial = name.charAt(0).toUpperCase() || "U";
          const isActive = user.isActive !== false;

          return (
            <div className="users-table__user-cell">
              <div className={`users-table__avatar ${isActive ? "is-active" : "is-inactive"}`}>
                <span>{initial}</span>
                <span
                  className={`users-table__status-dot ${isActive ? "is-active" : "is-inactive"}`}
                  title={isActive ? "Usuario activo" : "Usuario inactivo"}
                />
              </div>
              <div className="users-table__user-info">
                <span className="users-table__user-name">{name}</span>
                <span className="users-table__user-email">{user.correo || "Sin correo web"}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "nombreRol",
        header: "Rol Operativo",
        cell: (info) => {
          const role = info.getValue() as string | undefined;
          const badgeClass = getRoleBadgeClass(role);
          const iconName = getRoleIcon(role);

          return (
            <div className="users-table__cell">
              <span className={`users-badge ${badgeClass}`}>
                <Icon name={iconName as any} size={13} />
                <span>{role || "Sin rol"}</span>
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "nombreSucursal",
        header: "Sucursal Asignada",
        cell: (info) => {
          const sucursal = info.getValue() as string | undefined;
          return (
            <div className="users-table__cell">
              {sucursal ? (
                <span className="users-badge users-badge--branch">
                  <Icon name="Building2" size={13} />
                  <span>{sucursal}</span>
                </span>
              ) : (
                <span className="users-badge users-badge--all-branches">
                  <Icon name="Globe" size={13} />
                  <span>Todas (Corporativo)</span>
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "credenciales",
        header: "Credenciales",
        cell: (info) => {
          const user = info.row.original;
          const hasWeb = user.hasPassword;
          const hasPin = user.hasPin;
          const hasSup = user.hasPinSupervisor;
          const isSupLocked = user.isPinSupervisorLocked;

          return (
            <div className="users-table__credentials-group">
              {hasWeb && (
                <span className="users-cred-chip is-web" title="Contraseña de acceso web activa">
                  <Icon name="Globe" size={11} />
                  <span>Web</span>
                </span>
              )}
              {hasPin && (
                <span className="users-cred-chip is-pos" title="PIN de login rápido en POS/Comandero">
                  <Icon name="Tablet" size={11} />
                  <span>PIN POS</span>
                </span>
              )}
              {hasSup && (
                <span
                  className={`users-cred-chip is-supervisor ${isSupLocked ? "is-locked" : ""}`}
                  title={
                    isSupLocked
                      ? "¡Candado de supervisor BLOQUEADO por intentos fallidos!"
                      : "Candado de supervisor activo (Spec 024)"
                  }
                >
                  <Icon name={isSupLocked ? "Lock" : "ShieldCheck"} size={11} />
                  <span>{isSupLocked ? "Sup. Bloqueado" : "Candado Sup."}</span>
                </span>
              )}
              {!hasWeb && !hasPin && !hasSup && (
                <span className="users-cred-chip is-none">Sin credenciales</span>
              )}
            </div>
          );
        },
      },
      {
        id: "estado",
        header: "Estado Operativo",
        cell: (info) => {
          const user = info.row.original;
          const isActive = user.isActive !== false;
          const hasOpenTurno = user.hasOpenTurno;

          return (
            <div className="users-table__cell-stack">
              <span className={`users-badge ${isActive ? "users-badge--active" : "users-badge--inactive"}`}>
                <Icon name={isActive ? "CheckCircle2" : "XCircle"} size={12} />
                <span>{isActive ? "Activo" : "Inactivo"}</span>
              </span>

              {hasOpenTurno && (
                <span
                  className="users-badge users-badge--open-turno"
                  title="Este usuario tiene actualmente un turno de caja abierto en el POS"
                >
                  <span className="users-badge__pulse" />
                  <Icon name="Clock" size={12} />
                  <span>En Turno de Caja</span>
                </span>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <Container as="div" maxWidth="xl" className="users-page">
      {/* Header Principal */}
      <header className="users-page__header">
        <div className="users-page__title-area">
          <div className="users-page__title-row">
            <h1 className="users-page__title">Administración de Usuarios</h1>
            <span className="users-page__count-badge">{stats.total} usuarios</span>
          </div>
          <p className="users-page__subtitle">
            Administra personal, roles, sucursales asignadas y credenciales de seguridad (Web, POS y Candado de Supervisor).
          </p>
        </div>

        <div className="users-page__header-actions">
          <Button
            variant="ghost"
            leftIcon={<Icon name="RefreshCw" size={16} />}
            onClick={() => refetch()}
            disabled={isLoading}
            title="Recargar usuarios"
          >
            Actualizar
          </Button>
          <Button
            variant="primary"
            leftIcon={<Icon name="UserPlus" size={16} />}
            onClick={openCreateModal}
          >
            Crear Usuario
          </Button>
        </div>
      </header>

      {/* Tarjetas de Métricas / KPIs Operativos */}
      <UsuarioStatsCards
        stats={stats}
        currentFilter={filters.estado}
        onSelectFilter={(newFilter) => setFilterField("estado", newFilter)}
      />

      {/* Barra de Filtros y Búsqueda */}
      <UsuarioFilters
        filters={filters}
        onChangeFilter={setFilterField}
        onResetFilters={resetFilters}
        sucursales={sucursales}
        roles={roles}
        totalFiltered={filteredUsers.length}
        totalUsers={users.length}
      />

      {/* Tabla de Usuarios */}
      <div className="users-page__content">
        <DataTable
          columns={columns}
          data={filteredUsers}
          rowId={(u) => u.id ?? 0}
          page={1}
          pageSize={Math.max(10, filteredUsers.length)}
          totalCount={filteredUsers.length}
          isLoading={isLoading}
          error={isError ? "No fue posible cargar la lista de usuarios del sistema." : null}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          revealActionsOnHover={false}
          actionsHeader="Acciones"
          rowActions={(user) => (
            <div className="users-page__actions">
              {/* Desbloqueo rápido de PIN si está bloqueado */}
              {user.isPinSupervisorLocked && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Icon name="Unlock" size={14} />}
                  onClick={() => handleQuickUnlockSupervisor(user)}
                  title="Desbloquear PIN de supervisor"
                >
                  Desbloquear PIN
                </Button>
              )}

              {/* Editar */}
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Edit2" size={16} />}
                onClick={() => openEditModal(user)}
                aria-label={`Editar usuario ${user.nombreCompleto}`}
                title="Editar usuario"
              />

              {/* Eliminar */}
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Trash2" size={16} />}
                onClick={() => handleDelete(user)}
                aria-label={`Eliminar usuario ${user.nombreCompleto}`}
                title={
                  user.hasOpenTurno
                    ? "No se puede eliminar: tiene un turno de caja abierto"
                    : "Eliminar usuario"
                }
                disabled={isDeleting || Boolean(user.hasOpenTurno)}
              />
            </div>
          )}
        />
      </div>

      {/* Modal Moderno para Crear / Editar */}
      <UsuarioFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingUser={editingUser}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        formError={formError}
        sucursales={sucursales}
        roles={roles}
      />
    </Container>
  );
}
