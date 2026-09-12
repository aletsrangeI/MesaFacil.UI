import React, { useState, useEffect, useMemo } from "react";
import {
  ChefHat,
  Plus,
  Trash2,
  Save,
  X,
  Boxes,
  Layers,
} from "lucide-react";
import { Button } from "../../../components/ui/button/Button";
import type { Insumo, UnidadMedida } from "../../../services/inventarioApi";
import {
  useSimularCosteoMutation,
  useCrearRecetaMutation,
  useActualizarRecetaMutation,
} from "../../../services/recetasApi";
import type {
  Receta,
  SubRecetaSimple,
  CrearRecetaPayload,
} from "../../../services/recetasApi";
import {
  useProductosGetAllQuery,
  useVarianteProductosGetAllQuery,
} from "../../../services/generated/api";
import { CostDonutChart } from "./CostDonutChart";
import { OmniSearchModal } from "./OmniSearchModal";
import { useToast } from "../../../components/ui/toast";

interface RecipeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  recetaEditar?: Receta | null;
  modoInicial?: "platillo" | "subreceta";
  insumos: Insumo[];
  unidadesMedida: UnidadMedida[];
  subRecetas: SubRecetaSimple[];
  onSaved?: () => void;
}

interface DetalleStudio {
  idTemporal: string;
  idInsumo?: number;
  idSubReceta?: number;
  nombre: string;
  tipo: "insumo" | "subreceta";
  cantidad: number;
  idUnidadMedida: number;
  unidadCodigo: string;
  unidadNombre: string;
  porcentajeMerma: number;
  costoUnitario: number;
  costoLinea: number;
}

