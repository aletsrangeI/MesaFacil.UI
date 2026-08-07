import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button/Button";
import Icon from "../../../components/ui/icons/Icon";
import Container from "../../../components/ui/layout/Container";
import { FormGenerator } from "../../../forms/FormGenerator";
import { mesaFacilFields } from "../../../components/ui/adapters";
import { DataTable } from "../../../components/data-table/DataTable";
import { useSucursal } from "./useSucursal";

export default function SucursalesPage() {
  const {
    sucursales,
    isLoadingList,
    isListError,
    isInserting,
    isUpdating,
    isDeleting,
    fields,
    isLoadingFields,
    
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
  } = useSucursal();

  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "direccion", header: "Dirección" },
    { accessorKey: "zonaHoraria", header: "Zona Horaria" }
  ], []);

  return (
    <Container as="div" maxWidth="xl" style={{ padding: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Gestión de Sucursales</h1>
          <p style={{ margin: 0, color: '#666' }}>
            Configura las distintas sucursales del restaurante.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="Plus" />}
          onClick={() => openModal()}
        >
          Crear Sucursal
        </Button>
      </header>

      <div>
        <DataTable
          columns={columns}
          data={sucursales}
          isLoading={isLoadingList}
          error={isListError ? "No fue posible cargar las sucursales." : null}
          rowId={(row: any) => row.id}
          page={1}
          pageSize={Math.max(10, sucursales.length)}
          totalCount={sucursales.length}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          revealActionsOnHover
          actionsHeader="Acciones"
          rowActions={(row: any) => (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Edit2" />}
                onClick={() => openModal(row)}
                aria-label={`Editar sucursal ${row.nombre}`}
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Icon name="Trash2" />}
                onClick={() => handleDelete(row.id)}
                aria-label={`Eliminar sucursal ${row.nombre}`}
                disabled={isDeleting}
              />
            </div>
          )}
        />
      </div>

      <dialog ref={dialogRef} style={{ border: 'none', borderRadius: '8px', padding: 0, minWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <header style={{ padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>{editingItem ? "Editar Sucursal" : "Nueva Sucursal"}</h2>
            <button
              type="button"
              onClick={closeModal}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
          </header>

          <main style={{ padding: '24px' }}>
            <FormGenerator
              formId={formId}
              showDefaultSubmit={false}
              fields={fields}
              components={mesaFacilFields}
              onSubmit={handleFormikSubmit}
              initialValuesOverride={initialValuesOverride}
              dataSources={dataSources}
            />

            {formError && (
              <div style={{ marginTop: '16px', color: 'red', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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
