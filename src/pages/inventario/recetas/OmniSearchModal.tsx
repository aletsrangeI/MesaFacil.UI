import React, { useState, useMemo } from "react";
import { Search, Boxes, Layers, Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/button/Button";
import type { Insumo } from "../../../services/inventarioApi";
import type { SubRecetaSimple } from "../../../services/recetasApi";

interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  insumos: Insumo[];
  subRecetas: SubRecetaSimple[];
  onSelectInsumo: (insumo: Insumo) => void;
  onSelectSubReceta: (subReceta: SubRecetaSimple) => void;
}

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({
  isOpen,
  onClose,
  insumos,
  subRecetas,
  onSelectInsumo,
  onSelectSubReceta,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "insumos" | "subrecetas">("todos");

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const matchedInsumos = (filtroTipo === "todos" || filtroTipo === "insumos")
      ? insumos
          .filter((i) => !term || i.nombre.toLowerCase().includes(term) || i.codigo.toLowerCase().includes(term))
          .map((i) => ({
            type: "insumo" as const,
            id: i.id,
            nombre: i.nombre,
            codigo: i.codigo,
            categoria: i.categoriaNombre || "General",
            unidad: i.unidadMedidaCodigo,
            costo: i.costoPromedio,
            stock: i.stockTotalConsolidado,
            raw: i,
          }))
      : [];

    const matchedSubRecetas = (filtroTipo === "todos" || filtroTipo === "subrecetas")
      ? subRecetas
          .filter((s) => !term || s.nombre.toLowerCase().includes(term))
          .map((s) => ({
            type: "subreceta" as const,
            id: s.id,
            nombre: s.nombre,
            codigo: `SUB-${s.id.toString().padStart(3, "0")}`,
            categoria: "Mise en Place / Sub-receta",
            unidad: s.unidadMedidaCodigo,
            costo: s.costoEstimadoUnitario,
            stock: s.rendimiento,
            raw: s,
          }))
      : [];

    return [...matchedInsumos, ...matchedSubRecetas];
  }, [searchTerm, filtroTipo, insumos, subRecetas]);

  if (!isOpen) return null;

  return (
    <div className="omni-modal-overlay" onClick={onClose}>
      <div className="omni-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header con Buscador */}
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "1rem", color: "var(--color-text-muted, #6b7280)" }} />
          <input
            autoFocus
            type="text"
            className="omni-search-input"
            placeholder="Buscar insumo o sub-receta por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: "absolute",
              right: "0.75rem",
              background: "transparent",
              border: "none",
              color: "var(--color-text-muted, #6b7280)",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filtros Rápidos con Button component */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            padding: "0.6rem 1rem",
            background: "var(--color-surface-raised, #f4f6f8)",
            borderBottom: "1px solid var(--color-surface-sunken, #e5e7eb)",
          }}
        >
          <Button
            variant={filtroTipo === "todos" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFiltroTipo("todos")}
          >
            Todos ({insumos.length + subRecetas.length})
          </Button>

          <Button
            variant={filtroTipo === "insumos" ? "primary" : "secondary"}
            size="sm"
            leftIcon={<Boxes size={14} />}
            onClick={() => setFiltroTipo("insumos")}
          >
            Insumos ({insumos.length})
          </Button>

          <Button
            variant={filtroTipo === "subrecetas" ? "primary" : "secondary"}
            size="sm"
            leftIcon={<Layers size={14} />}
            onClick={() => setFiltroTipo("subrecetas")}
          >
            Sub-Recetas ({subRecetas.length})
          </Button>
        </div>

        {/* Lista de Resultados */}
        <div className="omni-results-list">
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--color-text-muted, #6b7280)",
                fontSize: "0.875rem",
              }}
            >
              No se encontraron coincidencias para "{searchTerm}".
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="omni-result-item"
                onClick={() => {
                  if (item.type === "insumo") {
                    onSelectInsumo(item.raw as Insumo);
                  } else {
                    onSelectSubReceta(item.raw as SubRecetaSimple);
                  }
                  onClose();
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 600, color: "var(--color-text, #1f1f1f)", fontSize: "0.9rem" }}>
                      {item.nombre}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "9999px",
                        backgroundColor:
                          item.type === "subreceta"
                            ? "rgba(124, 58, 237, 0.1)"
                            : "var(--color-surface-sunken, #e5e7eb)",
                        color:
                          item.type === "subreceta"
                            ? "#7c3aed"
                            : "var(--color-text-muted, #6b7280)",
                        fontWeight: 600,
                      }}
                    >
                      {item.categoria}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                    SKU: {item.codigo} • Unidad: {item.unidad}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-text, #1f1f1f)" }}>
                      ${item.costo.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted, #6b7280)" }}>
                      {item.type === "subreceta" ? "Costo unitario" : "Costo Promedio"}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === "insumo") {
                        onSelectInsumo(item.raw as Insumo);
                      } else {
                        onSelectSubReceta(item.raw as SubRecetaSimple);
                      }
                      onClose();
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
