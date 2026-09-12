import React, { useState, useMemo } from "react";
import {
  ChefHat,
  Search,
  Layers,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "../../../components/ui/button/Button";
import {
  useGetRecetasQuery,
  useGetSubRecetasDisponiblesQuery,
  useEliminarRecetaMutation,
} from "../../../services/recetasApi";
import type { Receta } from "../../../services/recetasApi";
import type { Insumo, UnidadMedida } from "../../../services/inventarioApi";
import { RecipeStudioModal } from "./RecipeStudioModal";
import { useToast } from "../../../components/ui/toast";
import "./recetas.css";

interface RecetasTabProps {
  insumos: Insumo[];
  unidadesMedida: UnidadMedida[];
}

export const RecetasTab: React.FC<RecetasTabProps> = ({ insumos, unidadesMedida }) => {
  const { addToast } = useToast();

  const [subTab, setSubTab] = useState<"todos" | "platillos" | "subrecetas">("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Control Modal Recipe Studio
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);
  const [modoStudio, setModoStudio] = useState<"platillo" | "subreceta">("platillo");

  // Queries
  const { data: recetas = [], isLoading, refetch } = useGetRecetasQuery();
  const { data: subRecetas = [], refetch: refetchSubs } = useGetSubRecetasDisponiblesQuery();
  const [eliminarReceta] = useEliminarRecetaMutation();

  const handleOpenNuevoPlatillo = () => {
    setRecetaSeleccionada(null);
    setModoStudio("platillo");
    setIsStudioOpen(true);
  };

  const handleOpenNuevaSubReceta = () => {
    setRecetaSeleccionada(null);
    setModoStudio("subreceta");
    setIsStudioOpen(true);
  };

  const handleEditarReceta = (r: Receta) => {
    setRecetaSeleccionada(r);
    setModoStudio(r.esSubReceta ? "subreceta" : "platillo");
    setIsStudioOpen(true);
  };

  const handleEliminarReceta = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de desactivar la receta '${nombre}'?`)) return;

    try {
      await eliminarReceta(id).unwrap();
      addToast({ message: `Receta '${nombre}' desactivada.`, variant: "success" });
      refetch();
      refetchSubs();
    } catch (err: any) {
      addToast({
        message: `Error al eliminar: ${err?.data?.message || err?.message || "Error desconocido"}`,
        variant: "error",
      });
    }
  };

  const filteredRecetas = useMemo(() => {
    return recetas.filter((r) => {
      if (subTab === "platillos" && r.esSubReceta) return false;
      if (subTab === "subrecetas" && !r.esSubReceta) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchNombre = r.nombre.toLowerCase().includes(term);
        const matchProd = r.productoNombre?.toLowerCase().includes(term);
        const matchIng = r.detalles.some(
          (d) =>
            d.insumoNombre?.toLowerCase().includes(term) ||
            d.subRecetaNombre?.toLowerCase().includes(term)
        );
        if (!matchNombre && !matchProd && !matchIng) return false;
      }

      return true;
    });
  }, [recetas, subTab, searchTerm]);

  const totalPlatillos = useMemo(() => recetas.filter((r) => !r.esSubReceta).length, [recetas]);
  const totalSubRecetas = useMemo(() => recetas.filter((r) => r.esSubReceta).length, [recetas]);

  return (
    <div className="recetas-container">
      {/* Barra de Filtros y Acciones alineada con el sistema */}
      <div className="recetas-toolbar">
        <div className="recetas-filter-group">
          <Button
            variant={subTab === "todos" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSubTab("todos")}
          >
            Todas ({recetas.length})
          </Button>

          <Button
            variant={subTab === "platillos" ? "primary" : "secondary"}
            size="sm"
            leftIcon={<ChefHat size={14} />}
            onClick={() => setSubTab("platillos")}
          >
            Platillos de Carta ({totalPlatillos})
          </Button>

          <Button
            variant={subTab === "subrecetas" ? "primary" : "secondary"}
            size="sm"
            leftIcon={<Layers size={14} />}
            onClick={() => setSubTab("subrecetas")}
          >
            Sub-Recetas ({totalSubRecetas})
          </Button>
        </div>

        <div className="recetas-filter-group" style={{ flex: 1, justifyContent: "flex-end" }}>
          <div className="recetas-search-box">
            <Search size={16} color="var(--color-text-muted, #6b7280)" />
            <input
              type="text"
              className="recetas-search-input"
              placeholder="Buscar platillo, variante o insumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Layers size={15} />}
            onClick={handleOpenNuevaSubReceta}
          >
            + Sub-Receta
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<ChefHat size={15} />}
            onClick={handleOpenNuevoPlatillo}
          >
            Recipe Studio
          </Button>
        </div>
      </div>

      {/* Grid de Recetas */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted, #6b7280)" }}>
          Consultando recetas y escandallos...
        </div>
      ) : filteredRecetas.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "var(--color-surface, #ffffff)",
            borderRadius: "var(--radius, 12px)",
            border: "1px dashed var(--color-surface-sunken, #e5e7eb)",
          }}
        >
          <ChefHat size={44} color="var(--color-text-muted, #6b7280)" style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text, #1f1f1f)", margin: "0 0 0.5rem" }}>
            No hay recetas registradas
          </h3>
          <p style={{ color: "var(--color-text-muted, #6b7280)", fontSize: "0.875rem", maxWidth: 440, margin: "0 auto 1.5rem" }}>
            Arma digitalmente tus recetas en Recipe Studio para visualizar márgenes de utilidad
            y activar el descuento automático por comanda en POS.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Button variant="primary" leftIcon={<ChefHat size={16} />} onClick={handleOpenNuevoPlatillo}>
              Crear Primer Platillo
            </Button>
            <Button variant="secondary" leftIcon={<Layers size={16} />} onClick={handleOpenNuevaSubReceta}>
              Crear Sub-Receta Base
            </Button>
          </div>
        </div>
      ) : (
        <div className="recetas-grid">
          {filteredRecetas.map((r) => {
            const badgeClass = r.esSubReceta
              ? "subreceta"
              : r.nivelSaludMargen.toLowerCase();

            return (
              <div key={r.id} className="receta-card">
                {/* Header de la Tarjeta */}
                <div className="receta-card-header">
                  <div className="receta-card-title-group">
                    <h3 className="receta-card-title">{r.nombre}</h3>
                    <span className="receta-card-subtitle">
                      {r.esSubReceta ? (
                        `Rendimiento: ${r.rendimiento} ${r.unidadMedidaRendimientoCodigo || "PZA"}`
                      ) : (
                        r.productoNombre || "Platillo del Menú"
                      )}
                    </span>
                  </div>

                  <span className={`receta-badge ${badgeClass}`}>
                    {r.esSubReceta
                      ? "Mise en Place"
                      : r.nivelSaludMargen === "Optimo"
                      ? "Rentable (<30%)"
                      : r.nivelSaludMargen === "Ajustado"
                      ? "Margen Ajustado"
                      : "Alerta Costo"}
                  </span>
                </div>

                {/* Métricas Principales */}
                <div className="receta-card-metrics">
                  <div>
                    <div className="receta-card-metric-label">Costo Porción</div>
                    <div className="receta-card-metric-val">
                      ${r.costoEstimadoUnitario.toFixed(2)}
                    </div>
                  </div>

                  {!r.esSubReceta && (
                    <>
                      <div>
                        <div className="receta-card-metric-label">PVP Actual</div>
                        <div className="receta-card-metric-val" style={{ color: "var(--color-primary, #d64545)" }}>
                          ${(r.precioVentaActual || 0).toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <div className="receta-card-metric-label">Food Cost</div>
                        <div
                          className="receta-card-metric-val"
                          style={{
                            color:
                              r.nivelSaludMargen === "Optimo"
                                ? "var(--color-success, #3c8d40)"
                                : r.nivelSaludMargen === "Ajustado"
                                ? "#b45309"
                                : "var(--color-danger, #d64545)",
                          }}
                        >
                          {(r.foodCostPct || 0).toFixed(1)}%
                        </div>
                      </div>
                    </>
                  )}

                  {r.esSubReceta && (
                    <div style={{ gridColumn: "span 2" }}>
                      <div className="receta-card-metric-label">Costo Total Lote</div>
                      <div className="receta-card-metric-val" style={{ color: "#7c3aed" }}>
                        ${r.costoTotalLote.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumen de Ingredientes */}
                <div className="receta-card-ingredients-preview">
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted, #6b7280)" }}>
                    Ingredientes ({r.detalles.length}):
                  </div>
                  {r.detalles.slice(0, 3).map((d) => (
                    <div
                      key={d.id}
                      style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>
                        • {d.insumoNombre || d.subRecetaNombre} ({d.cantidad} {d.unidadMedidaCodigo})
                      </span>
                      <span style={{ fontWeight: 600, color: "var(--color-text, #1f1f1f)" }}>
                        ${(d.costoCalculado || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {r.detalles.length > 3 && (
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                      +{r.detalles.length - 3} ingredientes más...
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="receta-card-footer">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Edit3 size={14} />}
                    onClick={() => handleEditarReceta(r)}
                  >
                    Recipe Studio
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleEliminarReceta(r.id, r.nombre)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--color-text-muted, #6b7280)",
                      cursor: "pointer",
                      padding: "0.4rem",
                      borderRadius: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Desactivar receta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Recipe Studio */}
      <RecipeStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        recetaEditar={recetaSeleccionada}
        modoInicial={modoStudio}
        insumos={insumos}
        unidadesMedida={unidadesMedida}
        subRecetas={subRecetas}
        onSaved={() => {
          refetch();
          refetchSubs();
        }}
      />
    </div>
  );
};
