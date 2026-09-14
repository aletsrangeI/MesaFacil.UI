import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

const NOTAS_RAPIDAS = ["Sin cebolla", "Salsa aparte", "Término medio", "Para llevar"];

/**
 * Bottom Sheet de Modificadores del Modo Comandero (spec 025).
 * Reimplementación visual (posicionado desde abajo, sin librería nueva) del mismo flujo de
 * src/pages/operacion/pos/ProductModifiersModal.tsx: grupos obligatorios/opcionales de
 * useGrupoModificadoresGetAllQuery/useOpcionModificadoresGetAllQuery + notas rápidas + texto libre.
 */
export function ComanderoModifierSheet({
  isOpen,
  product,
  grupos,
  opciones,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  product: any;
  grupos: any[];
  opciones: any[];
  onClose: () => void;
  onConfirm: (product: any, selectedVariant: any, selectedModifiers: any[], extraPrice: number, notas: string) => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedNotasRapidas, setSelectedNotasRapidas] = useState<string[]>([]);
  const [notasLibres, setNotasLibres] = useState("");

  useEffect(() => {
    if (isOpen && product) {
      const defaults = opciones
        .filter((o) => grupos.some((g) => g.id === o.idGrupo) && o.esDefault)
        .map((o) => o.id);
      setSelectedOptions(defaults);
      setSelectedNotasRapidas([]);
      setNotasLibres("");
      setSelectedVariant(product.variantes?.[0] ?? null);
    }
  }, [isOpen, product, grupos, opciones]);

  if (!isOpen || !product) return null;

  const toggleOption = (grupo: any, opcion: any) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.includes(opcion.id);
      const currentGroupSelections = prev.filter(
        (id) => opciones.find((o) => o.id === id)?.idGrupo === grupo.id
      );
      if (isSelected) return prev.filter((id) => id !== opcion.id);
      if (grupo.maxSeleccion > 0 && currentGroupSelections.length >= grupo.maxSeleccion) {
        if (grupo.maxSeleccion === 1) {
          return [...prev.filter((id) => !currentGroupSelections.includes(id)), opcion.id];
        }
        return prev;
      }
      return [...prev, opcion.id];
    });
  };

  const toggleNotaRapida = (nota: string) => {
    setSelectedNotasRapidas((prev) =>
      prev.includes(nota) ? prev.filter((n) => n !== nota) : [...prev, nota]
    );
  };

  const isValid = grupos.every((grupo) => {
    const selectedCount = selectedOptions.filter(
      (id) => opciones.find((o) => o.id === id)?.idGrupo === grupo.id
    ).length;
    if (grupo.obligatorio && selectedCount < (grupo.minSeleccion || 1)) return false;
    if (grupo.minSeleccion > 0 && selectedCount < grupo.minSeleccion) return false;
    return true;
  });

  const extraPrice = selectedOptions.reduce((acc, id) => {
    const opt = opciones.find((o) => o.id === id);
    return acc + (opt?.precioExtra || 0);
  }, 0);

  const handleConfirm = () => {
    const selectedMods = selectedOptions.map((id) => opciones.find((o) => o.id === id)).filter(Boolean);
    const notasCombinadas = [...selectedNotasRapidas, notasLibres.trim()].filter(Boolean).join(", ");
    onConfirm(product, selectedVariant, selectedMods, extraPrice, notasCombinadas);
  };

  const totalConExtra = (selectedVariant?.precio || 0) + extraPrice;

  return (
    <div className="comandero-sheet-overlay" onClick={onClose}>
      <div className="comandero-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="comandero-sheet-handle" />
        <div className="comandero-sheet-header">
          <div>
            <h2>{product.nombre}</h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            style={{
              minWidth: 44,
              minHeight: 44,
              border: "none",
              background: "var(--color-surface-raised)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="comandero-sheet-body">
          {product.variantes && product.variantes.length > 1 && (
            <div className="comandero-sheet-group">
              <div className="comandero-sheet-group-title">
                <span>Tamaño / Variante</span>
              </div>
              {product.variantes.map((variante: any) => {
                const isSelected = selectedVariant?.id === variante.id;
                return (
                  <div
                    key={variante.id}
                    className={`comandero-sheet-option ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setSelectedVariant(variante)}
                  >
                    {isSelected && <Check size={18} color="var(--color-primary)" />}
                    <div style={{ flex: 1 }}>{variante.nombre}</div>
                    <strong>${(variante.precio || 0).toFixed(2)}</strong>
                  </div>
                );
              })}
            </div>
          )}

          {grupos.map((grupo) => {
            const grupoOpciones = opciones.filter((o) => o.idGrupo === grupo.id && o.activo !== false);
            return (
              <div key={grupo.id} className="comandero-sheet-group">
                <div className="comandero-sheet-group-title">
                  <span>
                    {grupo.nombre}
                    {grupo.obligatorio && (
                      <span style={{ color: "var(--color-danger)", fontSize: "0.75rem", marginLeft: 6 }}>
                        * Obligatorio
                      </span>
                    )}
                  </span>
                </div>
                {grupoOpciones.map((opcion) => {
                  const isSelected = selectedOptions.includes(opcion.id);
                  return (
                    <div
                      key={opcion.id}
                      className={`comandero-sheet-option ${isSelected ? "is-selected" : ""}`}
                      onClick={() => toggleOption(grupo, opcion)}
                    >
                      {isSelected && <Check size={18} color="var(--color-primary)" />}
                      <div style={{ flex: 1 }}>{opcion.nombre}</div>
                      {opcion.precioExtra > 0 && <strong>+${opcion.precioExtra.toFixed(2)}</strong>}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="comandero-sheet-group">
            <div className="comandero-sheet-group-title">
              <span>Notas rápidas</span>
            </div>
            <div className="comandero-notas-chips">
              {NOTAS_RAPIDAS.map((nota) => (
                <button
                  key={nota}
                  type="button"
                  className={`comandero-nota-chip ${selectedNotasRapidas.includes(nota) ? "is-selected" : ""}`}
                  onClick={() => toggleNotaRapida(nota)}
                >
                  {nota}
                </button>
              ))}
            </div>
            <textarea
              className="comandero-notas-libre"
              placeholder="Otra instrucción para cocina..."
              value={notasLibres}
              onChange={(e) => setNotasLibres(e.target.value)}
            />
          </div>
        </div>

        <div className="comandero-sheet-footer">
          <button type="button" className="comandero-sheet-btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="comandero-sheet-btn-confirmar"
            disabled={!isValid || !selectedVariant}
            onClick={handleConfirm}
          >
            Agregar · ${totalConExtra.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
