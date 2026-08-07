import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import { FormGenerator } from "../../forms/FormGenerator";
import { mesaFacilFields } from "../../components/ui/adapters";
import { DataTable } from "../../components/data-table/DataTable";
import { useMenus } from "./useMenus";

import "./menus.css";

export default function MenusPage() {
  const {
    menus,
    isLoadingList,
    isListError,
    isInserting,
    isUpdating,
    isDeleting,
    fields,
    isLoadingFields,
    isFieldsError,
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
  } = useMenus();

  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "activo", header: "Activo", cell: (info) => info.getValue() ? "Sí" : "No" }
  ], []);

  return (
    <Container as="div" maxWidth="xl" className="menus-page">
      <header className="menus-page__header">
        <div className="menus-page__title-area">
          <h1 className="menus-page__title">Administración de Menús</h1>
          <p className="menus-page__subtitle">
            Crea, edita y organiza los menús principales del restaurante.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="Plus" />}
          onClick={() => openModal()}
        >
          Crear Menú
        </Button>
      </header>

      <div className="menus-page__content">
        <DataTable
          columns={columns}
          data={menus}
          isLoading={isLoadingList}
          error={isListError ? "No fue posible cargar los menús." : null}
          rowId={(row: any) => row.id}
          page={1}
          pageSize={Math.max(10, menus.length)}
          totalCount={menus.length}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          revealActionsOnHover
          actionsHeader="Acciones"
          rowActions={(row: any) => (
            <div className="menus-page__actions" style={{ display: "flex", gap: 8 }}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Edit2" />}
                onClick={() => openModal(row)}
                aria-label={`Editar menú ${row.nombre}`}
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Trash2" />}
                onClick={() => handleDelete(row.id)}
                aria-label={`Eliminar menú ${row.nombre}`}
                disabled={isDeleting}
              />
            </div>
          )}
        />
      </div>

      <dialog ref={dialogRef} className="menus-page__dialog">
        <div className="menus-page__form">
          <header className="menus-page__form-header">
            <h2>{editingItem ? "Editar Menú" : "Nuevo Menú"}</h2>
            <button
              type="button"
              className="menus-page__dialog-close"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="menus-page__form-body">
            {isLoadingFields ? (
              <div className="menus-page__state">
                <div className="menus-page__spinner" aria-hidden />
                <p>Cargando campos del formulario...</p>
              </div>
            ) : isFieldsError ? (
              <div className="menus-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>No fue posible cargar la estructura del formulario.</span>
              </div>
            ) : (
              <FormGenerator
                formId={formId}
                showDefaultSubmit={false}
                fields={fields}
                components={mesaFacilFields}
                onSubmit={handleFormikSubmit}
                initialValuesOverride={initialValuesOverride}
                dataSources={dataSources}
              />
            )}

            {formError && (
              <div className="menus-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer className="menus-page__form-footer">
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
