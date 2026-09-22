import React from "react";
import type { DatosEmpresaOnboarding } from "../../../services/onboardingApi";
import Icon from "../../../components/ui/icons/Icon";

interface Paso1IdentidadProps {
  datos: DatosEmpresaOnboarding;
  onChange: (nuevosDatos: Partial<DatosEmpresaOnboarding>) => void;
}

const ZONAS_HORARIAS = [
  { value: "America/Mexico_City", label: "Centro de México (CDMX, GDL, MTY)" },
  { value: "America/Cancun", label: "Sureste / Quintana Roo (Cancún)" },
  { value: "America/Tijuana", label: "Noroeste (Tijuana, Mexicali)" },
  { value: "America/Hermosillo", label: "Sonora (Hermosillo)" },
  { value: "America/Mazatlan", label: "Pacífico (Mazatlán, Culiacán, La Paz)" },
];

export const Paso1Identidad: React.FC<Paso1IdentidadProps> = ({ datos, onChange }) => {
  return (
    <div>
      <div className="onboarding-step-header">
        <h3 className="onboarding-step-title">
          <Icon name="Building" /> Identidad del Restaurante & Sucursal
        </h3>
        <p className="onboarding-step-desc">
          Comencemos con los datos generales de tu negocio para membretar tickets y configurar tu primera sucursal.
        </p>
      </div>

      <div className="onboarding-form-grid">
        <div className="onboarding-field">
          <label className="onboarding-label">Nombre del Restaurante *</label>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Ej. La Parrilla de Don Mario"
            value={datos.nombre}
            onChange={(e) => onChange({ nombre: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">RFC o Razón Social (Opcional)</label>
          <input
            type="text"
            className="onboarding-input"
            placeholder="XAXX010101000 (Genérico si aún no tienes)"
            value={datos.rfc || ""}
            onChange={(e) => onChange({ rfc: e.target.value.toUpperCase() })}
          />
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">Nombre de la Sucursal Matriz *</label>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Ej. Sucursal Matriz o Centro"
            value={datos.nombreSucursal}
            onChange={(e) => onChange({ nombreSucursal: e.target.value })}
            required
          />
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">Dirección Física</label>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Calle, número, colonia o plaza"
            value={datos.direccion || ""}
            onChange={(e) => onChange({ direccion: e.target.value })}
          />
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">Zona Horaria</label>
          <select
            className="onboarding-select"
            value={datos.zonaHoraria}
            onChange={(e) => onChange({ zonaHoraria: e.target.value })}
          >
            {ZONAS_HORARIAS.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">Impuesto Predeterminado (IVA)</label>
          <select
            className="onboarding-select"
            value={datos.tasaIva}
            onChange={(e) => onChange({ tasaIva: parseFloat(e.target.value) })}
          >
            <option value={16.0}>IVA 16% (Nacional Estándar)</option>
            <option value={8.0}>IVA 8% (Región Fronteriza Norte)</option>
            <option value={0.0}>0% / Exento</option>
          </select>
        </div>
      </div>
    </div>
  );
};