export const RecipeStudioModal: React.FC<RecipeStudioModalProps> = ({
  isOpen,
  onClose,
  recetaEditar,
  modoInicial = "platillo",
  insumos,
  unidadesMedida,
  subRecetas,
  onSaved,
}) => {
  const { addToast } = useToast();

  // Queries para productos y variantes
  const { data: productosResp } = useProductosGetAllQuery();
  const { data: variantesResp } = useVarianteProductosGetAllQuery();

  const productos = useMemo(() => {
    return Array.isArray(productosResp?.data) ? productosResp.data : [];
  }, [productosResp]);

  const variantes = useMemo(() => {
    return Array.isArray(variantesResp?.data) ? variantesResp.data : [];
  }, [variantesResp]);

  // Estado general de la receta
  const [esSubReceta, setEsSubReceta] = useState<boolean>(modoInicial === "subreceta");
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [idProducto, setIdProducto] = useState<number | undefined>();
  const [idVariante, setIdVariante] = useState<number | undefined>();
  const [rendimiento, setRendimiento] = useState<number>(1);
  const [idUnidadRendimiento, setIdUnidadRendimiento] = useState<number>(
    unidadesMedida.find((u) => u.codigo === "PZA")?.id || (unidadesMedida[0]?.id ?? 1)
  );

  // Precio y Simulador
  const [precioVenta, setPrecioVenta] = useState<number>(100);
  const [margenObjetivo, setMargenObjetivo] = useState<number>(70);

  // Lista interactiva de ingredientes
  const [detalles, setDetalles] = useState<DetalleStudio[]>([]);

  // Control del modal Omni-Search
  const [isOmniOpen, setIsOmniOpen] = useState<boolean>(false);

  // API mutations
  const [simularCosteo, { data: simulacionData }] = useSimularCosteoMutation();
  const [crearReceta, { isLoading: isCreando }] = useCrearRecetaMutation();
  const [actualizarReceta, { isLoading: isActualizando }] = useActualizarRecetaMutation();

  // Cargar datos al abrir para editar
  useEffect(() => {
    if (recetaEditar) {
      setEsSubReceta(recetaEditar.esSubReceta);
      setNombre(recetaEditar.nombre);
      setDescripcion(recetaEditar.descripcion || "");
      setIdProducto(recetaEditar.idProducto);
      setIdVariante(recetaEditar.idVariante);
      setRendimiento(recetaEditar.rendimiento || 1);
      setIdUnidadRendimiento(recetaEditar.idUnidadMedidaRendimiento);
      if (recetaEditar.precioVentaActual && recetaEditar.precioVentaActual > 0) {
        setPrecioVenta(recetaEditar.precioVentaActual);
      }

      const mapped: DetalleStudio[] = recetaEditar.detalles.map((d, index) => {
        const esSub = !!d.idSubReceta;
        return {
          idTemporal: `item-${d.id || index}-${Date.now()}`,
          idInsumo: d.idInsumo,
          idSubReceta: d.idSubReceta,
          nombre: esSub ? (d.subRecetaNombre || "Sub-receta") : (d.insumoNombre || "Insumo"),
          tipo: esSub ? "subreceta" : "insumo",
          cantidad: d.cantidad,
          idUnidadMedida: d.idUnidadMedida,
          unidadCodigo: d.unidadMedidaCodigo || "PZA",
          unidadNombre: d.unidadMedidaNombre || "Pieza",
          porcentajeMerma: d.porcentajeMermaEsperada,
          costoUnitario: d.costoUnitarioInsumo || 0,
          costoLinea: d.costoCalculado || 0,
        };
      });
      setDetalles(mapped);
    } else {
      setEsSubReceta(modoInicial === "subreceta");
      setNombre("");
      setDescripcion("");
      setIdProducto(undefined);
      setIdVariante(undefined);
      setRendimiento(modoInicial === "subreceta" ? 1000 : 1);
      const defaultUm = modoInicial === "subreceta"
        ? (unidadesMedida.find((u) => u.codigo === "ML" || u.codigo === "G")?.id || unidadesMedida[0]?.id || 1)
        : (unidadesMedida.find((u) => u.codigo === "PZA")?.id || unidadesMedida[0]?.id || 1);
      setIdUnidadRendimiento(defaultUm);
      setPrecioVenta(120);
      setMargenObjetivo(70);
      setDetalles([]);
    }
  }, [recetaEditar, modoInicial, isOpen, unidadesMedida]);

  const variantesFiltradas = useMemo(() => {
    if (!idProducto) return [];
    return variantes.filter((v: any) => v.idProducto === idProducto);
  }, [idProducto, variantes]);

  const handleProductoChange = (prodId: number) => {
    setIdProducto(prodId);
    const p = productos.find((x: any) => x.id === prodId);
    if (p && !nombre) {
      setNombre(`Receta ${p.nombre}`);
    }
    const vars = variantes.filter((v: any) => v.idProducto === prodId);
    if (vars.length > 0) {
      setIdVariante(vars[0].id);
    } else {
      setIdVariante(undefined);
    }
  };

  // Debounce para simular costeo evitando cascada de renders y spam de red
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const payload = {
        rendimiento: rendimiento > 0 ? rendimiento : 1,
        idUnidadMedidaRendimiento: idUnidadRendimiento,
        precioVenta: precioVenta > 0 ? precioVenta : undefined,
        margenObjetivoPct: margenObjetivo,
        detalles: detalles.map((d) => ({
          idInsumo: d.idInsumo,
          idSubReceta: d.idSubReceta,
          cantidad: d.cantidad,
          idUnidadMedida: d.idUnidadMedida,
          porcentajeMermaEsperada: d.porcentajeMerma,
        })),
      };

      simularCosteo(payload);
    }, 200);

    return () => clearTimeout(timer);
  }, [detalles, rendimiento, idUnidadRendimiento, precioVenta, margenObjetivo, isOpen, simularCosteo]);

  const handleSelectInsumo = (insumo: Insumo) => {
    const um = unidadesMedida.find((u) => u.id === insumo.idUnidadMedidaBase) || unidadesMedida[0];
    const nuevo: DetalleStudio = {
      idTemporal: `ins-${insumo.id}-${Date.now()}`,
      idInsumo: insumo.id,
      nombre: insumo.nombre,
      tipo: "insumo",
      cantidad: um?.codigo === "KG" ? 0.18 : 1,
      idUnidadMedida: um?.id || 1,
      unidadCodigo: um?.codigo || "PZA",
      unidadNombre: um?.nombre || "Pieza",
      porcentajeMerma: 0,
      costoUnitario: insumo.costoPromedio,
      costoLinea: 0,
    };
    setDetalles((prev) => [...prev, nuevo]);
  };

  const handleSelectSubReceta = (sub: SubRecetaSimple) => {
    const um = unidadesMedida.find((u) => u.id === sub.idUnidadMedidaRendimiento) || unidadesMedida[0];
    const nuevo: DetalleStudio = {
      idTemporal: `sub-${sub.id}-${Date.now()}`,
      idSubReceta: sub.id,
      nombre: `[Sub-receta] ${sub.nombre}`,
      tipo: "subreceta",
      cantidad: 1,
      idUnidadMedida: um?.id || 1,
      unidadCodigo: um?.codigo || "PZA",
      unidadNombre: um?.nombre || "Pieza",
      porcentajeMerma: 0,
      costoUnitario: sub.costoEstimadoUnitario,
      costoLinea: 0,
    };
    setDetalles((prev) => [...prev, nuevo]);
  };

  const handleUpdateDetalle = (idTemporal: string, patch: Partial<DetalleStudio>) => {
    setDetalles((prev) =>
      prev.map((item) => {
        if (item.idTemporal === idTemporal) {
          const updated = { ...item, ...patch };
          if (patch.idUnidadMedida) {
            const um = unidadesMedida.find((u) => u.id === patch.idUnidadMedida);
            if (um) {
              updated.unidadCodigo = um.codigo;
              updated.unidadNombre = um.nombre;
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveDetalle = (idTemporal: string) => {
    setDetalles((prev) => prev.filter((d) => d.idTemporal !== idTemporal));
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      addToast({ message: "Ingresa el nombre de la receta.", variant: "error" });
      return;
    }
    if (detalles.length === 0) {
      addToast({ message: "Debes agregar al menos un ingrediente.", variant: "error" });
      return;
    }

    const payload: CrearRecetaPayload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      esSubReceta,
      idProducto: esSubReceta ? undefined : idProducto,
      idVariante: esSubReceta ? undefined : idVariante,
      rendimiento: rendimiento > 0 ? rendimiento : 1,
      idUnidadMedidaRendimiento: idUnidadRendimiento,
      detalles: detalles.map((d) => ({
        idInsumo: d.idInsumo,
        idSubReceta: d.idSubReceta,
        cantidad: d.cantidad,
        idUnidadMedida: d.idUnidadMedida,
        porcentajeMermaEsperada: d.porcentajeMerma,
      })),
    };

    try {
      if (recetaEditar) {
        await actualizarReceta({
          id: recetaEditar.id,
          payload: { ...payload, isActive: true },
        }).unwrap();
        addToast({ message: "Receta actualizada exitosamente en Recipe Studio.", variant: "success" });
      } else {
        await crearReceta(payload).unwrap();
        addToast({ message: "Receta creada y activada exitosamente.", variant: "success" });
      }
      onSaved?.();
      onClose();
    } catch (err: any) {
      addToast({
        message: `Error al guardar receta: ${err?.data?.message || err?.message || "Error desconocido"}`,
        variant: "error",
      });
    }
  };

  const donutSegments = useMemo(() => {
    if (simulacionData && simulacionData.desglose && simulacionData.desglose.length > 0) {
      return simulacionData.desglose.map((item, idx) => ({
        id: `${item.idInsumo || item.idSubReceta || idx}`,
        label: item.nombre,
        value: item.costoTotal,
        percentage: item.participacionCostoPct,
        color: "",
      }));
    }

    // Fallback estimativo inmediato para evitar parpadeo en blanco mientras responde la simulación
    if (detalles.length === 0) return [];
    const localTotal = detalles.reduce((acc, d) => acc + (d.cantidad * d.costoUnitario), 0);
    return detalles.map((d, idx) => {
      const val = d.cantidad * d.costoUnitario;
      const pct = localTotal > 0 ? Math.round((val / localTotal) * 100) : 0;
      return {
        id: d.idTemporal || `${d.idInsumo || d.idSubReceta || idx}`,
        label: d.nombre,
        value: val,
        percentage: pct,
        color: "",
      };
    });
  }, [simulacionData, detalles]);

  if (!isOpen) return null;

  const costoPorcion = simulacionData?.costoPorcion ?? 0;
  const foodCostPct = simulacionData?.foodCostPct ?? 0;
  const margenBrutoMonto = simulacionData?.margenBrutoMonto ?? (precioVenta - costoPorcion);
  const margenBrutoPct = simulacionData?.margenBrutoPct ?? 0;
  const nivelSalud = simulacionData?.nivelSaludMargen ?? "Optimo";
  const pvpSugerido = simulacionData?.precioVentaCalculado ?? precioVenta;
  const pvpConIva = simulacionData?.precioVentaConIva ?? Math.round(pvpSugerido * 1.16);

  return (
    <div className="studio-overlay" onClick={onClose}>
      <div className="studio-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header con estilo institucional MesaFacil */}
        <div className="studio-header">
          <div className="studio-header-title">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "0.5rem",
                backgroundColor: "rgba(214, 69, 69, 0.12)",
                color: "var(--color-primary, #d64545)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChefHat size={22} />
            </div>
            <div>
              <h2>{recetaEditar ? `Editar Escandallo: ${recetaEditar.nombre}` : "Recipe Studio: Diseñador de Receta"}</h2>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.15rem" }}>
                <span className="studio-header-tag">
                  {esSubReceta ? "Mise en Place / Sub-receta" : "Platillo Maestro"}
                </span>
                <span style={{ fontSize: "0.775rem", color: "var(--color-text-muted, #6b7280)" }}>
                  Live Costing & Simulador de Margen
                </span>
              </div>
            </div>
          </div>
          <button type="button" className="studio-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo Principal Dividido */}
        <div className="studio-body">
          {/* Panel Izquierdo: Configuración e Ingredientes */}
          <div className="studio-main-panel">
            {/* Selector de Tipo (Platillo vs Subreceta) con Button Component */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", paddingBottom: "0.25rem" }}>
              <Button
                variant={!esSubReceta ? "primary" : "secondary"}
                size="sm"
                leftIcon={<ChefHat size={14} />}
                onClick={() => setEsSubReceta(false)}
              >
                Receta de Platillo (Menú)
              </Button>
              <Button
                variant={esSubReceta ? "primary" : "secondary"}
                size="sm"
                leftIcon={<Layers size={14} />}
                onClick={() => setEsSubReceta(true)}
              >
                Sub-Receta / Base (Mise en Place)
              </Button>
            </div>

            {/* Formulario Principal */}
            <div className="studio-form-grid">
              <div className="studio-field" style={{ gridColumn: "span 2" }}>
                <label>Nombre de la Receta *</label>
                <input
                  type="text"
                  className="studio-input"
                  placeholder={esSubReceta ? "Ej. Salsa Secreta Chipotle 4L" : "Ej. Hamburguesa Clásica con Queso"}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {!esSubReceta && (
                <>
                  <div className="studio-field">
                    <label>Producto del Menú</label>
                    <select
                      className="studio-select"
                      value={idProducto || ""}
                      onChange={(e) => handleProductoChange(Number(e.target.value))}
                    >
                      <option value="">-- Seleccionar Platillo --</option>
                      {productos.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="studio-field">
                    <label>Variante Específica</label>
                    <select
                      className="studio-select"
                      value={idVariante || ""}
                      onChange={(e) => setIdVariante(e.target.value ? Number(e.target.value) : undefined)}
                    >
                      <option value="">Aplica a todas las variantes</option>
                      {variantesFiltradas.map((v: any) => (
                        <option key={v.id} value={v.id}>
                          {v.nombre || "Estándar"}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="studio-field">
                <label>Rendimiento del Lote *</label>
                <input
                  type="number"
                  step="0.01"
                  className="studio-input"
                  value={rendimiento}
                  onChange={(e) => setRendimiento(Math.max(0.01, parseFloat(e.target.value) || 1))}
                />
              </div>

              <div className="studio-field">
                <label>Unidad de Rendimiento</label>
                <select
                  className="studio-select"
                  value={idUnidadRendimiento}
                  onChange={(e) => setIdUnidadRendimiento(Number(e.target.value))}
                >
                  {unidadesMedida.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} ({u.codigo})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de Ingredientes */}
            <div className="studio-ingredients-section">
              <div className="studio-ingredients-header">
                <h3>
                  <Boxes size={18} color="var(--color-primary, #d64545)" /> Ingredientes & Escandallo ({detalles.length})
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus size={15} />}
                  onClick={() => setIsOmniOpen(true)}
                >
                  Agregar Ingrediente
                </Button>
              </div>

              <div className="studio-table-wrap">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>Ingrediente</th>
                      <th style={{ width: "20%" }}>Cantidad</th>
                      <th style={{ width: "20%" }}>Unidad</th>
                      <th style={{ width: "12%" }}>Merma %</th>
                      <th style={{ width: "13%", textAlign: "right" }}>Costo</th>
                      <th style={{ width: "40px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-text-muted, #6b7280)" }}>
                          No hay ingredientes agregados. Haz clic en "Agregar Ingrediente" para comenzar el escandallo.
                        </td>
                      </tr>
                    ) : (
                      detalles.map((d, idx) => (
                        <tr key={d.idTemporal}>
                          <td>
                            <div style={{ fontWeight: 600, color: "var(--color-text, #1f1f1f)" }}>{d.nombre}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                              {d.tipo === "subreceta" ? "Mise en place" : "Materia prima"} • Unit: ${d.costoUnitario.toFixed(2)}
                            </div>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="any"
                              className="studio-qty-input"
                              value={d.cantidad}
                              onChange={(e) =>
                                handleUpdateDetalle(d.idTemporal, {
                                  cantidad: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </td>
                          <td>
                            <select
                              className="studio-um-select"
                              value={d.idUnidadMedida}
                              onChange={(e) =>
                                handleUpdateDetalle(d.idTemporal, {
                                  idUnidadMedida: Number(e.target.value),
                                })
                              }
                            >
                              {unidadesMedida.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.codigo} - {u.nombre}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max="100"
                              className="studio-qty-input"
                              style={{ width: "60px" }}
                              value={d.porcentajeMerma}
                              onChange={(e) =>
                                handleUpdateDetalle(d.idTemporal, {
                                  porcentajeMerma: Math.max(0, parseFloat(e.target.value) || 0),
                                })
                              }
                            />
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "var(--color-text, #1f1f1f)" }}>
                            ${(simulacionData?.desglose?.[idx]?.costoTotal ?? d.costoLinea ?? 0).toFixed(2)}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="studio-remove-btn"
                              title="Remover ingrediente"
                              onClick={() => handleRemoveDetalle(d.idTemporal)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel Derecho: Gauges Financieros, Donut Chart y Simulador */}
          <div className="studio-side-panel">
            {/* Gauges Financieros */}
            <div className="studio-gauges-grid">
              <div className="studio-gauge-card">
                <div className="studio-gauge-label">Costo por Porción</div>
                <div className="studio-gauge-val">
                  ${costoPorcion.toFixed(2)}
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted, #6b7280)" }}>
                  Lote: ${(simulacionData?.costoTotalLote || 0).toFixed(2)}
                </span>
              </div>

              <div className="studio-gauge-card">
                <div className="studio-gauge-label">Food Cost %</div>
                <div
                  className="studio-gauge-val"
                  style={{
                    color:
                      nivelSalud === "Optimo"
                        ? "var(--color-success, #3c8d40)"
                        : nivelSalud === "Ajustado"
                        ? "#b45309"
                        : "var(--color-danger, #d64545)",
                  }}
                >
                  {foodCostPct.toFixed(1)}%
                </div>
                <span
                  className={`receta-badge ${nivelSalud.toLowerCase()}`}
                  style={{ alignSelf: "flex-start", marginTop: "0.2rem" }}
                >
                  {nivelSalud === "Optimo" ? "Rentable (<30%)" : nivelSalud === "Ajustado" ? "Ajustado (30-38%)" : "Alerta (>38%)"}
                </span>
              </div>

              {!esSubReceta && (
                <>
                  <div className="studio-gauge-card">
                    <div className="studio-gauge-label">PVP Actual</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #6b7280)" }}>$</span>
                      <input
                        type="number"
                        className="studio-input"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "1rem", fontWeight: 700, width: "100%", height: "36px" }}
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                    </div>
                  </div>

                  <div className="studio-gauge-card">
                    <div className="studio-gauge-label">Margen Bruto</div>
                    <div className="studio-gauge-val" style={{ color: "var(--color-success, #3c8d40)" }}>
                      ${margenBrutoMonto.toFixed(2)}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-success, #3c8d40)", fontWeight: 600 }}>
                      {margenBrutoPct.toFixed(1)}% margen
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Donut Chart Reactivo */}
            <CostDonutChart
              segments={donutSegments}
              totalCost={
                simulacionData?.costoTotalLote ??
                detalles.reduce((acc, d) => acc + d.cantidad * d.costoUnitario, 0)
              }
            />

            {/* Simulador de Precios (Solo para Platillos Maestros) */}
            {!esSubReceta && (
              <div className="studio-slider-box">
                <div className="studio-slider-header">
                  <h4>Simulador de Margen</h4>
                  <span>{margenObjetivo}% Margen</span>
                </div>

                <input
                  type="range"
                  min="40"
                  max="85"
                  step="1"
                  className="studio-slider"
                  value={margenObjetivo}
                  onChange={(e) => setMargenObjetivo(Number(e.target.value))}
                />

                <div className="studio-slider-results">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>PVP Recomendado:</span>
                    <strong style={{ color: "var(--color-text, #1f1f1f)" }}>${pvpSugerido.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>PVP Público (16% IVA):</span>
                    <strong style={{ color: "var(--color-success, #3c8d40)" }}>${pvpConIva.toFixed(2)}</strong>
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => setPrecioVenta(pvpSugerido)}
                    >
                      Fijar PVP Actual a ${pvpSugerido.toFixed(2)}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="studio-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            disabled={isCreando || isActualizando}
            leftIcon={<Save size={16} />}
            onClick={handleGuardar}
          >
            {isCreando || isActualizando ? "Guardando..." : "Guardar & Activar Receta"}
          </Button>
        </div>
      </div>

      {/* Omni-Search Modal Popover */}
      <OmniSearchModal
        isOpen={isOmniOpen}
        onClose={() => setIsOmniOpen(false)}
        insumos={insumos}
        subRecetas={subRecetas}
        onSelectInsumo={handleSelectInsumo}
        onSelectSubReceta={handleSelectSubReceta}
      />
    </div>
  );
};
