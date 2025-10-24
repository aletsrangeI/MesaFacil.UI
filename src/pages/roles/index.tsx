import { useEffect } from "react";
import { DataTable } from "../../components/data-table/DataTable";
import { Button } from "../../components/ui/button";
import Icon from "../../components/ui/icons/Icon";
import { Modal } from "../../components/modal/Modal";
import { FormGenerator } from "../../forms/FormGenerator";
import DataTableToolbar from "../../components/data-table/DataTableToolbar";
import { useRolesTable } from "./hooks/useRolesTable";

export const RolesPage = () => {
  const {
    // tabla
    columns,
    rows,
    totalCount,
    page,
    pageSize,
    isLoading,
    isFetching,
    onPageChange,
    onPageSizeChange,
    refresh,
    create,
    edit,
  } = useRolesTable();

  // Cargar datos al montar
  useEffect(() => {
    // carga inicial una sola vez
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <DataTableToolbar
        title="Roles"
        onRefresh={refresh}
        isRefreshing={isLoading || isFetching}
        rightActions={
          <Button onClick={create.openCreate} leftIcon={<Icon name="Plus" />}>
            Nuevo
          </Button>
        }
      />

      <DataTable
        // Si tus columnas ya traen la col de acciones desde useRolesColumns,
        // no pases rowActions. Mantenemos el header visible si quieres.
        actionsHeader="Acciones"
        columns={columns}
        data={rows}
        emptyCta={null}
        error={null}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
        pageSize={pageSize}
        // rowActions: lo quitamos para delegar a la columna de acciones del hook
        revealActionsOnHover
        rowId={(r) => r.id}
        stickyActions
        toolbar={null}
        totalCount={totalCount}
      />

      {/* Modal Crear */}
      <Modal
        open={create.isOpen}
        onClose={create.closeCreate}
        title={create.title}
        description={create.description}
        size="md"
        closeOnOverlay
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={create.closeCreate}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={create.formId}
              variant="primary"
              disabled={create.isFetching || create.isSaving}
              rightIcon={<Icon name="Check" />}
            >
              Guardar
            </Button>
          </div>
        }
      >
        {create.isOpen && (
          <div style={{ paddingTop: 8 }}>
            <FormGenerator
              formId={create.formId}
              showDefaultSubmit={false}
              fields={create.formFields}
              components={create.components}
              onSubmit={create.handleCreateSubmit}
            />
            {create.isError && (
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
            {create.saveError && (
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
                <span>{create.saveError}</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal Editar */}
      <Modal
        open={edit.isOpen}
        onClose={edit.closeEdit}
        title={edit.title}
        description={edit.description}
        size="md"
        closeOnOverlay
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={edit.closeEdit}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={edit.formId}
              variant="primary"
              disabled={edit.isFetching || edit.isSaving}
              rightIcon={<Icon name="Check" />}
            >
              Guardar cambios
            </Button>
          </div>
        }
      >
        {edit.isOpen && (
          <div style={{ paddingTop: 8 }}>
            <FormGenerator
              formId={edit.formId}
              showDefaultSubmit={false}
              fields={edit.formFields}
              components={edit.components}
              initialValuesOverride={edit.initialValues}
              onSubmit={edit.handleEditSubmit}
            />
            {edit.isError && (
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
            {edit.saveError && (
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
                <span>{edit.saveError}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
};
