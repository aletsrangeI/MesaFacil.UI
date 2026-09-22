import React from "react";
import type { ProvisionarRestaurantePayload } from "../../../services/onboardingApi";
import Icon from "../../../components/ui/icons/Icon";

interface Paso5LanzamientoProps {
  payload: ProvisionarRestaurantePayload;
  onUpdatePayload: (updates: Partial<ProvisionarRestaurantePayload>) => void;
  isSubmitting: boolean;
  onFinalizar: () => void;
}

export const Paso5Lanzamiento: React.FC<Paso5LanzamientoProps> = ({
  payload,
  onUpdatePayload,
  isSubmitting,
  onFinalizar,
}) => {
  const totalMesas = payload.areasYMesas.reduce((acc, a) => acc + (a.cantidadMesas || 0), 0);
  const totalAsientos = payload.areasYMesas.reduce((acc, a) => acc + (a.cantidadMesas * a.asientosPorMesa || 0), 0);
  const totalPlatillos = payload.menu.productos.filter((p) => p.nombre.trim()).length;
  const totalPersonal = payload.personal.filter((p) => p.nombreCompleto.trim()).length;

  return (
    <div>
      <div className="onboarding-step-header">
        <h3 className="onboarding-step-title">
          <Icon name="Rocket" /> ¡Todo Listo para Vender!
        </h3>
        <p className="onboarding-step-desc">
          Revisa el resumen de tu configuración inicial. Al confirmar, tu restaurante se aprovisionará y entrarás directo al Punto de Venta para cobrar tu primera comanda.
        </p>
      </div>

      {/* Readiness Cards */}
      <div className="onboarding-summary-grid">
        <div className="onboarding-summary-card">
          <div className="onboarding-summary-val">{payload.areasYMesas.length}</div>
          <div className="onboarding-summary-txt">Zonas de Comedor</div>
        </div>

        <div className="onboarding-summary-card">
          <div className="onboarding-summary-val">{totalMesas}</div>
          <div className="onboarding-summary-txt">Mesas ({totalAsientos} Asientos)</div>
        </div>

        <div className="onboarding-summary-card">
          <div className="onboarding-summary-val">{payload.estacionesCocina.length}</div>
          <div className="onboarding-summary-txt">Estaciones Cocina</div>
        </div>

        <div className="onboarding-summary-card">
          <div className="onboarding-summary-val">{totalPlatillos}</div>
          <div className="onboarding-summary-txt">Platillos en Menú</div>
        </div>

        <div className="onboarding-summary-card">
          <div className="onboarding-summary-val">{totalPersonal}</div>
          <div className="onboarding-summary-txt">Personal con PIN</div>
        </div>
      </div>

      {/* Resumen de Datos Clave */}
      <div style={{ background: "#0b1120", border: "1px solid #27354f", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 0.75rem 0", color: "#f8fafc", fontSize: "1rem" }}>
          Detalles de la Cuenta
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", fontSize: "0.875rem", color: "#94a3b8" }}>
          <div>
            <span style={{ color: "#64748b", display: "block" }}>Restaurante:</span>
            <strong style={{ color: "#f1f5f9" }}>{payload.datosEmpresa.nombre || "(Sin nombre)"}</strong>
          </div>
          <div>
            <span style={{ color: "#64748b", display: "block" }}>Sucursal Matriz:</span>
            <strong style={{ color: "#f1f5f9" }}>{payload.datosEmpresa.nombreSucursal}</strong>
          </div>
          <div>
            <span style={{ color: "#64748b", display: "block" }}>Moneda / Impuesto:</span>
            <strong style={{ color: "#f1f5f9" }}>MXN ({payload.datosEmpresa.tasaIva}% IVA)</strong>
          </div>
          <div>
            <span style={{ color: "#64748b", display: "block" }}>PIN Supervisor:</span>
            <strong style={{ color: "#38bdf8" }}>{payload.pinSupervisorAdmin ? "Configurado (****)" : "No configurado"}</strong>
          </div>
        </div>
      </div>

      {/* Turno Inicial de Caja */}
      <div className="onboarding-switch-row">
        <input
          type="checkbox"
          id="chkTurno"
          checked={payload.abrirTurnoInicial}
          onChange={(e) => onUpdatePayload({ abrirTurnoInicial: e.target.checked })}
          style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer", accentColor: "#0284c7" }}
        />
        <div style={{ flex: 1 }}>
          <label htmlFor="chkTurno" className="onboarding-switch-label" style={{ cursor: "pointer" }}>
            Abrir primer turno de caja automáticamente
          </label>
          <p style={{ color: "#94a3b8", fontSize: "0.8125rem", margin: "0.2rem 0 0 0" }}>
            Recomendado para entrar directo al POS sin que el sistema te pida abrir turno de inmediato.
          </p>
        </div>

        {payload.abrirTurnoInicial && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>Fondo Inicial:</span>
            <input
              type="number"
              min={0}
              step={100}
              className="onboarding-input"
              style={{ width: "120px", fontWeight: 700, textAlign: "right" }}
              value={payload.fondoCajaInicial}
              onChange={(e) => onUpdatePayload({ fondoCajaInicial: parseFloat(e.target.value) || 0 })}
            />
            <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>MXN</span>
          </div>
        )}
      </div>

      {/* Botón de Confirmación Principal */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          type="button"
          className="onboarding-btn-primary"
          onClick={onFinalizar}
          disabled={isSubmitting || !payload.datosEmpresa.nombre.trim()}
          style={{
            fontSize: "1.125rem",
            padding: "1rem 2.5rem",
            borderRadius: "0.75rem",
            margin: "0 auto",
            display: "inline-flex",
          }}
        >
          {isSubmitting ? (
            <>
              <Icon name="RefreshCw" /> Aprovisionando Restaurante...
            </>
          ) : (
            <>
              <Icon name="CheckCircle" /> Guardar y Abrir Punto de Venta
            </>
          )}
        </button>
        <p style={{ color: "#64748b", fontSize: "0.8125rem", marginTop: "0.75rem" }}>
          Toda la configuración se guardará de forma segura en una sola transacción en base de datos.
        </p>
      </div>
    </div>
  );
};
