import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import { FormGenerator } from "../../forms/FormGenerator";
import { mesaFacilFields } from "../../components/ui/adapters";
import { DataTable } from "../../components/data-table/DataTable";
import { useGrupoModificadores } from "./useGrupoModificadores";
import { useOpcionModificadores } from "./useOpcionModificadores";

import "./modificadores.css";

export default function ModificadoresPage() {
  const [activeTab, setActiveTab] = useState<"grupos" | "opciones">("grupos");

  const gruposHook = useGrupoModificadores();
  const opcionesHook = useOpcionModificadores();

  const columnasGrupos = useMemo<ColumnDef<any, any>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "idProducto", header: "ID Producto" },
    { accessorKey: "minSeleccion", header: "Min" },
    { accessorKey: "maxSeleccion", header: "Max" },
    { accessorKey: "obligatorio", header: "Obligatorio", cell: (info) => info.getValue() ? "Sí" : "No" },
    { accessorKey: "activo", header: "Activo", cell: (info) => info.getValue() ? "Sí" : "No" }
  ], []);

  const columnasOpciones = useMemo<ColumnDef<any, any>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "idGrupo", header: "ID Grupo" },
    { accessorKey: "precioExtra", header: "Precio Extra" },
    { accessorKey: "esDefault", header: "Es Default", cell: (info) => info.getValue() ? "Sí" : "No" },
    { accessorKey: "activo", header: "Activo", cell: (info) => info.getValue() ? "Sí" : "No" }
  ], []);

  return (
    <Container as="div" maxWidth="xl" className="modificadores-page">
      <header className="modificadores-page__header">
        <div className="modificadores-page__title-area">
          <h1 className="modificadores-page__title">Administración de Modificadores</h1>
          <p className="modificadores-page__subtitle">
            Crea, edita y organiza los grupos y opciones de modificadores para tus productos.
          </p>
        </div>
      </header>

      <div className="modificadores-page__tabs">
        <button 
          className={`modificadores-page__tab ${activeTab === "grupos" ? "modificadores-page__tab--active" : ""}`}
          onClick={() => setActiveTab("grupos")}
        >
          Grupos
        </button>
        <button 
          className={`modificadores-page__tab ${activeTab === "opciones" ? "modificadores-page__tab--active" : ""}`}
          onClick={() => setActiveTab("opciones")}
        >
          Opciones
        </button>
      </div>

      <div className="modificadores-page__content">
        {activeTab === "grupos" ? (
          <div className="modificadores-page__section">
            <div className="modificadores-page__section-header">
              <h2>Grupos de Modificadores</h2>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Icon name="Plus" />}
                onClick={() => gruposHook.openModal()}
              >
                Crear Grupo
              </Button>
            </div>
            <DataTable
              columns={columnasGrupos}
              data={gruposHook.grupos}
              isLoading={gruposHook.isLoadingList}
              error={gruposHook.isListError ? "Error cargando grupos" : null}
              rowId={(row: any) => row.id}
              page={1}
              pageSize={Math.max(10, gruposHook.grupos.length)}
              totalCount={gruposHook.grupos.length}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
              revealActionsOnHover
              actionsHeader="Acciones"
              rowActions={(row: any) => (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="ghost" size="sm" iconOnly leftIcon={<Icon name="Edit2" />} onClick={() => gruposHook.openModal(row.original)} />
                  <Button variant="ghost" size="sm" iconOnly leftIcon={<Icon name="Trash2" />} onClick={() => gruposHook.handleDelete(row.original.id)} disabled={gruposHook.isDeleting} />
                </div>
              )}
            />
          </div>
        ) : (
          <div className="modificadores-page__section">
            <div className="modificadores-page__section-header">
              <h2>Opciones de Modificadores</h2>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Icon name="Plus" />}
                onClick={() => opcionesHook.openModal()}
              >
                Crear Opción
              </Button>
            </div>
            <DataTable
              columns={columnasOpciones}
              data={opcionesHook.opciones}
              isLoading={opcionesHook.isLoadingList}
              error={opcionesHook.isListError ? "Error cargando opciones" : null}
              rowId={(row: any) => row.id}
              page={1}
              pageSize={Math.max(10, opcionesHook.opciones.length)}
              totalCount={opcionesHook.opciones.length}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
              revealActionsOnHover
              actionsHeader="Acciones"
              rowActions={(row: any) => (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="ghost" size="sm" iconOnly leftIcon={<Icon name="Edit2" />} onClick={() => opcionesHook.openModal(row.original)} />
                  <Button variant="ghost" size="sm" iconOnly leftIcon={<Icon name="Trash2" />} onClick={() => opcionesHook.handleDelete(row.original.id)} disabled={opcionesHook.isDeleting} />
                </div>
              )}
            />
          </div>
        )}
      </div>

      {/* Modal para Grupos */}
      <dialog ref={gruposHook.dialogRef} className="modificadores-page__dialog">
        <div className="modificadores-page__form">
          <header className="modificadores-page__form-header">
            <h2>{gruposHook.editingItem ? "Editar Grupo" : "Nuevo Grupo"}</h2>
            <button type="button" className="modificadores-page__dialog-close" onClick={gruposHook.closeModal}>×</button>
          </header>
          <main className="modificadores-page__form-body">
            {gruposHook.isLoadingFields ? (
              <p>Cargando campos...</p>
            ) : gruposHook.isFieldsError ? (
              <p>Error cargando estructura.</p>
            ) : (
              <FormGenerator
                formId={gruposHook.formId}
                showDefaultSubmit={false}
                fields={gruposHook.fields}
                components={mesaFacilFields}
                onSubmit={gruposHook.handleFormikSubmit}
                initialValuesOverride={gruposHook.initialValuesOverride}
                dataSources={gruposHook.dataSources}
              />
            )}
            {gruposHook.formError && <p style={{color: "red"}}>{gruposHook.formError}</p>}
          </main>
          <footer className="modificadores-page__form-footer">
            <Button type="button" variant="ghost" onClick={gruposHook.closeModal}>Cancelar</Button>
            <Button type="submit" form={gruposHook.formId} variant="primary" isLoading={gruposHook.isInserting || gruposHook.isUpdating} disabled={gruposHook.isLoadingFields}>Guardar</Button>
          </footer>
        </div>
      </dialog>

      {/* Modal para Opciones */}
      <dialog ref={opcionesHook.dialogRef} className="modificadores-page__dialog">
        <div className="modificadores-page__form">
          <header className="modificadores-page__form-header">
            <h2>{opcionesHook.editingItem ? "Editar Opción" : "Nueva Opción"}</h2>
            <button type="button" className="modificadores-page__dialog-close" onClick={opcionesHook.closeModal}>×</button>
          </header>
          <main className="modificadores-page__form-body">
            {opcionesHook.isLoadingFields ? (
              <p>Cargando campos...</p>
            ) : opcionesHook.isFieldsError ? (
              <p>Error cargando estructura.</p>
            ) : (
              <FormGenerator
                formId={opcionesHook.formId}
                showDefaultSubmit={false}
                fields={opcionesHook.fields}
                components={mesaFacilFields}
                onSubmit={opcionesHook.handleFormikSubmit}
                initialValuesOverride={opcionesHook.initialValuesOverride}
                dataSources={opcionesHook.dataSources}
              />
            )}
            {opcionesHook.formError && <p style={{color: "red"}}>{opcionesHook.formError}</p>}
          </main>
          <footer className="modificadores-page__form-footer">
            <Button type="button" variant="ghost" onClick={opcionesHook.closeModal}>Cancelar</Button>
            <Button type="submit" form={opcionesHook.formId} variant="primary" isLoading={opcionesHook.isInserting || opcionesHook.isUpdating} disabled={opcionesHook.isLoadingFields}>Guardar</Button>
          </footer>
        </div>
      </dialog>
    </Container>
  );
}
