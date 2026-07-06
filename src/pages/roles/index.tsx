import { useEffect, useRef } from "react";
import { DataTable } from "../../components/data-table/DataTable";
import { Button } from "../../components/ui/button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import { FormGenerator } from "../../forms/FormGenerator";
import { useRolesTable } from "./useRolesTable";

import "./roles.css";

export const RolesPage = () => {
  const { table, createModal, editModal } = useRolesTable({
    apiPageStartsAt: 1,
  });

  const createDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);

  // Cargar datos al montar
  useEffect(() => {
    table.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar modales con estado nativo de <dialog>
  useEffect(() => {
    if (createModal.open) {
      createDialogRef.current?.showModal();
    } else {
      createDialogRef.current?.close();
    }
  }, [createModal.open]);

  useEffect(() => {
    if (editModal.open) {
      editDialogRef.current?.showModal();
    } else {
      editDialogRef.current?.close();
    }
  }, [editModal.open]);

  return (
    <Container as="div" maxWidth="xl" className="roles-page">
      <header className="roles-page__header">
        <div className="roles-page__title-area">
          <h1 className="roles-page__title">Administración de Roles</h1>
          <p className="roles-page__subtitle">
            Crea, edita y administra los niveles de seguridad y permisos en el sistema.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="UserCheck" />}
          onClick={createModal.openCreate}
        >
          Crear Rol
        </Button>
      </header>

      <div className="roles-page__content">
        <DataTable
          actionsHeader="Acciones"
          columns={table.columns}
          data={table.rows}
          emptyCta={null}
          error={table.error}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
          page={table.page}
          pageSize={table.pageSize}
          revealActionsOnHover
          isLoading={table.isLoading || table.isFetching}
          rowActions={(row) => {
            const { canDelete, onEdit, onDelete } = table.rowActionFor(row);
            return (
              <div className="roles-page__actions" style={{ display: "flex", gap: 8 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  leftIcon={<Icon name="Edit2" />}
                  onClick={onEdit}
                  aria-label={`Editar rol ${row.nombre}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  leftIcon={<Icon name="Trash2" />}
                  disabled={!canDelete}
                  onClick={onDelete}
                  aria-label={`Eliminar rol ${row.nombre}`}
                  title={canDelete ? "Eliminar" : "No se puede borrar (Sistema)"}
                />
              </div>
            );
          }}
          rowId={(r) => r.id}
          stickyActions
          toolbar={null}
          totalCount={table.totalCount}
        />
      </div>

      {/* Modal Dialog para Creación */}
      <dialog ref={createDialogRef} className="roles-page__dialog">
        <div className="roles-page__form">
          <header className="roles-page__form-header">
            <h2>Crear Rol</h2>
            <button
              type="button"
              className="roles-page__dialog-close"
              onClick={createModal.closeCreate}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="roles-page__form-body">
            {createModal.open && (
              <div style={{ paddingTop: 8 }}>
                <FormGenerator
                  formId={createModal.formId}
                  showDefaultSubmit={false}
                  fields={createModal.fields}
                  components={createModal.components}
                  onSubmit={createModal.handleCreateSubmit}
                />
                {createModal.isError && (
                  <div className="roles-page__form-error" role="alert">
                    <Icon name="AlertTriangle" />
                    <span>No fue posible cargar la estructura del formulario.</span>
                  </div>
                )}
              </div>
            )}
          </main>

          <footer className="roles-page__form-footer">
            <Button type="button" variant="ghost" onClick={createModal.closeCreate}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={createModal.formId}
              variant="primary"
              disabled={createModal.isFetching}
            >
              Guardar
            </Button>
          </footer>
        </div>
      </dialog>

      {/* Modal Dialog para Edición */}
      <dialog ref={editDialogRef} className="roles-page__dialog">
        <div className="roles-page__form">
          <header className="roles-page__form-header">
            <h2>Editar Rol</h2>
            <button
              type="button"
              className="roles-page__dialog-close"
              onClick={editModal.closeEdit}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="roles-page__form-body">
            {editModal.open && (
              <div style={{ paddingTop: 8 }}>
                <FormGenerator
                  formId={editModal.formId}
                  showDefaultSubmit={false}
                  fields={editModal.fields}
                  components={editModal.components}
                  initialValuesOverride={editModal.initialValues}
                  onSubmit={editModal.handleEditSubmit}
                />
                {editModal.isError && (
                  <div className="roles-page__form-error" role="alert">
                    <Icon name="AlertTriangle" />
                    <span>No fue posible cargar la estructura del formulario.</span>
                  </div>
                )}
                {editModal.saveError && (
                  <div className="roles-page__form-error" role="alert">
                    <Icon name="AlertTriangle" />
                    <span>{editModal.saveError}</span>
                  </div>
                )}
              </div>
            )}
          </main>

          <footer className="roles-page__form-footer">
            <Button type="button" variant="ghost" onClick={editModal.closeEdit}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={editModal.formId}
              variant="primary"
              disabled={editModal.isFetching || editModal.isSaving}
            >
              Guardar cambios
            </Button>
          </footer>
        </div>
      </dialog>
    </Container>
  );
};
