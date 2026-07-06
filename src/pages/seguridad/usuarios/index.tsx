import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button/Button";
import { Input } from "../../../components/ui/input/Input";
import Icon from "../../../components/ui/icons/Icon";
import Container from "../../../components/ui/layout/Container";
import { FormGenerator } from "../../../forms/FormGenerator";
import { mesaFacilFields } from "../../../components/ui/adapters";
import { useUsuarios } from "./useUsuarios";
import { DataTable } from "../../../components/data-table/DataTable";
import type { UsuarioDto } from "../../../services/generated/api";

import "./usuarios.css";

export default function UsuariosPage() {
  const {
    search,
    setSearch,
    isLoadingUsers,
    isError,
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
  } = useUsuarios();

  const columns = useMemo<ColumnDef<UsuarioDto>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "nombreCompleto",
        header: "Nombre Completo",
        cell: (info) => {
          const val = info.getValue() as string;
          return (
            <div className="users-page__user-name" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="users-page__avatar-placeholder" aria-hidden>
                {val?.charAt(0).toUpperCase() || "U"}
              </div>
              <span>{val}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "correo",
        header: "Correo Electrónico",
        cell: (info) => <span className="users-page__user-email">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "nombreEmpresa",
        header: "Empresa",
        cell: (info) => (info.getValue() as string) || "—",
      },
      {
        accessorKey: "nombreRol",
        header: "Rol",
        cell: (info) => (info.getValue() as string) || "—",
      },
    ],
    []
  );

  return (
    <Container as="div" maxWidth="xl" className="users-page">
      <header className="users-page__header">
        <div className="users-page__title-area">
          <h1 className="users-page__title">Administración de Usuarios</h1>
          <p className="users-page__subtitle">
            Crea, edita y administra las cuentas de usuarios en el sistema.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="UserPlus" />}
          onClick={() => openModal()}
        >
          Crear Usuario
        </Button>
      </header>

      <section className="users-page__filters" aria-label="Filtros de búsqueda">
        <Input
          label="Buscar usuario"
          placeholder="Filtra por nombre o correo electrónico..."
          leftIcon={<Icon name="Search" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          clearable
          onClear={() => setSearch("")}
        />
      </section>

      <div className="users-page__content">
        <DataTable
          columns={columns}
          data={filteredUsers}
          rowId={(u) => u.id ?? 0}
          page={1}
          pageSize={filteredUsers.length || 10}
          totalCount={filteredUsers.length}
          isLoading={isLoadingUsers}
          error={isError ? "No fue posible cargar los usuarios." : null}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          revealActionsOnHover
          actionsHeader="Acciones"
          rowActions={(user) => (
            <div className="users-page__actions" style={{ display: "flex", gap: 8 }}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Edit2" />}
                onClick={() => openModal(user)}
                aria-label={`Editar usuario ${user.nombreCompleto}`}
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Trash2" />}
                onClick={() =>
                  user.id && handleDelete(user.id, user.nombreCompleto ?? "")
                }
                aria-label={`Eliminar usuario ${user.nombreCompleto}`}
                disabled={isDeleting}
              />
            </div>
          )}
        />
      </div>

      {/* Modal Dialog for Create/Edit */}
      <dialog ref={dialogRef} className="users-page__dialog">
        <div className="users-page__form">
          <header className="users-page__form-header">
            <h2>{editingUser ? "Editar Usuario" : "Crear Usuario"}</h2>
            <button
              type="button"
              className="users-page__dialog-close"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="users-page__form-body">
            {isLoadingFields ? (
              <div className="users-page__state">
                <div className="users-page__spinner" aria-hidden />
                <p>Cargando campos del formulario...</p>
              </div>
            ) : isFieldsError ? (
              <div className="users-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>No fue posible cargar la estructura del formulario.</span>
              </div>
            ) : (
              <FormGenerator
                formId={formId}
                showDefaultSubmit={false}
                fields={dynamicFields}
                components={mesaFacilFields}
                onSubmit={handleFormikSubmit}
                initialValuesOverride={initialValuesOverride}
                dataSources={dataSources}
              />
            )}

            {formError && (
              <div className="users-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer className="users-page__form-footer">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={formId}
              variant="primary"
              isLoading={isInserting || isUpdating || isLoadingFields}
              disabled={isLoadingFields}
            >
              Guardar
            </Button>
          </footer>
        </div>
      </dialog>
    </Container>
  );
}
