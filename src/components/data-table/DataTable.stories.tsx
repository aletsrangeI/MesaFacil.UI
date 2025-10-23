import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import "./data-table.css";
import { Button } from "../ui/button";
import Icon from "../ui/icons/Icon";

type Row = {
  id: number;
  nombre: string;
  isSystem: boolean;
  isAssignable: boolean;
};

const COLUMNS: ColumnDef<Row, any>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nombre", header: "Nombre" },
  {
    accessorKey: "isSystem",
    header: "Sistema",
    cell: ({ getValue }) => (
      <span className="mf-badge">{getValue<boolean>() ? "Sí" : "No"}</span>
    ),
  },
  {
    accessorKey: "isAssignable",
    header: "Asignable",
    cell: ({ getValue }) => (
      <span className="mf-badge">{getValue<boolean>() ? "Sí" : "No"}</span>
    ),
  },
];

const makeRows = (n = 10): Row[] =>
  Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    nombre: `Rol ${i + 1}`,
    isSystem: i % 2 === 0,
    isAssignable: i % 3 !== 0,
  }));

const meta = {
  title: "Data Display/DataTable",
  component: DataTable<Row>,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    onPageChange: { action: "pageChange" },
    onPageSizeChange: { action: "pageSizeChange" },
  },
  args: {
    columns: COLUMNS,
    data: makeRows(10),
    rowId: (r: Row) => r.id,
    page: 1,
    pageSize: 10,
    totalCount: 42,
    isLoading: false,
    error: null,
    toolbar: null,
    emptyCta: null,
  },
} satisfies Meta<typeof DataTable<Row>>;

export default meta;

type Story = StoryObj<typeof DataTable<Row>>;

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page ?? 1);
    const [pageSize, setPageSize] = useState(args.pageSize ?? 10);
    const data = useMemo(() => makeRows(Math.min(100, pageSize)), [pageSize]);

    return (
      <div style={{ padding: 16 }}>
        <DataTable<Row>
          {...args}
          data={data}
          page={page}
          pageSize={pageSize}
          totalCount={100}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          toolbar={<ToolbarInStory />}
          rowActions={(row) => (
            <>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Editar ${row.nombre}`}
                leftIcon={<Icon name="Pencil" />}
                onClick={() => alert(`Editar id=${row.id}`)}
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Eliminar ${row.nombre}`}
                leftIcon={<Icon name="Trash2" />}
                onClick={() => confirm("¿Eliminar?") && alert("Eliminado")}
                style={{ color: "var(--color-primary)" }}
              />
            </>
          )}
          actionsHeader="Acciones"
          stickyActions
          revealActionsOnHover
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: { isLoading: true, data: [], totalCount: 0 },
  render: (args) => (
    <div style={{ padding: 16 }}>
      <DataTable<Row> {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { data: [], totalCount: 0 },
  render: (args) => (
    <div style={{ padding: 16 }}>
      <DataTable<Row>
        {...args}
        toolbar={<ToolbarInStory />}
        emptyCta={
          <Button variant="primary" iconOnly onClick={() => alert("Crear rol")}>
            Crear rol
          </Button>
        }
      />
    </div>
  ),
};

export const ErrorState: Story = {
  args: { data: [], totalCount: 0, error: "No se pudo cargar" },
  render: (args) => (
    <div style={{ padding: 16 }}>
      <DataTable<Row>
        {...args}
        toolbar={<ToolbarInStory />}
        rowActions={(row) => (
          <>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={`Editar ${row.nombre}`}
              leftIcon={<Icon name="Pencil" />}
              onClick={() => alert(`Editar id=${row.id}`)}
            />
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={`Eliminar ${row.nombre}`}
              leftIcon={<Icon name="Trash2" />}
              onClick={() => confirm("¿Eliminar?") && alert("Eliminado")}
              style={{ color: "var(--color-primary)" }}
            />
          </>
        )}
        actionsHeader="Acciones"
        stickyActions
        revealActionsOnHover
      />
    </div>
  ),
};

export const Compact: Story = {
  ...Playground,
  render: (args) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const data = useMemo(() => makeRows(pageSize), [pageSize]);

    return (
      <div style={{ padding: 16 }}>
        <div className="mf-table is-compact">
          <DataTable<Row>
            {...args}
            data={data}
            page={page}
            pageSize={pageSize}
            totalCount={100}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>
      </div>
    );
  },
};

function ToolbarInStory() {
  const [q, setQ] = useState("");
  const [isRefreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900); // mock
  };

  return (
    <div className="mf-toolbar">
      <div className="mf-toolbar__row">
        <div className="mf-toolbar__left">
          <h3 className="mf-toolbar__title">Roles</h3>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Icon name="Plus" />}
            onClick={() => alert("Crear rol")}
          >
            Crear rol
          </Button>
        </div>

        <div className="mf-toolbar__right">
          {/* buscador */}
          <label className="mf-input mf-input--search">
            <Icon name="Search" size={18} aria-hidden />
            <input
              placeholder="Buscar…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Buscar en la tabla"
            />
            {q ? (
              <button
                type="button"
                className="mf-input__clear"
                aria-label="Limpiar búsqueda"
                onClick={() => setQ("")}
              >
                <Icon name="X" size={16} />
              </button>
            ) : null}
          </label>

          {/* acciones derechas */}
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon name="RefreshCw" />}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Actualizando…" : "Actualizar"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon name="Download" />}
            onClick={() => alert("Exportar CSV")}
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
