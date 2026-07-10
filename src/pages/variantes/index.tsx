import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import { FormGenerator } from "../../forms/FormGenerator";
import { mesaFacilFields } from "../../components/ui/adapters";
import { DataTable } from "../../components/data-table/DataTable";
import { useVariantes } from "./useVariantes";

import "./variantes.css";

export default function VariantesPage() {
  const {
    variantes,
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
  } = useVariantes();

  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "codigo", header: "Código" },
    { accessorKey: "idProducto", header: "ID Producto" },
    { accessorKey: "esDefault", header: "Es Default", cell: (info) => info.getValue() ? "Sí" : "No" },
    { accessorKey: "activo", header: "Activo", cell: (info) => info.getValue() ? "Sí" : "No" }
  ], []);

  return (
    <Container as="div" maxWidth="xl" className="variantes-page">
      <header className="variantes-page__header">
        <div className="variantes-page__title-area">
          <h1 className="variantes-page__title">Administración de Variantes</h1>
          <p className="variantes-page__subtitle">
            Crea, edita y organiza las variantes de tus productos (ej. Tamaños, Presentaciones).
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="Plus" />}
          onClick={() => openModal()}
        >
          Crear Variante
        </Button>
      </header>

      <div className="variantes-page__content">
        <DataTable
          columns={columns}
          data={variantes}
          isLoading={isLoadingList}
          error={isListError ? "No fue posible cargar las variantes." : null}
          rowId={(row: any) => row.id}
          page={1}
          pageSize={Math.max(10, variantes.length)}
          totalCount={variantes.length}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          revealActionsOnHover
          actionsHeader="Acciones"
          rowActions={(row: any) => (
            <div className="variantes-page__actions" style={{ display: "flex", gap: 8 }}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Edit2" />}
                onClick={() => openModal(row.original)}
                aria-label={`Editar variante ${row.original.nombre}`}
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Trash2" />}
                onClick={() => handleDelete(row.original.id)}
                aria-label={`Eliminar variante ${row.original.nombre}`}
                disabled={isDeleting}
              />
            </div>
          )}
        />
      </div>

      <dialog ref={dialogRef} className="variantes-page__dialog">
        <div className="variantes-page__form">
          <header className="variantes-page__form-header">
            <h2>{editingItem ? "Editar Variante" : "Nueva Variante"}</h2>
            <button
              type="button"
              className="variantes-page__dialog-close"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="variantes-page__form-body">
            {isLoadingFields ? (
              <div className="variantes-page__state">
                <div className="variantes-page__spinner" aria-hidden />
                <p>Cargando campos del formulario...</p>
              </div>
            ) : isFieldsError ? (
              <div className="variantes-page__form-error" role="alert">
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
              <div className="variantes-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer className="variantes-page__form-footer">
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
