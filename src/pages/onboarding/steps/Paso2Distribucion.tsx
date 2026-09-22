import React, { useState } from "react";
import type { AreaYMesasOnboarding, EstacionCocinaOnboarding } from "../../../services/onboardingApi";
import Icon from "../../../components/ui/icons/Icon";

interface Paso2DistribucionProps {
  areas: AreaYMesasOnboarding[];
  estaciones: EstacionCocinaOnboarding[];
  onUpdateAreas: (areas: AreaYMesasOnboarding[]) => void;
  onUpdateEstaciones: (estaciones: EstacionCocinaOnboarding[]) => void;
}

const AREAS_SUGERIDAS = [
  { nombre: "Salón Principal", prefijo: "M" },
  { nombre: "Terraza", prefijo: "T" },
  { nombre: "Barra & Lounge", prefijo: "B" },
  { nombre: "Jardín Exterior", prefijo: "J" },
  { nombre: "Privado VIP", prefijo: "VIP" },
];

const ESTACIONES_SUGERIDAS = [
  { nombre: "Cocina Caliente & Fría", ambar: 8, rojo: 15 },
  { nombre: "Barra & Bebidas", ambar: 4, rojo: 8 },
  { nombre: "Parrilla & Brasas", ambar: 10, rojo: 18 },
  { nombre: "Horno de Pizzas", ambar: 12, rojo: 20 },
  { nombre: "Cocina Fría / Ensaladas", ambar: 6, rojo: 10 },
];

