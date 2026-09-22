import React, { useState } from "react";
import type { MenuOnboarding, ProductoOnboarding, EstacionCocinaOnboarding } from "../../../services/onboardingApi";
import Icon from "../../../components/ui/icons/Icon";
import { descargarPlantillaMenu } from "../../../services/importadorMenuApi";

interface Paso3MenuProps {
  menu: MenuOnboarding;
  estaciones: EstacionCocinaOnboarding[];
  onUpdateMenu: (menu: MenuOnboarding) => void;
}

const CATEGORIAS_SUGERIDAS = ["Entradas", "Platos Fuertes", "Bebidas", "Postres", "Especialidades", "Snacks"];

export const Paso3Menu: React.FC<Paso3MenuProps> = ({ menu, estaciones, onUpdateMenu }) => {
  const [nuevaCat, setNuevaCat] = useState("");
  const [tabModo, setTabModo] = useState<"inline" | "excel">("inline");
  const [mostrarModificadores, setMostrarModificadores] = useState(false);

  // Estados para nuevo modificador
  const [modProdNombre, setModProdNombre] = useState("");
  const [modGrupoNombre, setModGrupoNombre] = useState("");
  const [modOpcionNombre, setModOpcionNombre] = useState("");
  const [modPrecioExtra, setModPrecioExtra] = useState(0);

  const toggleCategoriaSugerida = (cat: string) => {
    const existe = menu.categorias.includes(cat);
    if (existe) {
      if (menu.categorias.length > 1) {
        onUpdateMenu({
          ...menu,
          categorias: menu.categorias.filter((c) => c !== cat),
        });
      }
    } else {
      onUpdateMenu({
        ...menu,
        categorias: [...menu.categorias, cat],
      });
    }
  };

  const agregarCategoriaPersonalizada = () => {
    if (!nuevaCat.trim()) return;
    if (!menu.categorias.includes(nuevaCat.trim())) {
      onUpdateMenu({
        ...menu,
        categorias: [...menu.categorias, nuevaCat.trim()],
      });
    }
    setNuevaCat("");
  };

  const agregarPlatilloVacio = () => {
    const categoriaDefault = menu.categorias[0] || "Platos Fuertes";
    const estacionDefault = estaciones[0]?.nombre || "Cocina Principal";
    onUpdateMenu({
      ...menu,
      productos: [
        ...menu.productos,
        {
          nombre: "",
          nombreCategoria: categoriaDefault,
          precio: 100,
          estacionCocina: estacionDefault,
        },
      ],
    });
  };

  const updateProducto = (index: number, campo: keyof ProductoOnboarding, valor: any) => {
    const copia = [...menu.productos];
    copia[index] = { ...copia[index], [campo]: valor };
    onUpdateMenu({ ...menu, productos: copia });
  };

  const eliminarProducto = (index: number) => {
    onUpdateMenu({
      ...menu,
      productos: menu.productos.filter((_, i) => i !== index),
    });
  };

  const agregarModificador = () => {
    if (!modProdNombre || !modGrupoNombre.trim() || !modOpcionNombre.trim()) return;

    const copiaGrupos = [...menu.gruposModificador];
    let grupo = copiaGrupos.find(
      (g) => g.nombreProducto === modProdNombre && g.nombreGrupo.toLowerCase() === modGrupoNombre.trim().toLowerCase()
    );

    if (!grupo) {
      grupo = {
        nombreProducto: modProdNombre,
        nombreGrupo: modGrupoNombre.trim(),
        obligatorio: false,
        minSeleccion: 0,
        maxSeleccion: 1,
        opciones: [],
      };
      copiaGrupos.push(grupo);
    }

    grupo.opciones.push({
      nombre: modOpcionNombre.trim(),
      precioExtra: modPrecioExtra,
      esDefault: grupo.opciones.length === 0,
    });

    onUpdateMenu({ ...menu, gruposModificador: copiaGrupos });
    setModOpcionNombre("");
    setModPrecioExtra(0);
  };

  const eliminarGrupoModificador = (index: number) => {
    onUpdateMenu({
      ...menu,
      gruposModificador: menu.gruposModificador.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="onboarding-step-header">
        <h3 className="onboarding-step-title">
          <Icon name="Utensils" /> Menú y Platillos
        </h3>
        <p className="onboarding-step-desc">
          Registra las categorías iniciales y agrega los platillos más vendidos para tener tu carta lista en el POS.
        </p>
      </div>

      {/* Categorías */}
      <div style={{ marginBottom: "1.75rem" }}>
        <label className="onboarding-label" style={{ marginBottom: "0.5rem", display: "block" }}>
          Categorías del Menú
        </label>
        <div className="onboarding-chips-row" style={{ marginBottom: "0.75rem" }}>
          {CATEGORIAS_SUGERIDAS.map((cat) => {
            const isSelected = menu.categorias.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                className={`onboarding-chip ${isSelected ? "selected" : ""}`}
                onClick={() => toggleCategoriaSugerida(cat)}
              >
                {isSelected ? <Icon name="Check" /> : <Icon name="Plus" />}
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", maxWidth: "380px" }}>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Otra categoría (ej. Coctelería)"
            value={nuevaCat}
            onChange={(e) => setNuevaCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarCategoriaPersonalizada())}
          />
          <button
            type="button"
            className="onboarding-btn-secondary"
            onClick={agregarCategoriaPersonalizada}
            disabled={!nuevaCat.trim()}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Selector de Modo */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <button
          type="button"
          className={`onboarding-btn-secondary ${tabModo === "inline" ? "selected" : ""}`}
          style={{ borderColor: tabModo === "inline" ? "#0284c7" : undefined, color: tabModo === "inline" ? "#38bdf8" : undefined }}
          onClick={() => setTabModo("inline")}
        >
          <Icon name="PlusCircle" /> Captura Rápida en Pantalla ({menu.productos.length} platillos)
        </button>
        <button
          type="button"
          className={`onboarding-btn-secondary ${tabModo === "excel" ? "selected" : ""}`}
          style={{ borderColor: tabModo === "excel" ? "#0284c7" : undefined, color: tabModo === "excel" ? "#38bdf8" : undefined }}
          onClick={() => setTabModo("excel")}
        >
          <Icon name="FileSpreadsheet" /> Tengo mi Menú en Excel
        </button>
      </div>

      {tabModo === "excel" ? (
        <div className="onboarding-summary-card" style={{ textAlign: "left", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#f8fafc", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Icon name="FileSpreadsheet" /> Carga Masiva Inteligente
          </h4>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1rem 0" }}>
            MesaFacil incluye un importador automático. Puedes descargar la plantilla oficial, llenarla con tus platillos y subirla después de completar el asistente en el módulo <strong>Menú ➔ Productos</strong>.
          </p>
          <button
            type="button"
            className="onboarding-btn-primary"
            onClick={() => descargarPlantillaMenu()}
          >
            <Icon name="Download" /> Descargar Plantilla Excel de Menú
          </button>
        </div>
      ) : (
        <div>
          <div className="onboarding-table-wrapper">
            <table className="onboarding-table">
              <thead>
                <tr>
                  <th>Nombre del Platillo o Bebida</th>
                  <th style={{ width: "170px" }}>Categoría</th>
                  <th style={{ width: "130px" }}>Precio ($ MXN)</th>
                  <th style={{ width: "180px" }}>Estación Cocina</th>
                  <th style={{ width: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {menu.productos.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
                      No has agregado platillos aún. Haz clic en el botón de abajo para registrar tus primeros productos estrella.
                    </td>
                  </tr>
                ) : (
                  menu.productos.map((prod, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="onboarding-input"
                          placeholder="Ej. Tacos de Ribeye"
                          value={prod.nombre}
                          onChange={(e) => updateProducto(idx, "nombre", e.target.value)}
                          style={{ padding: "0.4rem 0.6rem" }}
                        />
                      </td>
                      <td>
                        <select
                          className="onboarding-select"
                          value={prod.nombreCategoria}
                          onChange={(e) => updateProducto(idx, "nombreCategoria", e.target.value)}
                          style={{ padding: "0.4rem 0.6rem" }}
                        >
                          {menu.categorias.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          className="onboarding-input"
                          placeholder="0.00"
                          value={prod.precio}
                          onChange={(e) => updateProducto(idx, "precio", parseFloat(e.target.value) || 0)}
                          style={{ padding: "0.4rem 0.6rem" }}
                        />
                      </td>
                      <td>
                        <select
                          className="onboarding-select"
                          value={prod.estacionCocina || ""}
                          onChange={(e) => updateProducto(idx, "estacionCocina", e.target.value)}
                          style={{ padding: "0.4rem 0.6rem" }}
                        >
                          {estaciones.map((est) => (
                            <option key={est.nombre} value={est.nombre}>
                              {est.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => eliminarProducto(idx)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                        >
                          <Icon name="Trash2" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="onboarding-btn-secondary"
            onClick={agregarPlatilloVacio}
            style={{ marginBottom: "1.5rem" }}
          >
            <Icon name="Plus" /> Agregar Otro Platillo
          </button>
        </div>
      )}

      {/* Modificadores Opcionales */}
      <div style={{ borderTop: "1px solid #27354f", paddingTop: "1.25rem" }}>
        <button
          type="button"
          onClick={() => setMostrarModificadores(!mostrarModificadores)}
          style={{
            background: "none",
            border: "none",
            color: "#38bdf8",
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: 0,
            fontSize: "0.9375rem",
          }}
        >
          <Icon name={mostrarModificadores ? "ChevronUp" : "ChevronDown"} />
          {mostrarModificadores ? "Ocultar modificadores de receta" : "¿Deseas agregar opciones / modificadores? (Ej. Término de carne, Tipo de leche)"}
        </button>

        {mostrarModificadores && (
          <div style={{ marginTop: "1rem", background: "#0b1120", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #27354f" }}>
            <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: "0 0 1rem 0" }}>
              Asocia opciones de preparación a tus platillos para que los meseros puedan elegirlas desde la comanda:
            </p>

            {menu.productos.length === 0 ? (
              <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>Primero agrega al menos un platillo en la tabla superior.</p>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label className="onboarding-label" style={{ fontSize: "0.75rem" }}>Platillo</label>
                    <select
                      className="onboarding-select"
                      value={modProdNombre}
                      onChange={(e) => setModProdNombre(e.target.value)}
                    >
                      <option value="">Selecciona platillo...</option>
                      {menu.productos.filter((p) => p.nombre).map((p) => (
                        <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="onboarding-label" style={{ fontSize: "0.75rem" }}>Grupo (ej. Término de carne)</label>
                    <input
                      type="text"
                      className="onboarding-input"
                      placeholder="Nombre del grupo"
                      value={modGrupoNombre}
                      onChange={(e) => setModGrupoNombre(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="onboarding-label" style={{ fontSize: "0.75rem" }}>Opción (ej. Término Medio)</label>
                    <input
                      type="text"
                      className="onboarding-input"
                      placeholder="Nombre opción"
                      value={modOpcionNombre}
                      onChange={(e) => setModOpcionNombre(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="onboarding-label" style={{ fontSize: "0.75rem" }}>Precio Extra ($)</label>
                    <input
                      type="number"
                      min={0}
                      className="onboarding-input"
                      value={modPrecioExtra}
                      onChange={(e) => setModPrecioExtra(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="onboarding-btn-secondary"
                  onClick={agregarModificador}
                  disabled={!modProdNombre || !modGrupoNombre.trim() || !modOpcionNombre.trim()}
                  style={{ marginBottom: "1rem" }}
                >
                  <Icon name="Plus" /> Guardar Opción
                </button>

                {menu.gruposModificador.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {menu.gruposModificador.map((g, gIdx) => (
                      <div key={gIdx} style={{ background: "#131e36", padding: "0.6rem 0.85rem", borderRadius: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.875rem" }}>
                          <strong>{g.nombreProducto}</strong> ➔ <em>{g.nombreGrupo}</em>: {g.opciones.map((o) => `${o.nombre} (+$${o.precioExtra})`).join(", ")}
                        </span>
                        <button
                          type="button"
                          onClick={() => eliminarGrupoModificador(gIdx)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                        >
                          <Icon name="Trash2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
