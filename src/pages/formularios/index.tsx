import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import { DataTable } from "../../components/data-table/DataTable";
import { useFormularios } from "./useFormularios";
import type { FormularioDto, FormFieldDto } from "../../services/generated/api";

import "./formularios.css";

export default function FormulariosPage() {
  const {
    formularios,
    isLoadingForms,
    isError,
    selectedFormId,
    setSelectedFormId,
    selectedForm,

    // Modal Formulario (Cabecera)
    formDialogRef,
    editingForm,
    formError,
    openFormModal,
    closeFormModal,
    handleFormSubmit,
    handleFormDelete,
    isInsertingForm,
    isUpdatingForm,

    // Modal FormField (Detalle)
    fieldDialogRef,
    editingField,
    fieldError,
    openFieldModal,
    closeFieldModal,
    handleFieldSubmit,
    handleFieldDelete,
    isInsertingField,
    isUpdatingField,
  } = useFormularios();

  const hasValidation = (type: string) => {
    return editingField?.validations?.some((v) => v.type === type) ?? false;
  };

  const getValidationValue = (type: string) => {
    const val = editingField?.validations?.find((v) => v.type === type)?.value;
    return val !== undefined && val !== 1 ? String(val) : "";
  };

  // Columnas para la tabla de Formularios (Cabeceras)
  const formColumns = useMemo<ColumnDef<FormularioDto>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre del Formulario",
        cell: (info) => <span style={{ fontWeight: 600 }}>{info.getValue() as string}</span>,
      },
      {
        accessorKey: "codigo",
        header: "Código",
        cell: (info) => <code style={{ fontSize: "12px", background: "#f5f5f5", padding: "2px 6px", borderRadius: "4px" }}>{info.getValue() as string}</code>,
      },
    ],
    []
  );

  // Columnas para la tabla de FormFields (Detalles)
  const fieldColumns = useMemo<ColumnDef<FormFieldDto>[]>(
    () => [
      {
        accessorKey: "orden",
        header: "Orden",
        cell: (info) => <span style={{ fontWeight: 600 }}>{info.getValue() as number}</span>,
      },
      {
        accessorKey: "label",
        header: "Etiqueta / Input",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div style={{ display: "grid", gap: "2px" }}>
              <span style={{ fontWeight: 500 }}>{row.label}</span>
              <small style={{ color: "var(--color-muted)", fontSize: "11px" }}>
                Name: <code>{row.name}</code> | Tipo: <code>{row.type}</code>
              </small>
            </div>
          );
        },
      },
      {
        accessorKey: "placeholder",
        header: "Placeholder",
        cell: (info) => (info.getValue() as string) || "—",
      },
      {
        accessorKey: "validations",
        header: "Validaciones",
        cell: (info) => {
          const val = info.getValue() as FormFieldDto["validations"];
          if (!val || val.length === 0) return "Ninguna";
          return (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {val.map((v, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "10px",
                    background: "rgba(214, 69, 69, 0.08)",
                    color: "var(--color-primary)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: "1px solid rgba(214, 69, 69, 0.15)",
                  }}
                >
                  {v.type}
                  {v.value !== undefined && v.value !== 1 ? `: ${v.value}` : ""}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "dataSource",
        header: "Origen / Opciones",
        cell: (info) => {
          const row = info.row.original;
          if (row.dataSource) {
            return (
              <span style={{ fontSize: "11px", color: "#198754", background: "rgba(25, 135, 84, 0.08)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(25, 135, 84, 0.15)" }}>
                API: {row.dataSource}
              </span>
            );
          }
          if (row.options && row.options.length > 0) {
            return (
              <span style={{ fontSize: "11px", color: "#0d6efd", background: "rgba(13, 110, 253, 0.08)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(13, 110, 253, 0.15)" }}>
                {row.options.length} opciones fijas
              </span>
            );
          }
          return "—";
        },
      },
      {
        accessorKey: "isActive",
        header: "Estado",
        cell: (info) => (
          <span
            style={{
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: info.getValue() ? "rgba(25, 135, 84, 0.1)" : "rgba(108, 117, 125, 0.1)",
              color: info.getValue() ? "#198754" : "#6c757d",
            }}
          >
            {info.getValue() ? "Activo" : "Inactivo"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <Container as="div" maxWidth="xl" className="forms-page">
      <header className="forms-page__header">
        <div className="forms-page__title-area">
          <h1 className="forms-page__title">Administración de Formularios</h1>
          <p className="forms-page__subtitle">
            Gestiona la estructura dinámica, campos y validaciones de Server-Driven UI.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="Plus" />}
          onClick={() => openFormModal()}
        >
          Nuevo Formulario
        </Button>
      </header>

      <div className="forms-page__panels">
        {/* Panel Izquierdo: Cabeceras de Formulario */}
        <div className="forms-page__panel">
          <header className="forms-page__panel-header">
            <h2 className="forms-page__panel-title">Lista de Formularios</h2>
          </header>
          <div style={{ padding: "8px 0" }}>
            <DataTable
              columns={formColumns}
              data={formularios}
              rowId={(f) => f.id ?? 0}
              page={1}
              pageSize={formularios.length || 10}
              totalCount={formularios.length}
              isLoading={isLoadingForms}
              error={isError ? "No fue posible cargar los formularios." : null}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
              revealActionsOnHover
              actionsHeader="Acciones"
              rowActions={(form) => (
                <div className="forms-page__actions">
                  <Button
                    variant={selectedFormId === form.id ? "primary" : "ghost"}
                    size="sm"
                    iconOnly
                    leftIcon={<Icon name={selectedFormId === form.id ? "Eye" : "EyeOff"} />}
                    onClick={() => setSelectedFormId(form.id ?? null)}
                    title="Ver Campos"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    leftIcon={<Icon name="Edit2" />}
                    onClick={() => openFormModal(form)}
                    title="Editar Cabecera"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    leftIcon={<Icon name="Trash2" />}
                    onClick={() =>
                      form.id && handleFormDelete(form.id, form.nombre ?? "")
                    }
                    title="Eliminar Formulario"
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* Panel Derecho: Detalle de FormFields */}
        <div className="forms-page__panel">
          {selectedForm ? (
            <>
              <header className="forms-page__panel-header">
                <div>
                  <h2 className="forms-page__panel-title">{selectedForm.nombre}</h2>
                  <p className="forms-page__panel-subtitle">
                    Código: <code>{selectedForm.codigo}</code>
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Icon name="Plus" />}
                  onClick={() => openFieldModal()}
                >
                  Agregar Campo
                </Button>
              </header>
              <div style={{ padding: "8px 0" }}>
                <DataTable
                  columns={fieldColumns}
                  data={selectedForm.campos || []}
                  rowId={(f) => f.id ?? 0}
                  page={1}
                  pageSize={selectedForm.campos?.length || 10}
                  totalCount={selectedForm.campos?.length || 0}
                  isLoading={false}
                  error={null}
                  onPageChange={() => {}}
                  onPageSizeChange={() => {}}
                  revealActionsOnHover
                  actionsHeader="Acciones"
                  rowActions={(field) => (
                    <div className="forms-page__actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        leftIcon={<Icon name="Edit2" />}
                        onClick={() => openFieldModal(field)}
                        title="Editar Campo"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        leftIcon={<Icon name="Trash2" />}
                        onClick={() =>
                          field.id && handleFieldDelete(field.id, field.label ?? "")
                        }
                        title="Eliminar Campo"
                      />
                    </div>
                  )}
                />
              </div>
            </>
          ) : (
            <div className="forms-page__panel-placeholder">
              <Icon name="Settings" />
              <h3>Sin Formulario Seleccionado</h3>
              <p>Selecciona un formulario de la lista de la izquierda para ver, agregar o configurar sus campos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog para Formulario (Cabecera) */}
      <dialog ref={formDialogRef} className="forms-page__dialog">
        <form onSubmit={handleFormSubmit} className="forms-page__form">
          <header className="forms-page__form-header">
            <h2>{editingForm ? "Editar Formulario" : "Crear Formulario"}</h2>
            <button
              type="button"
              className="forms-page__dialog-close"
              onClick={closeFormModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="forms-page__form-body">
            <div className="forms-page__form-group">
              <label htmlFor="codigo">Código del Formulario *</label>
              <input
                id="codigo"
                name="codigo"
                type="text"
                placeholder="Ej: REGISTRO_USUARIO"
                defaultValue={editingForm?.codigo ?? ""}
                required
              />
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="nombre">Nombre Visual *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: Registro de Usuario"
                defaultValue={editingForm?.nombre ?? ""}
                required
              />
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Indica el propósito de este formulario..."
                defaultValue={editingForm?.descripcion ?? ""}
              />
            </div>

            {formError && (
              <div className="forms-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer className="forms-page__form-footer">
            <Button type="button" variant="ghost" onClick={closeFormModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isInsertingForm || isUpdatingForm}
            >
              Guardar
            </Button>
          </footer>
        </form>
      </dialog>

      {/* Modal Dialog para FormField (Detalle) */}
      <dialog ref={fieldDialogRef} className="forms-page__dialog">
        <form onSubmit={handleFieldSubmit} className="forms-page__form">
          <header className="forms-page__form-header">
            <h2>{editingField ? "Editar Campo de Formulario" : "Agregar Campo a Formulario"}</h2>
            <button
              type="button"
              className="forms-page__dialog-close"
              onClick={closeFieldModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="forms-page__form-body">
            <div className="forms-page__form-group">
              <label htmlFor="type">Tipo de Control *</label>
              <select id="type" name="type" defaultValue={editingField?.type ?? "text"}>
                <option value="text">Texto simple (text)</option>
                <option value="password">Contraseña (password)</option>
                <option value="select">Lista de opciones (select)</option>
                <option value="date">Fecha (date)</option>
                <option value="checkbox">Booleano (checkbox)</option>
              </select>
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="name">Nombre Clave (Formik/API Name) *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ej: correo, password, idRol"
                defaultValue={editingField?.name ?? ""}
                required
              />
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="label">Etiqueta Visual (Label) *</label>
              <input
                id="label"
                name="label"
                type="text"
                placeholder="Ej: Correo Electrónico"
                defaultValue={editingField?.label ?? ""}
                required
              />
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="placeholder">Texto de Ayuda (Placeholder)</label>
              <input
                id="placeholder"
                name="placeholder"
                type="text"
                placeholder="Ej: Ingresa tu correo electrónico..."
                defaultValue={editingField?.placeholder ?? ""}
              />
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="orden">Orden de Renderizado (Secuencia) *</label>
              <input
                id="orden"
                name="orden"
                type="number"
                min="0"
                placeholder="Ej: 1"
                defaultValue={editingField?.orden ?? 1}
                required
              />
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="dataSource">Origen de Datos Dinámico (DataSource)</label>
              <input
                id="dataSource"
                name="dataSource"
                type="text"
                placeholder="Ej: roles, empresas (sólo select)"
                defaultValue={editingField?.dataSource ?? ""}
              />
            </div>

            <div className="forms-page__form-group" style={{ border: "1px solid rgba(0,0,0,0.08)", padding: "12px", borderRadius: "6px", gap: "10px" }}>
              <label style={{ fontWeight: 600, fontSize: "13px" }}>Reglas de Validación</label>
              
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", margin: "4px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "normal", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="validation_required"
                    value="true"
                    defaultChecked={hasValidation("required")}
                    style={{ width: "16px", height: "16px" }}
                  />
                  ¿Es Obligatorio?
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "normal", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="validation_email"
                    value="true"
                    defaultChecked={hasValidation("email")}
                    style={{ width: "16px", height: "16px" }}
                  />
                  ¿Es Email?
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="forms-page__form-group">
                  <label htmlFor="validation_minLength" style={{ fontSize: "12px", fontWeight: "normal" }}>Longitud Mínima</label>
                  <input
                    id="validation_minLength"
                    name="validation_minLength"
                    type="number"
                    min="0"
                    placeholder="Ej: 8"
                    defaultValue={getValidationValue("minLength")}
                  />
                </div>

                <div className="forms-page__form-group">
                  <label htmlFor="validation_maxLength" style={{ fontSize: "12px", fontWeight: "normal" }}>Longitud Máxima</label>
                  <input
                    id="validation_maxLength"
                    name="validation_maxLength"
                    type="number"
                    min="0"
                    placeholder="Ej: 150"
                    defaultValue={getValidationValue("maxLength")}
                  />
                </div>
              </div>
            </div>

            <div className="forms-page__form-group">
              <label htmlFor="options">Opciones Estáticas (Dropdown) - <small>Opcional</small></label>
              <textarea
                id="options"
                name="options"
                placeholder='Escribe las opciones separadas por comas (ej: Opción A, Opción B) o en formato JSON'
                defaultValue={editingField?.options ? (
                  editingField.options.every(o => o.nombre)
                    ? editingField.options.map(o => o.nombre).join(", ")
                    : JSON.stringify(editingField.options)
                ) : ""}
                style={{ fontFamily: "monospace", fontSize: "12px", minHeight: "60px" }}
              />
            </div>

            <div className="forms-page__form-group forms-page__form-group--row">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                value="true"
                defaultChecked={editingField?.isActive ?? true}
              />
              <label htmlFor="isActive">¿Campo Activo / Habilitado?</label>
            </div>

            {fieldError && (
              <div className="forms-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{fieldError}</span>
              </div>
            )}
          </main>

          <footer className="forms-page__form-footer">
            <Button type="button" variant="ghost" onClick={closeFieldModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isInsertingField || isUpdatingField}
            >
              Guardar Campo
            </Button>
          </footer>
        </form>
      </dialog>
    </Container>
  );
}
