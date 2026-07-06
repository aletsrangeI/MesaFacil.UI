import { useEffect } from "react";
import { DataTable } from "../../components/data-table/DataTable";
import { Button } from "../../components/ui/button";
import Icon from "../../components/ui/icons/Icon";
import { Modal } from "../../components/modal/Modal";
import { FormGenerator } from "../../forms/FormGenerator";
import { useRolesTable } from "./useRolesTable";
import DataTableToolbar from "../../components/data-table/DataTableToolbar";

export const RolesPage = () => {
  const { table, createModal, editModal } = useRolesTable({
    apiPageStartsAt: 1,
  });

  // Cargar datos al montar
  useEffect(() => {
    table.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <DataTableToolbar
        title="Roles"
        // Si después agregas búsqueda, pasa onSearchChange y searchValue desde el hook
        onRefresh={table.refetch}
        isRefreshing={table.isLoading || table.isFetching}
        rightActions={
          <Button
            onClick={createModal.openCreate}
            leftIcon={<Icon name="Plus" />}
          >
            Nuevo
          </Button>
        }
      />

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
        rowActions={(row) => {
          const { canDelete, onEdit, onDelete } = table.rowActionFor(row);
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={onEdit} title="Editar">
                <Icon name="Pencil" />
              </Button>
              <Button
                variant="ghost"
                disabled={!canDelete}
                onClick={onDelete}
                title={canDelete ? "Eliminar" : "No se puede borrar (Sistema)"}
              >
                <Icon name="Trash2" />
              </Button>
            </div>
          );
        }}
        rowId={(r) => r.id}
        stickyActions
        toolbar={null}
        totalCount={table.totalCount}
      />

      <Modal
        open={createModal.open}
        onClose={createModal.closeCreate}
        title={createModal.title}
        description={createModal.description}
        size="md"
        closeOnOverlay
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={createModal.closeCreate}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={createModal.formId}
              variant="primary"
              disabled={createModal.isFetching}
              rightIcon={<Icon name="Check" />}
            >
              Guardar
            </Button>
          </div>
        }
      >
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
              <div
                role="alert"
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Icon name="AlertTriangle" />
                <span>No fue posible cargar el formulario.</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={editModal.open}
        onClose={editModal.closeEdit}
        title={editModal.title}
        description={editModal.description}
        size="md"
        closeOnOverlay
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={editModal.closeEdit}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={editModal.formId}
              variant="primary"
              disabled={editModal.isFetching || editModal.isSaving}
              rightIcon={<Icon name="Check" />}
            >
              Guardar cambios
            </Button>
          </div>
        }
      >
        {editModal.open && (
          <div style={{ paddingTop: 8 }}>
            <FormGenerator
              formId={editModal.formId}
              showDefaultSubmit={false}
              fields={editModal.fields}
              components={editModal.components}
              initialValuesOverride={editModal.initialValues} // 👈 setea valores existentes
              onSubmit={editModal.handleEditSubmit}
            />
            {editModal.isError && (
              <div
                role="alert"
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Icon name="AlertTriangle" />
                <span>No fue posible cargar el formulario.</span>
              </div>
            )}
            {editModal.saveError && (
              <div
                role="alert"
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Icon name="AlertTriangle" />
                <span>{editModal.saveError}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
};
