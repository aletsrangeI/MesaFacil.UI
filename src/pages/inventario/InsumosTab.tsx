import React, { useState } from "react";
import { Button } from "../../components/ui/button/Button";
import { Modal } from "../../components/modal/Modal";
import { useToast } from "../../components/ui/toast";
import {
  useGetInsumosQuery,
  useCrearInsumoMutation,
  useActualizarInsumoMutation,
  useEliminarInsumoMutation,
  type Insumo,
  type UnidadMedida,
  type CategoriaInsumo,
  type Almacen,
} from "../../services/inventarioApi";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Sparkles,
  Check,
} from "lucide-react";

interface InsumosTabProps {
  unidades: UnidadMedida[];
  categorias: CategoriaInsumo[];
  almacenes: Almacen[];
  onOpenMovimiento: (insumoId: number) => void;
}

export const InsumosTab: React.FC<InsumosTabProps> = ({
  unidades,
  categorias,
  almacenes,
  onOpenMovimiento,
}) => {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [onlyCriticos, setOnlyCriticos] = useState(false);

  const { data: insumos = [], isLoading } = useGetInsumosQuery({
    idCategoria: selectedCategoria ? Number(selectedCategoria) : undefined,
    esCritico: onlyCriticos ? true : undefined,
    search: search ? search : undefined,
  });

  const [crearInsumo, { isLoading: isCreating }] = useCrearInsumoMutation();
  const [actualizarInsumo, { isLoading: isUpdating }] = useActualizarInsumoMutation();
  const [eliminarInsumo] = useEliminarInsumoMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);

  // Form states
  const [formCodigo, setFormCodigo] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formCategoria, setFormCategoria] = useState<number>(0);
  const [formUnidad, setFormUnidad] = useState<number>(0);
  const [formCostoInicial, setFormCostoInicial] = useState<string>("0");
  const [formStockMinimo, setFormStockMinimo] = useState<string>("5");
  const [formStockMaximo, setFormStockMaximo] = useState<string>("50");
  const [formEsCritico, setFormEsCritico] = useState(false);
  const [formAlmacenInicial, setFormAlmacenInicial] = useState<number>(0);
  const [formStockInicial, setFormStockInicial] = useState<string>("0");

  const openCreateModal = () => {
    setEditingInsumo(null);
    setFormCodigo("");
    setFormNombre("");
    setFormCategoria(categorias[0]?.id || 0);
    setFormUnidad(unidades[0]?.id || 0);
    setFormCostoInicial("0");
    setFormStockMinimo("5");
    setFormStockMaximo("50");
    setFormEsCritico(false);
    setFormAlmacenInicial(almacenes[0]?.id || 0);
    setFormStockInicial("0");
    setIsModalOpen(true);
  };

  const openEditModal = (insumo: Insumo) => {
    setEditingInsumo(insumo);
    setFormCodigo(insumo.codigo);
    setFormNombre(insumo.nombre);
    setFormCategoria(insumo.idCategoriaInsumo);
    setFormUnidad(insumo.idUnidadMedidaBase);
    setFormCostoInicial(insumo.costoPromedio.toString());
    setFormStockMinimo(insumo.stockMinimo.toString());
    setFormStockMaximo(insumo.stockMaximo.toString());
    setFormEsCritico(insumo.esCritico);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) {
      addToast({ message: "El nombre del insumo es obligatorio", variant: "error" });
      return;
    }

    try {
      if (editingInsumo) {
        await actualizarInsumo({
          id: editingInsumo.id,
          payload: {
            codigo: formCodigo,
            nombre: formNombre,
            idCategoriaInsumo: formCategoria,
            idUnidadMedidaBase: formUnidad,
            stockMinimo: parseFloat(formStockMinimo) || 0,
            stockMaximo: parseFloat(formStockMaximo) || 0,
            esCritico: formEsCritico,
            isActive: true,
          },
        }).unwrap();
        addToast({ message: "Insumo actualizado con éxito", variant: "success" });
      } else {
        await crearInsumo({
          codigo: formCodigo || undefined,
          nombre: formNombre,
          idCategoriaInsumo: formCategoria,
          idUnidadMedidaBase: formUnidad,
          costoInicial: parseFloat(formCostoInicial) || 0,
          stockMinimo: parseFloat(formStockMinimo) || 0,
          stockMaximo: parseFloat(formStockMaximo) || 0,
          esCritico: formEsCritico,
          idAlmacenInicial: formAlmacenInicial ? formAlmacenInicial : undefined,
          stockInicial: parseFloat(formStockInicial) || 0,
        }).unwrap();
        addToast({ message: "Insumo creado con éxito", variant: "success" });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al procesar el insumo",
        variant: "error",
      });
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Seguro que deseas desactivar el insumo "${nombre}"?`)) return;
    try {
      await eliminarInsumo(id).unwrap();
      addToast({ message: "Insumo desactivado correctamente", variant: "success" });
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al desactivar insumo",
        variant: "error",
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Barra de Filtros */}
      <div className="inv-filters-bar">
        <div className="inv-search-box">
          <Search size={18} color="var(--color-text-muted, #6b7280)" />
          <input
            type="text"
            className="inv-search-input"
            placeholder="Buscar por código o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="inv-filter-group">
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
            variant={onlyCriticos ? "primary" : "secondary"}
            size="sm"
            onClick={() => setOnlyCriticos(!onlyCriticos)}
            leftIcon={<Sparkles size={16} />}
          >
            {onlyCriticos ? "Mostrando Críticos" : "Solo Críticos"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<Plus size={16} />}
          >
            Nuevo Insumo
          </Button>
        </div>
      </div>

      {/* Tabla de Insumos */}
      <div className="inv-table-card">
        <div className="inv-table-wrapper">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Código / SKU</th>
                <th>Nombre del Insumo</th>
                <th>Categoría</th>
                <th>Unidad Base</th>
                <th style={{ textAlign: "right" }}>Costo Promedio</th>
                <th style={{ textAlign: "right" }}>Último Costo</th>
                <th style={{ textAlign: "right" }}>Stock Mín / Máx</th>
                <th style={{ textAlign: "right" }}>Stock Total</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "2.5rem" }}>
                    Cargando catálogo de materias primas...
                  </td>
                </tr>
              ) : insumos.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-text-muted, #6b7280)" }}>
                    No se encontraron insumos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                insumos.map((i) => {
                  const bajoStock = i.stockTotalConsolidado <= i.stockMinimo;
                  return (
                    <tr key={i.id}>
                      <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{i.codigo}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 600 }}>{i.nombre}</span>
                          {i.esCritico && (
                            <span className="inv-badge inv-badge-critico">
                              <Sparkles size={11} /> Crítico
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{i.categoriaNombre}</td>
                      <td>
                        <span className="inv-badge" style={{ background: "var(--color-surface-raised, #f4f6f8)" }}>
                          {i.unidadMedidaCodigo} ({i.unidadMedidaNombre})
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        ${i.costoPromedio.toFixed(2)} MXN
                      </td>
                      <td style={{ textAlign: "right", color: "var(--color-text-muted, #6b7280)" }}>
                        ${i.ultimoCosto.toFixed(2)}
                      </td>
                      <td style={{ textAlign: "right", fontSize: "0.825rem" }}>
                        {i.stockMinimo} / {i.stockMaximo > 0 ? i.stockMaximo : "∞"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span
                          className={`inv-badge ${
                            i.stockTotalConsolidado <= 0
                              ? "inv-badge-agotado"
                              : bajoStock
                              ? "inv-badge-bajo"
                              : "inv-badge-normal"
                          }`}
                        >
                          {i.stockTotalConsolidado.toFixed(2)} {i.unidadMedidaCodigo}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.35rem" }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Movimiento rápido"
                            onClick={() => onOpenMovimiento(i.id)}
                            iconOnly
                            leftIcon={<Package size={16} />}
                            aria-label="Movimiento rápido"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Editar insumo"
                            onClick={() => openEditModal(i)}
                            iconOnly
                            leftIcon={<Edit2 size={16} />}
                            aria-label="Editar"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Desactivar insumo"
                            onClick={() => handleDelete(i.id, i.nombre)}
                            iconOnly
                            leftIcon={<Trash2 size={16} color="var(--color-danger, #d64545)" />}
                            aria-label="Eliminar"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInsumo ? `Editar Insumo: ${editingInsumo.nombre}` : "Nuevo Insumo / Materia Prima"}
        size="md"
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", width: "100%" }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isCreating || isUpdating}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              leftIcon={<Check size={16} />}
            >
              {isCreating || isUpdating ? "Guardando..." : editingInsumo ? "Actualizar Insumo" : "Crear Insumo"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="inv-form-grid">
          <div className="inv-form-group">
            <label className="inv-form-label">Código / SKU</label>
            <input
              type="text"
              className="inv-form-input"
              placeholder="Ej. CAR-RES-01 (Automático si vacío)"
              value={formCodigo}
              onChange={(e) => setFormCodigo(e.target.value.toUpperCase())}
            />
          </div>

          <div className="inv-form-group">
            <label className="inv-form-label">Nombre del Insumo *</label>
            <input
              type="text"
              className="inv-form-input"
              placeholder="Ej. Carne molida de res 80/20"
              value={formNombre}
              onChange={(e) => setFormNombre(e.target.value)}
              required
            />
          </div>

          <div className="inv-form-group">
            <label className="inv-form-label">Categoría *</label>
            <select
              className="inv-form-select"
              value={formCategoria}
              onChange={(e) => setFormCategoria(Number(e.target.value))}
              required
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="inv-form-group">
            <label className="inv-form-label">Unidad de Medida Base *</label>
            <select
              className="inv-form-select"
              value={formUnidad}
              onChange={(e) => setFormUnidad(Number(e.target.value))}
              required
            >
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.codigo} - {u.nombre} ({u.tipo})
                </option>
              ))}
            </select>
          </div>

          {!editingInsumo && (
            <div className="inv-form-group">
              <label className="inv-form-label">Costo Inicial ($ MXN) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="inv-form-input"
                value={formCostoInicial}
                onChange={(e) => setFormCostoInicial(e.target.value)}
                required
              />
            </div>
          )}

          <div className="inv-form-group">
            <label className="inv-form-label">Stock Mínimo (Alerta de Reorden)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="inv-form-input"
              value={formStockMinimo}
              onChange={(e) => setFormStockMinimo(e.target.value)}
            />
          </div>

          <div className="inv-form-group">
            <label className="inv-form-label">Stock Máximo</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="inv-form-input"
              value={formStockMaximo}
              onChange={(e) => setFormStockMaximo(e.target.value)}
            />
          </div>

          <div className="inv-form-group full-width">
            <label className="inv-form-switch">
              <input
                type="checkbox"
                checked={formEsCritico}
                onChange={(e) => setFormEsCritico(e.target.checked)}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Insumo Crítico (Alto valor / Conteo diario obligatorio en auditorías)
              </span>
            </label>
          </div>

          {!editingInsumo && (
            <>
              <div className="inv-form-group">
                <label className="inv-form-label">Almacén para Carga Inicial</label>
                <select
                  className="inv-form-select"
                  value={formAlmacenInicial}
                  onChange={(e) => setFormAlmacenInicial(Number(e.target.value))}
                >
                  <option value={0}>Sin stock inicial</option>
                  {almacenes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} ({a.sucursalNombre})
                    </option>
                  ))}
                </select>
              </div>

              {formAlmacenInicial > 0 && (
                <div className="inv-form-group">
                  <label className="inv-form-label">Cantidad Inicial</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="inv-form-input"
                    value={formStockInicial}
                    onChange={(e) => setFormStockInicial(e.target.value)}
                  />
                </div>
              )}
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
