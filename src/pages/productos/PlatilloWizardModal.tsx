import React, { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  X,
  ChefHat,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../components/ui/toast";
import {
  useCrearPlatilloCompletoMutation,
  type CrearPlatilloCompletoResult,
  type PlatilloVarianteItem,
} from "../../services/platillosApi";
import "./platilloWizard.css";

interface PlatilloWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (result: CrearPlatilloCompletoResult, abrirRecipeStudio?: boolean) => void;
  categorias: Array<{ id: number; nombre: string }>;
  menus: Array<{ id: number; nombre: string }>;
  estaciones?: Array<{ id: number; nombre: string }>;
}

export const PlatilloWizardModal: React.FC<PlatilloWizardModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  categorias,
  menus,
  estaciones = [],
}) => {
  const { addToast } = useToast();
  const [crearPlatilloCompleto, { isLoading }] = useCrearPlatilloCompletoMutation();

  // Estados de formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigo, setCodigo] = useState("");
  const [idCategoria, setIdCategoria] = useState<number>(categorias[0]?.id || 1);
  const [idMenu, setIdMenu] = useState<number>(menus[0]?.id || 1);
  const [idEstacionCocina, setIdEstacionCocina] = useState<number | undefined>(undefined);

  // Precios y variantes
  const [tieneVariantes, setTieneVariantes] = useState(false);
  const [precioVenta, setPrecioVenta] = useState<number>(100);
  const [variantes, setVariantes] = useState<PlatilloVarianteItem[]>([
    { nombre: "Individual", codigo: "", precioVenta: 100, esDefault: true },
    { nombre: "Familiar", codigo: "", precioVenta: 180, esDefault: false },
  ]);

  // Sincronizar y reiniciar formulario al abrir
  useEffect(() => {
    if (isOpen) {
      setNombre("");
      setDescripcion("");
      setCodigo("");
      if (categorias.length > 0) {
        setIdCategoria(categorias[0].id);
      }
      if (menus.length > 0) {
        setIdMenu(menus[0].id);
      }
      setIdEstacionCocina(undefined);
      setTieneVariantes(false);
      setPrecioVenta(100);
      setVariantes([
        { nombre: "Individual", codigo: "", precioVenta: 100, esDefault: true },
        { nombre: "Familiar", codigo: "", precioVenta: 180, esDefault: false },
      ]);
    }
  }, [isOpen, categorias, menus]);

  if (!isOpen) return null;

  const handleAddVariante = () => {
    setVariantes((prev) => [
      ...prev,
      {
        nombre: `Presentación ${prev.length + 1}`,
        codigo: "",
        precioVenta: 100,
        esDefault: false,
      },
    ]);
  };

  const handleRemoveVariante = (index: number) => {
    if (variantes.length <= 1) {
      addToast({ message: "Debes tener al menos una variante configurada.", variant: "info" });
      return;
    }
    setVariantes((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (!next.some((v) => v.esDefault) && next.length > 0) {
        next[0].esDefault = true;
      }
      return next;
    });
  };

  const handleUpdateVariante = (index: number, patch: Partial<PlatilloVarianteItem>) => {
    setVariantes((prev) =>
      prev.map((v, i) => {
        if (i === index) {
          return { ...v, ...patch };
        }
        if (patch.esDefault) {
          return { ...v, esDefault: false };
        }
        return v;
      })
    );
  };

  const handleGuardar = async (abrirStudio: boolean = false) => {
    if (!nombre.trim()) {
      addToast({ message: "Ingresa el nombre del platillo.", variant: "error" });
      return;
    }
    if (!idCategoria) {
      addToast({ message: "Selecciona una categoría para el platillo.", variant: "error" });
      return;
    }

    const precioNum = Number(precioVenta);
    if (!tieneVariantes && (isNaN(precioNum) || precioNum <= 0)) {
      addToast({ message: "El precio de venta debe ser mayor a $0.00.", variant: "error" });
      return;
    }

    if (tieneVariantes) {
      const variantesInvalidas = variantes.some(
        (v) => !v.nombre.trim() || isNaN(v.precioVenta) || v.precioVenta <= 0
      );
      if (variantesInvalidas) {
        addToast({
          message: "Verifica que todas las variantes tengan nombre y un precio mayor a $0.00.",
          variant: "error",
        });
        return;
      }
    }

    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        codigo: codigo.trim() || undefined,
        idCategoria: Number(idCategoria),
        idMenu: Number(idMenu) || (menus[0]?.id ?? 1),
        idEstacionCocina: idEstacionCocina ? Number(idEstacionCocina) : undefined,
        tieneVariantes,
        precioVenta: !tieneVariantes ? (precioNum > 0 ? precioNum : 100) : undefined,
        variantes: tieneVariantes ? variantes : undefined,
      };

      const result = await crearPlatilloCompleto(payload).unwrap();
      addToast({
        message: `¡Platillo "${result.nombre}" registrado y listo para venderse en el POS!`,
        variant: "success",
      });

      // Limpiar y cerrar
      setNombre("");
      setDescripcion("");
      setCodigo("");
      setPrecioVenta(100);
      setTieneVariantes(false);

      onCreated?.(result, abrirStudio);
      onClose();
    } catch (err: any) {
      addToast({
        message: err?.data?.message || err?.message || "Error al crear el platillo.",
        variant: "error",
      });
    }
  };

  return (
    <div className="platillo-wizard__overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="platillo-wizard__modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="platillo-wizard__header">
          <div className="platillo-wizard__header-left">
            <div className="platillo-wizard__icon-badge">
              <UtensilsCrossed size={22} />
            </div>
            <div>
              <h2 className="platillo-wizard__title">Nuevo Platillo del Menú</h2>
              <p className="platillo-wizard__subtitle">
                Crea el platillo, sus precios y variantes en un solo paso. Queda listo para venderse en POS de inmediato.
              </p>
            </div>
          </div>
          <button type="button" className="platillo-wizard__close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </header>

        {/* Body */}
        <div className="platillo-wizard__body">
          {/* Información Básica */}
          <div className="platillo-wizard__field">
            <label htmlFor="pw-nombre">Nombre del Platillo *</label>
            <input
              id="pw-nombre"
              type="text"
              placeholder="ej. Parrillada Sonora Especial"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
          </div>

          <div className="platillo-wizard__grid-2">
            <div className="platillo-wizard__field">
              <label htmlFor="pw-categoria">Categoría del Menú *</label>
              <select
                id="pw-categoria"
                value={idCategoria}
                onChange={(e) => setIdCategoria(Number(e.target.value))}
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="platillo-wizard__field">
              <label htmlFor="pw-menu">Menú Perteneciente</label>
              <select
                id="pw-menu"
                value={idMenu}
                onChange={(e) => setIdMenu(Number(e.target.value))}
              >
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="platillo-wizard__grid-2">
            <div className="platillo-wizard__field">
              <label htmlFor="pw-estacion">Estación KDS / Cocina (Opcional)</label>
              <select
                id="pw-estacion"
                value={idEstacionCocina || ""}
                onChange={(e) => setIdEstacionCocina(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">-- Sin estación asignada --</option>
                {estaciones.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="platillo-wizard__field">
              <label htmlFor="pw-codigo">Código / SKU (Opcional)</label>
              <input
                id="pw-codigo"
                type="text"
                placeholder="ej. PLT-PARR-01"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              >
              </input>
            </div>
          </div>

          <div className="platillo-wizard__field">
            <label htmlFor="pw-desc">Descripción (Opcional)</label>
            <input
              id="pw-desc"
              type="text"
              placeholder="ej. Rib Eye y Arrachera marinada al carbón"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* Sección de Precio y Variantes */}
          <div className="platillo-wizard__price-box">
            <div className="platillo-wizard__price-header">
              <label className="platillo-wizard__switch-label">
                <input
                  type="checkbox"
                  className="platillo-wizard__switch-input"
                  checked={tieneVariantes}
                  onChange={(e) => setTieneVariantes(e.target.checked)}
                />
                <span>¿Tiene múltiples tamaños o variantes?</span>
              </label>

              {!tieneVariantes && (
                <div className="platillo-wizard__price-badge">
                  <CheckCircle2 size={14} />
                  <span>Variante "Estándar" autogenerada</span>
                </div>
              )}
            </div>

            {!tieneVariantes ? (
              <div className="platillo-wizard__field" style={{ marginTop: "0.25rem" }}>
                <label htmlFor="pw-pvp">Precio de Venta al Público (PVP) *</label>
                <div className="platillo-wizard__price-input-wrapper">
                  <span className="platillo-wizard__price-symbol">$</span>
                  <input
                    id="pw-pvp"
                    type="number"
                    step="0.5"
                    min="0"
                    className="platillo-wizard__price-input"
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <small style={{ color: "var(--color-text-muted, #64748b)", marginTop: "0.25rem" }}>
                  Este precio se registrará inmediatamente en el POS en moneda MXN con IVA 16% desglosable.
                </small>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text, #334155)" }}>
                    Lista de Presentaciones / Variantes
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    onClick={handleAddVariante}
                  >
                    Agregar Presentación
                  </Button>
                </div>

                <table className="platillo-wizard__variantes-table">
                  <thead>
                    <tr>
                      <th style={{ width: "45%" }}>Nombre Presentación</th>
                      <th style={{ width: "30%" }}>Precio ($ MXN)</th>
                      <th style={{ width: "15%", textAlign: "center" }}>Default</th>
                      <th style={{ width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantes.map((v, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            placeholder="ej. Individual"
                            value={v.nombre}
                            onChange={(e) => handleUpdateVariante(idx, { nombre: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={v.precioVenta}
                            onChange={(e) =>
                              handleUpdateVariante(idx, { precioVenta: parseFloat(e.target.value) || 0 })
                            }
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="radio"
                            name="variante-default"
                            checked={v.esDefault}
                            onChange={() => handleUpdateVariante(idx, { esDefault: true })}
                            style={{ cursor: "pointer", width: "auto" }}
                          />
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="platillo-wizard__close-btn"
                            onClick={() => handleRemoveVariante(idx)}
                            aria-label="Eliminar variante"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="platillo-wizard__footer">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>

          <div className="platillo-wizard__footer-actions">
            <Button
              type="button"
              variant="secondary"
              leftIcon={<ChefHat size={16} />}
              onClick={() => handleGuardar(true)}
              disabled={isLoading}
            >
              Guardar y Costear en Recipe Studio
            </Button>
            <Button
              type="button"
              variant="primary"
              leftIcon={<CheckCircle2 size={16} />}
              onClick={() => handleGuardar(false)}
              isLoading={isLoading}
            >
              Guardar Platillo
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};
