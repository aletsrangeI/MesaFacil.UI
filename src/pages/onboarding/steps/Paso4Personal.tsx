import React from "react";
import type { PersonalOnboarding } from "../../../services/onboardingApi";
import Icon from "../../../components/ui/icons/Icon";

interface Paso4PersonalProps {
  personal: PersonalOnboarding[];
  pinSupervisorAdmin: string;
  onUpdatePersonal: (personal: PersonalOnboarding[]) => void;
  onUpdatePinSupervisor: (pin: string) => void;
}

export const Paso4Personal: React.FC<Paso4PersonalProps> = ({
  personal,
  pinSupervisorAdmin,
  onUpdatePersonal,
  onUpdatePinSupervisor,
}) => {
  const agregarEmpleado = () => {
    onUpdatePersonal([
      ...personal,
      {
        nombreCompleto: "",
        rol: "Mesero",
        pin: "",
        telefono: "",
      },
    ]);
  };

  const updateEmpleado = (index: number, campo: keyof PersonalOnboarding, valor: any) => {
    const copia = [...personal];
    if (campo === "pin") {
      // Filtrar sólo dígitos y máximo 4
      valor = valor.replace(/\D/g, "").slice(0, 4);
    }
    copia[index] = { ...copia[index], [campo]: valor };
    onUpdatePersonal(copia);
  };

  const eliminarEmpleado = (index: number) => {
    onUpdatePersonal(personal.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="onboarding-step-header">
        <h3 className="onboarding-step-title">
          <Icon name="Users" /> Equipo de Trabajo & PINs de Acceso
        </h3>
        <p className="onboarding-step-desc">
          Da de alta a tus meseros, cajeros o repartidores. Solo necesitan su nombre y un <strong>PIN de 4 dígitos</strong> para ingresar de forma táctil en el Punto de Venta sin contraseñas largas.
        </p>
      </div>

      {/* Personal Operativo */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="onboarding-table-wrapper">
          <table className="onboarding-table">
            <thead>
              <tr>
                <th>Nombre del Empleado</th>
                <th style={{ width: "190px" }}>Puesto / Rol</th>
                <th style={{ width: "120px" }}>PIN (4 Dígitos)</th>
                <th style={{ width: "160px" }}>Celular (Opcional)</th>
                <th style={{ width: "40px" }}></th>
              </tr>
            </thead>
            <tbody>
              {personal.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
                    Aún no has agregado personal. Puedes agregar a tus meseros para que comiencen a usar el POS hoy mismo.
                  </td>
                </tr>
              ) : (
                personal.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        className="onboarding-input"
                        placeholder="Ej. Juan Pérez"
                        value={p.nombreCompleto}
                        onChange={(e) => updateEmpleado(idx, "nombreCompleto", e.target.value)}
                        style={{ padding: "0.4rem 0.6rem" }}
                      />
                    </td>
                    <td>
                      <select
                        className="onboarding-select"
                        value={p.rol}
                        onChange={(e) => updateEmpleado(idx, "rol", e.target.value)}
                        style={{ padding: "0.4rem 0.6rem" }}
                      >
                        <option value="Mesero">Mesero / Comandero</option>
                        <option value="Manager">Gerente / Cajero</option>
                        <option value="Repartidor">Repartidor (Delivery)</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        placeholder="1234"
                        className="onboarding-input onboarding-pin-box"
                        value={p.pin}
                        onChange={(e) => updateEmpleado(idx, "pin", e.target.value)}
                        style={{ padding: "0.4rem 0.6rem" }}
                      />
                    </td>
                    <td>
                      <input
                        type="tel"
                        className="onboarding-input"
                        placeholder="WhatsApp..."
                        value={p.telefono || ""}
                        onChange={(e) => updateEmpleado(idx, "telefono", e.target.value)}
                        style={{ padding: "0.4rem 0.6rem" }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => eliminarEmpleado(idx)}
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
          onClick={agregarEmpleado}
        >
          <Icon name="UserPlus" /> Agregar Empleado
        </button>
      </div>

      {/* Candado de Supervisor para Administrador */}
      <div style={{ background: "#0b1120", border: "1px solid #27354f", borderRadius: "0.75rem", padding: "1.25rem" }}>
        <h4 style={{ margin: "0 0 0.5rem 0", color: "#f8fafc", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Icon name="ShieldAlert" /> Tu PIN de Supervisor (Administrador)
        </h4>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "0 0 1rem 0" }}>
          Este PIN de 4 dígitos te permitirá autorizar cancelaciones de platillos, aplicar descuentos especiales y desbloquear operaciones críticas en el POS en segundos sin salir de la pantalla de venta:
        </p>

        <div style={{ maxWidth: "200px" }}>
          <label className="onboarding-label" style={{ fontSize: "0.8125rem" }}>PIN de Supervisor (4 dígitos)</label>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            placeholder="9999"
            className="onboarding-input onboarding-pin-box"
            value={pinSupervisorAdmin}
            onChange={(e) => onUpdatePinSupervisor(e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={{ marginTop: "0.25rem", width: "100%", fontSize: "1.25rem", textAlign: "center" }}
          />
        </div>
      </div>
    </div>
  );
};
