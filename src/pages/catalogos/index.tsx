// src/pages/catalogos/index.tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button/Button";
import { Input } from "../../components/ui/input/Input";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import { FormGenerator } from "../../forms/FormGenerator";
import { mesaFacilFields } from "../../components/ui/adapters";
import { DataTable } from "../../components/data-table/DataTable";
import { useCatalogoGenerico } from "./useCatalogoGenerico";
import type { GenericCatalogDto } from "../../services/generated/api";
import "./catalogo.css";

/** Diccionario de etiquetas por segmento de ruta.
 *  Para agregar un nuevo catálogo basta con añadir una línea aquí. */
export const CATALOG_LABELS: Record<string, string> = {
  "credenciales":             "Credenciales",
  "estaciones-cocina":        "Estaciones de Cocina",
  "estados-cuenta":           "Estados de Cuenta",
  "estados-item-kds":         "Estados de Ítem KDS",
  "estados-mesa":             "Estados de Mesa",
  "estados-pedido":           "Estados de Pedido",
  "estados-pedido-detalle":   "Estados de Pedido Detalle",
  "estados-ticket-cocina":    "Estados de Ticket Cocina",
  "impuestos":                "Impuestos",
  "metodos-pago":             "Métodos de Pago",
  "monedas":                  "Monedas",
  "tipos-descuento":          "Tipos de Descuento",
  "tipos-pedido":             "Tipos de Pedido",
};

export default function CatalogoPage() {
  const { catalog = "" } = useParams<{ catalog: string }>();
  const label = CATALOG_LABELS[catalog] ?? catalog;

  const {
    search, setSearch,
    filteredItems,
    isLoadingList, isListError,
    isDeleting,
    fields, isLoadingFields, isFieldsError,
    dialogRef, editingItem, formError,
    initialValuesOverride,
    openModal, closeModal,
    handleFormikSubmit, handleDelete,
    isInserting, isUpdating,
    formId,
  } = useCatalogoGenerico(catalog);

  const columns = useMemo<ColumnDef<GenericCatalogDto>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 70,
      },
      {
        accessorKey: "descripcion",
        header: "Descripción",
        cell: (info) => (
          <span style={{ fontWeight: 500 }}>{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Estado",
        size: 110,
        cell: (info) => {
          const active = info.getValue() as boolean;
          return (
            <span
              className={`catalogo-page__badge ${
                active
                  ? "catalogo-page__badge--active"
                  : "catalogo-page__badge--inactive"
              }`}
            >
              {active ? "Activo" : "Inactivo"}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <Container as="div" maxWidth="xl" className="catalogo-page">
      {/* Cabecera */}
      <header className="catalogo-page__header">
        <div className="catalogo-page__title-area">
          <h1 className="catalogo-page__title">{label}</h1>
          <p className="catalogo-page__subtitle">
            Administra los registros del catálogo de {label.toLowerCase()}.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="Plus" />}
          onClick={() => openModal()}
        >
          Nuevo Registro
        </Button>
      </header>

      {/* Filtro de búsqueda */}
      <section className="catalogo-page__filters" aria-label="Filtros de búsqueda">
        <Input
          label="Buscar"
          placeholder="Filtra por descripción..."
          leftIcon={<Icon name="Search" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          clearable
          onClear={() => setSearch("")}
        />
      </section>

      {/* Tabla */}
      <div className="catalogo-page__content">
        <DataTable
          columns={columns}
          data={filteredItems}
          rowId={(item) => item.id ?? 0}
          page={1}
          pageSize={filteredItems.length || 10}
          totalCount={filteredItems.length}
          isLoading={isLoadingList}
          error={isListError ? `No fue posible cargar el catálogo de ${label}.` : null}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          revealActionsOnHover
          actionsHeader="Acciones"
          rowActions={(item) => (
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Edit2" />}
                onClick={() => openModal(item)}
                aria-label={`Editar ${item.descripcion}`}
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Trash2" />}
                onClick={() =>
                  item.id != null && handleDelete(item.id, item.descripcion ?? "")
                }
                aria-label={`Eliminar ${item.descripcion}`}
                disabled={isDeleting}
              />
            </div>
          )}
        />
      </div>

      {/* Modal de creación / edición */}
      <dialog ref={dialogRef} className="catalogo-page__dialog">
        <div className="catalogo-page__form">
          <header className="catalogo-page__form-header">
            <h2>
              {editingItem ? `Editar ${label}` : `Nuevo ${label}`}
            </h2>
            <button
              type="button"
              className="catalogo-page__dialog-close"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="catalogo-page__form-body">
            {isLoadingFields ? (
              <div className="catalogo-page__state">
                <div className="catalogo-page__spinner" aria-hidden />
                <p>Cargando campos del formulario...</p>
              </div>
            ) : isFieldsError ? (
              <div className="catalogo-page__form-error" role="alert">
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
              />
            )}

            {formError && (
              <div className="catalogo-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer className="catalogo-page__form-footer">
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
