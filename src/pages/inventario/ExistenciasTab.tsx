import React, { useState } from "react";
import { Button } from "../../components/ui/button/Button";
import { Modal } from "../../components/modal/Modal";
import { useToast } from "../../components/ui/toast";
import {
  useGetExistenciasQuery,
  useCrearAlmacenMutation,
  type Almacen,
  type CategoriaInsumo,
} from "../../services/inventarioApi";
import {
  Boxes,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Search,
  Plus,
  ArrowRightLeft,
  Warehouse,
  Check,
} from "lucide-react";

interface ExistenciasTabProps {
  almacenes: Almacen[];
  categorias: CategoriaInsumo[];
  sucursales?: Array<{ id: number; nombre: string; codigo?: string }>;
  idSucursalActual?: number;
  tiposAlmacen?: Array<{ id: number; codigo: string; descripcion: string }>;
  onOpenMovimiento: (insumoId: number, almacenId?: number) => void;
  onGoToTraspasos: () => void;
}

export const ExistenciasTab: React.FC<ExistenciasTabProps> = ({
  almacenes,
  categorias,
  sucursales = [],
  idSucursalActual,
  tiposAlmacen = [],
  onOpenMovimiento,
  onGoToTraspasos,
}) => {
  const { addToast } = useToast();
  const [selectedAlmacen, setSelectedAlmacen] = useState<string>("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [soloBajoStock, setSoloBajoStock] = useState(false);
  const [search, setSearch] = useState("");

  const { data: existencias = [], isLoading } = useGetExistenciasQuery({
    idSucursal: idSucursalActual,
    idAlmacen: selectedAlmacen ? Number(selectedAlmacen) : undefined,
    idCategoria: selectedCategoria ? Number(selectedCategoria) : undefined,
    soloBajoStock: soloBajoStock ? true : undefined,
    search: search ? search : undefined,
  });

  const [crearAlmacen, { isLoading: isCreatingAlmacen }] = useCrearAlmacenMutation();
  const [isAlmacenModalOpen, setIsAlmacenModalOpen] = useState(false);

  // Form Almacén
  const [almacenSucursalId, setAlmacenSucursalId] = useState<number>(
    idSucursalActual || (sucursales[0]?.id ?? 1)
  );
  const [almacenCodigo, setAlmacenCodigo] = useState("");
  const [almacenNombre, setAlmacenNombre] = useState("");
  const [almacenTipo, setAlmacenTipo] = useState("General");
  const [almacenEsPrincipal, setAlmacenEsPrincipal] = useState(false);

  // Actualizar sucursal por defecto cuando cambie idSucursalActual o sucursales
  React.useEffect(() => {
    if (idSucursalActual) {
      setAlmacenSucursalId(idSucursalActual);
    } else if (sucursales.length > 0 && !almacenSucursalId) {
      setAlmacenSucursalId(sucursales[0].id);
    }
  }, [idSucursalActual, sucursales]);

  // Cálculos de KPIs
  const totalInsumos = existencias.length;
  const valorizadoTotal = existencias.reduce((acc, curr) => acc + curr.valorizado, 0);
  const bajoStockCount = existencias.filter(
    (e) => e.estadoStock === "Bajo" || e.estadoStock === "Agotado"
  ).length;
  const criticosCount = existencias.filter((e) => e.esCritico).length;

  const handleCrearAlmacen = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetSucursalId = almacenSucursalId || idSucursalActual || (sucursales.length > 0 ? sucursales[0].id : 1);

    if (!almacenNombre.trim()) {
      addToast({ message: "El nombre del almacén es obligatorio", variant: "error" });
      return;
    }

    if (!targetSucursalId) {
      addToast({ message: "Debe seleccionar una sucursal para el almacén", variant: "error" });
      return;
    }

    try {
      await crearAlmacen({
        idSucursal: targetSucursalId,
        codigo: almacenCodigo || undefined,
        nombre: almacenNombre.trim(),
        tipoAlmacen: almacenTipo,
        esPrincipal: almacenEsPrincipal,
      }).unwrap();

      addToast({ message: "Almacén creado exitosamente", variant: "success" });
      setIsAlmacenModalOpen(false);
      setAlmacenNombre("");
      setAlmacenCodigo("");
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al crear almacén",
        variant: "error",
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* KPIs Grid */}
      <div className="inv-kpi-grid">
        <div className="inv-kpi-card">
          <div className="inv-kpi-icon" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
            <Boxes size={22} />
          </div>
          <div className="inv-kpi-info">
            <span className="inv-kpi-label">Existencias en Línea</span>
            <span className="inv-kpi-value">{totalInsumos}</span>
          </div>
        </div>

        <div className="inv-kpi-card">
          <div className="inv-kpi-icon" style={{ background: "rgba(60, 141, 64, 0.12)", color: "#3c8d40" }}>
            <DollarSign size={22} />
          </div>
          <div className="inv-kpi-info">
            <span className="inv-kpi-label">Valorizado Total</span>
            <span className="inv-kpi-value">${valorizadoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</span>
          </div>
        </div>

        <div className="inv-kpi-card">
          <div className="inv-kpi-icon" style={{ background: "rgba(226, 167, 46, 0.14)", color: "#b45309" }}>
            <AlertTriangle size={22} />
          </div>
          <div className="inv-kpi-info">
            <span className="inv-kpi-label">Por Reorden / Agotados</span>
            <span className="inv-kpi-value" style={{ color: bajoStockCount > 0 ? "var(--color-danger, #d64545)" : "inherit" }}>
              {bajoStockCount}
            </span>
          </div>
        </div>

        <div className="inv-kpi-card">
          <div className="inv-kpi-icon" style={{ background: "rgba(220, 38, 38, 0.12)", color: "#dc2626" }}>
            <Sparkles size={22} />
          </div>
          <div className="inv-kpi-info">
            <span className="inv-kpi-label">Insumos Críticos</span>
            <span className="inv-kpi-value">{criticosCount}</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="inv-filters-bar">
        <div className="inv-search-box">
          <Search size={18} color="var(--color-text-muted, #6b7280)" />
          <input
            type="text"
            className="inv-search-input"
            placeholder="Filtrar por código o nombre de insumo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="inv-filter-group">
          <select
            className="inv-select"
            value={selectedAlmacen}
            onChange={(e) => setSelectedAlmacen(e.target.value)}
          >
            <option value="">Todos los Almacenes</option>
            {almacenes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre} ({a.tipoAlmacen})
              </option>
            ))}
          </select>

          <select
            className="inv-select"
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="">Todas las Categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <Button
            variant={soloBajoStock ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSoloBajoStock(!soloBajoStock)}
            leftIcon={<AlertTriangle size={15} />}
          >
            {soloBajoStock ? "Filtrado por Desabasto" : "Solo Bajo Stock"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAlmacenModalOpen(true)}
            leftIcon={<Warehouse size={15} />}
          >
            Nuevo Almacén
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onGoToTraspasos}
            leftIcon={<ArrowRightLeft size={15} />}
          >
            Traspaso
          </Button>
        </div>
      </div>

      {/* Tabla de Existencias */}
      <div className="inv-table-card">
        <div className="inv-table-wrapper">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Almacén</th>
                <th>Código</th>
                <th>Insumo</th>
                <th>Categoría</th>
                <th style={{ textAlign: "right" }}>Stock Actual</th>
                <th style={{ textAlign: "right" }}>Stock Mínimo</th>
                <th style={{ textAlign: "right" }}>Costo Promedio (CPP)</th>
                <th style={{ textAlign: "right" }}>Valorizado</th>
                <th style={{ textAlign: "center" }}>Estado</th>
                <th style={{ textAlign: "center" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "2.5rem" }}>
                    Consultando existencias en almacenes...
                  </td>
                </tr>
              ) : existencias.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-text-muted, #6b7280)" }}>
                    No hay existencias registradas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                existencias.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{e.almacenNombre}</span>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                        {e.sucursalNombre}
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{e.insumoCodigo}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 600 }}>{e.insumoNombre}</span>
                        {e.esCritico && (
                          <span className="inv-badge inv-badge-critico">
                            <Sparkles size={11} /> Crítico
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{e.categoriaNombre}</td>
                    <td style={{ textAlign: "right", fontWeight: 700, fontSize: "0.95rem" }}>
                      {e.stockActual.toFixed(2)} {e.unidadMedidaCodigo}
                    </td>
                    <td style={{ textAlign: "right", color: "var(--color-text-muted, #6b7280)" }}>
                      {e.stockMinimo.toFixed(2)} {e.unidadMedidaCodigo}
                    </td>
                    <td style={{ textAlign: "right" }}>${e.costoPromedio.toFixed(2)}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      ${e.valorizado.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`inv-badge ${
                          e.estadoStock === "Normal"
                            ? "inv-badge-normal"
                            : e.estadoStock === "Bajo"
                            ? "inv-badge-bajo"
                            : e.estadoStock === "Agotado"
                            ? "inv-badge-agotado"
                            : "inv-badge-sobre"
                        }`}
                      >
                        {e.estadoStock}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenMovimiento(e.idInsumo, e.idAlmacen)}
                        leftIcon={<Plus size={14} />}
                      >
                        Ajustar / Merma
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Almacén */}
      <Modal
        open={isAlmacenModalOpen}
        onClose={() => setIsAlmacenModalOpen(false)}
        title="Crear Nuevo Almacén / Ubicación"
        size="md"
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", width: "100%" }}>
            <Button variant="secondary" onClick={() => setIsAlmacenModalOpen(false)} disabled={isCreatingAlmacen}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearAlmacen}
              disabled={isCreatingAlmacen}
              leftIcon={<Check size={16} />}
            >
              {isCreatingAlmacen ? "Guardando..." : "Crear Almacén"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCrearAlmacen} className="inv-form-grid">
          {sucursales.length > 0 && (
            <div className="inv-form-group full-width">
              <label className="inv-form-label">Sucursal Asignada *</label>
              <select
                className="inv-form-select"
                value={almacenSucursalId}
                onChange={(e) => setAlmacenSucursalId(Number(e.target.value))}
                required
              >
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} {s.codigo ? `(${s.codigo})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="inv-form-group">
            <label className="inv-form-label">Código</label>
            <input
              type="text"
              className="inv-form-input"
              placeholder="Ej. ALM-COC (Automático si vacío)"
              value={almacenCodigo}
              onChange={(e) => setAlmacenCodigo(e.target.value.toUpperCase())}
            />
          </div>

          <div className="inv-form-group">
            <label className="inv-form-label">Nombre del Almacén *</label>
            <input
              type="text"
              className="inv-form-input"
              placeholder="Ej. Barra de Bebidas y Coctelería"
              value={almacenNombre}
              onChange={(e) => setAlmacenNombre(e.target.value)}
              required
            />
          </div>

          <div className="inv-form-group">
            <label className="inv-form-label">Tipo de Almacén *</label>
            <select
              className="inv-form-select"
              value={almacenTipo}
              onChange={(e) => setAlmacenTipo(e.target.value)}
            >
              {tiposAlmacen.length > 0 ? (
                tiposAlmacen.map((t) => (
                  <option key={t.id} value={t.codigo}>
                    {t.descripcion}
                  </option>
                ))
              ) : (
                <>
                  <option value="GENERAL">General / Bodega Central</option>
                  <option value="COCINA">Cocina / Preparación</option>
                  <option value="BARRA">Barra / Coctelería</option>
                  <option value="PRODUCCION">Producción / Subrecetas</option>
                </>
              )}
            </select>
          </div>

          <div className="inv-form-group full-width">
            <label className="inv-form-switch">
              <input
                type="checkbox"
                checked={almacenEsPrincipal}
                onChange={(e) => setAlmacenEsPrincipal(e.target.checked)}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Almacén Principal de la Sucursal (Recepción por defecto de compras y proveedores)
              </span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};
