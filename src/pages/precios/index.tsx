import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import { FormGenerator } from "../../forms/FormGenerator";
import { mesaFacilFields } from "../../components/ui/adapters";
import { DataTable } from "../../components/data-table/DataTable";
import { usePrecios } from "./usePrecios";

import "./precios.css";

export default function PreciosPage() {
  const {
    precios,
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
  } = usePrecios();

  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "idVariante", header: "ID Variante" },
    { accessorKey: "monto", header: "Monto" },
    { accessorKey: "activo", header: "Activo", cell: (info) => info.getValue() ? "Sí" : "No" }
  ], []);

  return (
    <Container as="div" maxWidth="xl" className="precios-page">
      <header className="precios-page__header">
        <div className="precios-page__title-area">
          <h1 className="precios-page__title">Administración de Precios</h1>
          <p className="precios-page__subtitle">
            Crea, edita y organiza los precios de las variantes.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="Plus" />}
          onClick={() => openModal()}
        >
          Crear Precio
        </Button>
      </header>

      <div className="precios-page__content">
        <DataTable
          columns={columns}
          data={precios}
          isLoading={isLoadingList}
          error={isListError ? "No fue posible cargar los precios." : null}
          rowId={(row: any) => row.id}
          page={1}
          pageSize={Math.max(10, precios.length)}
          totalCount={precios.length}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          revealActionsOnHover
          actionsHeader="Acciones"
          rowActions={(row: any) => (
            <div className="precios-page__actions" style={{ display: "flex", gap: 8 }}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Edit2" />}
                onClick={() => openModal(row)}
                aria-label={`Editar precio ${row.id}`}
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Trash2" />}
                onClick={() => handleDelete(row.id)}
                aria-label={`Eliminar precio ${row.id}`}
                disabled={isDeleting}
              />
            </div>
          )}
        />
      </div>

      <dialog ref={dialogRef} className="precios-page__dialog">
        <div className="precios-page__form">
          <header className="precios-page__form-header">
            <h2>{editingItem ? "Editar Precio" : "Nuevo Precio"}</h2>
            <button
              type="button"
              className="precios-page__dialog-close"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="precios-page__form-body">
            {isLoadingFields ? (
              <div className="precios-page__state">
                <div className="precios-page__spinner" aria-hidden />
                <p>Cargando campos del formulario...</p>
              </div>
            ) : isFieldsError ? (
              <div className="precios-page__form-error" role="alert">
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
              <div className="precios-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer className="precios-page__form-footer">
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