export const Paso2Distribucion: React.FC<Paso2DistribucionProps> = ({
  areas,
  estaciones,
  onUpdateAreas,
  onUpdateEstaciones,
}) => {
  const [nuevaAreaNombre, setNuevaAreaNombre] = useState("");
  const [nuevaEstacionNombre, setNuevaEstacionNombre] = useState("");

  const toggleAreaSugerida = (sug: { nombre: string; prefijo: string }) => {
    const existe = areas.find((a) => a.nombreArea.toLowerCase() === sug.nombre.toLowerCase());
    if (existe) {
      if (areas.length > 1) {
        onUpdateAreas(areas.filter((a) => a.nombreArea.toLowerCase() !== sug.nombre.toLowerCase()));
      }
    } else {
      onUpdateAreas([
        ...areas,
        {
          nombreArea: sug.nombre,
          orden: areas.length + 1,
          prefijoMesa: sug.prefijo,
          cantidadMesas: 6,
          asientosPorMesa: 4,
        },
      ]);
    }
  };

  const agregarAreaPersonalizada = () => {
    if (!nuevaAreaNombre.trim()) return;
    const prefijo = nuevaAreaNombre.trim().slice(0, 2).toUpperCase();
    onUpdateAreas([
      ...areas,
      {
        nombreArea: nuevaAreaNombre.trim(),
        orden: areas.length + 1,
        prefijoMesa: prefijo,
        cantidadMesas: 6,
        asientosPorMesa: 4,
      },
    ]);
    setNuevaAreaNombre("");
  };

  const eliminarArea = (index: number) => {
    if (areas.length <= 1) return;
    onUpdateAreas(areas.filter((_, i) => i !== index));
  };

  const updateArea = (index: number, campo: keyof AreaYMesasOnboarding, valor: any) => {
    const copia = [...areas];
    copia[index] = { ...copia[index], [campo]: valor };
    onUpdateAreas(copia);
  };

  const toggleEstacionSugerida = (sug: { nombre: string; ambar: number; rojo: number }) => {
    const existe = estaciones.find((e) => e.nombre.toLowerCase() === sug.nombre.toLowerCase());
    if (existe) {
      if (estaciones.length > 1) {
        onUpdateEstaciones(estaciones.filter((e) => e.nombre.toLowerCase() !== sug.nombre.toLowerCase()));
      }
    } else {
      onUpdateEstaciones([
        ...estaciones,
        {
          nombre: sug.nombre,
          minutosAmbar: sug.ambar,
          minutosRojo: sug.rojo,
        },
      ]);
    }
  };

  const agregarEstacionPersonalizada = () => {
    if (!nuevaEstacionNombre.trim()) return;
    onUpdateEstaciones([
      ...estaciones,
      {
        nombre: nuevaEstacionNombre.trim(),
        minutosAmbar: 7,
        minutosRojo: 12,
      },
    ]);
    setNuevaEstacionNombre("");
  };

  return (
    <div>
      <div className="onboarding-step-header">
        <h3 className="onboarding-step-title">
          <Icon name="Grid" /> Salón, Mesas y Cocina
        </h3>
        <p className="onboarding-step-desc">
          Organiza las zonas físicas del restaurante, la cantidad de mesas y los destinos de comanda en cocina.
        </p>
      </div>

      {/* Sección Áreas */}
      <div style={{ marginBottom: "2rem" }}>
        <label className="onboarding-label" style={{ marginBottom: "0.5rem", display: "block" }}>
          Zonas de Comedor (Áreas)
        </label>
        <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
          Selecciona las zonas que tiene tu restaurante para generar tus mesas automáticamente:
        </p>

        <div className="onboarding-chips-row" style={{ marginBottom: "1rem" }}>
          {AREAS_SUGERIDAS.map((sug) => {
            const isSelected = areas.some((a) => a.nombreArea.toLowerCase() === sug.nombre.toLowerCase());
            return (
              <button
                key={sug.nombre}
                type="button"
                className={`onboarding-chip ${isSelected ? "selected" : ""}`}
                onClick={() => toggleAreaSugerida(sug)}
              >
                {isSelected ? <Icon name="Check" /> : <Icon name="Plus" />}
                {sug.nombre}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", maxWidth: "400px" }}>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Otra zona (ej. Terraza Alta)"
            value={nuevaAreaNombre}
            onChange={(e) => setNuevaAreaNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarAreaPersonalizada())}
          />
          <button
            type="button"
            className="onboarding-btn-secondary"
            onClick={agregarAreaPersonalizada}
            disabled={!nuevaAreaNombre.trim()}
          >
            Agregar
          </button>
        </div>

        {/* Detalle de Mesas por Área */}
        <div className="onboarding-table-wrapper">
          <table className="onboarding-table">
            <thead>
              <tr>
                <th>Zona / Área</th>
                <th style={{ width: "130px" }}>Mesas</th>
                <th style={{ width: "130px" }}>Asientos c/u</th>
                <th style={{ width: "110px" }}>Prefijo</th>
                <th>Previsualización</th>
                <th style={{ width: "40px" }}></th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      className="onboarding-input"
                      value={area.nombreArea}
                      onChange={(e) => updateArea(idx, "nombreArea", e.target.value)}
                      style={{ padding: "0.4rem 0.6rem" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      className="onboarding-input"
                      value={area.cantidadMesas}
                      onChange={(e) => updateArea(idx, "cantidadMesas", parseInt(e.target.value) || 1)}
                      style={{ padding: "0.4rem 0.6rem" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="onboarding-input"
                      value={area.asientosPorMesa}
                      onChange={(e) => updateArea(idx, "asientosPorMesa", parseInt(e.target.value) || 1)}
                      style={{ padding: "0.4rem 0.6rem" }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      maxLength={4}
                      className="onboarding-input"
                      value={area.prefijoMesa}
                      onChange={(e) => updateArea(idx, "prefijoMesa", e.target.value.toUpperCase())}
                      style={{ padding: "0.4rem 0.6rem", textTransform: "uppercase" }}
                    />
                  </td>
                  <td style={{ color: "#38bdf8", fontSize: "0.8125rem", fontWeight: 600 }}>
                    {`${area.prefijoMesa}1 a ${area.prefijoMesa}${area.cantidadMesas} (${area.cantidadMesas * area.asientosPorMesa} comensales)`}
                  </td>
                  <td>
                    {areas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarArea(idx)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                        title="Eliminar área"
                      >
                        <Icon name="Trash2" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección Estaciones de Cocina */}
      <div>
        <label className="onboarding-label" style={{ marginBottom: "0.5rem", display: "block" }}>
          Estaciones de Cocina / KDS (Destinos de Comanda)
        </label>
        <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
          ¿En qué pantallas o impresoras térmicas se preparan los pedidos de tus clientes?
        </p>

        <div className="onboarding-chips-row" style={{ marginBottom: "1rem" }}>
          {ESTACIONES_SUGERIDAS.map((sug) => {
            const isSelected = estaciones.some((e) => e.nombre.toLowerCase() === sug.nombre.toLowerCase());
            return (
              <button
                key={sug.nombre}
                type="button"
                className={`onboarding-chip ${isSelected ? "selected" : ""}`}
                onClick={() => toggleEstacionSugerida(sug)}
              >
                {isSelected ? <Icon name="Check" /> : <Icon name="Plus" />}
                {sug.nombre}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", maxWidth: "400px" }}>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Otra estación (ej. Taquería)"
            value={nuevaEstacionNombre}
            onChange={(e) => setNuevaEstacionNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarEstacionPersonalizada())}
          />
          <button
            type="button"
            className="onboarding-btn-secondary"
            onClick={agregarEstacionPersonalizada}
            disabled={!nuevaEstacionNombre.trim()}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
