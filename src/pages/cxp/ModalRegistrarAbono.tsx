import React, { useState } from "react";
import {
  X,
  Banknote,
  AlertCircle,
  FileCheck,
  Store,
} from "lucide-react";
import {
  type CuentaPorPagarItem,
  useRegistrarAbonoMutation,
  useGetTurnosActivosQuery,
} from "../../services/cxpApi";
import { Button } from "../../components/ui/button/Button";

interface ModalRegistrarAbonoProps {
  cuenta: CuentaPorPagarItem;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalRegistrarAbono: React.FC<ModalRegistrarAbonoProps> = ({
  cuenta,
  onClose,
  onSuccess,
}) => {
  const [monto, setMonto] = useState<string>(cuenta.saldoInsoluto.toFixed(2));
  const [idMetodoPago, setIdMetodoPago] = useState<number>(1); // 1 = Efectivo
  const [pagarDesdeCajaChica, setPagarDesdeCajaChica] = useState<boolean>(true);
  const [idTurno, setIdTurno] = useState<number | undefined>(undefined);
  const [referenciaBancaria, setReferenciaBancaria] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [registrarAbono, { isLoading }] = useRegistrarAbonoMutation();

  // Consultar turnos activos en la sucursal de la cuenta
  const { data: turnosActivos = [] } = useGetTurnosActivosQuery(cuenta.idSucursal);

  const numMonto = parseFloat(monto) || 0;
  const saldoRestante = Math.max(0, cuenta.saldoInsoluto - numMonto);
  const esLiquidacionTotal = numMonto >= cuenta.saldoInsoluto;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (numMonto <= 0) {
      setErrorMsg("El monto a abonar debe ser mayor a $0.00 MXN.");
      return;
    }

    if (numMonto > cuenta.saldoInsoluto) {
      setErrorMsg(
        `El monto a abonar ($${numMonto.toFixed(2)}) supera el saldo pendiente ($${cuenta.saldoInsoluto.toFixed(2)}).`
      );
      return;
    }

    if (idMetodoPago === 1 && pagarDesdeCajaChica && turnosActivos.length === 0) {
      setErrorMsg(
        "No hay ningún turno de caja abierto en esta sucursal para debitar el dinero de caja chica. Desmarque la opción de caja chica o seleccione otro método de pago."
      );
      return;
    }

    try {
      await registrarAbono({
        idCuentaPorPagar: cuenta.id,
        monto: numMonto,
        idMetodoPago,
        pagarDesdeCajaChica: idMetodoPago === 1 && pagarDesdeCajaChica,
        idTurno: idTurno || (turnosActivos.length > 0 ? turnosActivos[0].idTurno : undefined),
        referenciaBancaria: referenciaBancaria.trim() || undefined,
        observaciones: observaciones.trim() || undefined,
      }).unwrap();

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Ocurrió un error al registrar el pago.");
    }
  };

  return (
    <div className="cxp-modal-overlay">
      <div className="cxp-modal-content">
        <div className="cxp-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Banknote size={22} color="var(--color-primary, #d64545)" />
            <h2>Registrar Abono a Proveedor</h2>
          </div>
          <button
            type="button"
            className="cxp-modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cxp-modal-body">
            {/* Box Resumen de la Factura */}
            <div className="cxp-resumen-box">
              <div className="cxp-resumen-row">
                <span className="cxp-resumen-label">Proveedor:</span>
                <span className="cxp-resumen-value">{cuenta.proveedorRazonSocial}</span>
              </div>
              <div className="cxp-resumen-row">
                <span className="cxp-resumen-label">RFC:</span>
                <span className="cxp-resumen-value">{cuenta.proveedorRFC}</span>
              </div>
              <div className="cxp-resumen-row">
                <span className="cxp-resumen-label">Factura / Folio:</span>
                <span className="cxp-resumen-value">
                  {cuenta.facturaSerie || ""}
                  {cuenta.facturaFolio || `CxP #${cuenta.id}`}
                </span>
              </div>
              <div className="cxp-resumen-row">
                <span className="cxp-resumen-label">Monto Total Original:</span>
                <span className="cxp-resumen-value">
                  ${cuenta.montoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
              <div className="cxp-resumen-row">
                <span className="cxp-resumen-label">Saldo Pendiente Actual:</span>
                <span className="cxp-resumen-value highlight">
                  ${cuenta.saldoInsoluto.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  background: "var(--color-danger-bg, rgba(214, 69, 69, 0.12))",
                  color: "var(--color-danger, #d64545)",
                  borderRadius: "var(--radius-sm, 8px)",
                  fontSize: "0.85rem",
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Monto a abonar */}
            <div className="cxp-form-group">
              <label htmlFor="montoAbonar">Monto a abonar (MXN)*</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  id="montoAbonar"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={cuenta.saldoInsoluto}
                  className="cxp-input"
                  style={{ flex: 1 }}
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setMonto(cuenta.saldoInsoluto.toFixed(2))}
                >
                  Liquidar Total
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.78rem",
                  marginTop: "0.25rem",
                  color: "var(--color-text-muted, #6b7280)",
                }}
              >
                <span>
                  Nuevo saldo restante:{" "}
                  <strong style={{ color: "var(--color-text, #1f1f1f)" }}>
                    ${saldoRestante.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                  </strong>
                </span>
                <span>
                  {esLiquidacionTotal ? (
                    <strong style={{ color: "var(--color-success, #3c8d40)" }}>
                      Se liquidará completamente
                    </strong>
                  ) : (
                    "Abono parcial"
                  )}
                </span>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="cxp-form-group">
              <label htmlFor="metodoPago">Método de Pago*</label>
              <select
                id="metodoPago"
                className="cxp-select"
                value={idMetodoPago}
                onChange={(e) => setIdMetodoPago(parseInt(e.target.value, 10))}
              >
                <option value={1}>Efectivo</option>
                <option value={2}>Transferencia SPEI</option>
                <option value={3}>Tarjeta Corporativa</option>
                <option value={4}>Cheque</option>
              </select>
            </div>

            {/* Integración con Caja Chica si es Efectivo */}
            {idMetodoPago === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="cxp-switch-label">
                  <input
                    type="checkbox"
                    checked={pagarDesdeCajaChica}
                    onChange={(e) => setPagarDesdeCajaChica(e.target.checked)}
                  />
                  <div className="cxp-switch-text">
                    <span className="cxp-switch-title">Pagar desde Caja Chica (Turno Activo)</span>
                    <span className="cxp-switch-desc">
                      Genera automáticamente un Egreso de dinero en el corte de caja del turno
                      abierto.
                    </span>
                  </div>
                </label>

                {pagarDesdeCajaChica && (
                  <div
                    style={{
                      background: "var(--color-surface-raised, #f4f6f8)",
                      border: "1px solid var(--color-surface-sunken, #e5e7eb)",
                      borderRadius: "var(--radius-sm, 8px)",
                      padding: "0.75rem",
                      fontSize: "0.825rem",
                    }}
                  >
                    {turnosActivos.length > 0 ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                          <Store size={16} color="var(--color-success, #3c8d40)" />
                          <strong>Turno activo detectado en {cuenta.sucursalNombre}:</strong>
                        </div>
                        {turnosActivos.length === 1 ? (
                          <div>
                            Cajero: <strong>{turnosActivos[0].usuarioNombre}</strong> (Turno #{turnosActivos[0].idTurno})
                          </div>
                        ) : (
                          <select
                            className="cxp-select"
                            style={{ width: "100%", marginTop: "0.25rem" }}
                            value={idTurno || turnosActivos[0].idTurno}
                            onChange={(e) => setIdTurno(parseInt(e.target.value, 10))}
                          >
                            {turnosActivos.map((t) => (
                              <option key={t.idTurno} value={t.idTurno}>
                                Turno #{t.idTurno} - Cajero: {t.usuarioNombre}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: "var(--color-danger, #d64545)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <AlertCircle size={16} />
                        <span>No hay turnos de caja abiertos en {cuenta.sucursalNombre}.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Referencia bancaria si no es efectivo */}
            {idMetodoPago !== 1 && (
              <div className="cxp-form-group">
                <label htmlFor="refBancaria">Número de Rastreo SPEI / Referencia / Autorización</label>
                <input
                  id="refBancaria"
                  type="text"
                  className="cxp-input"
                  placeholder="Ej. SPEI-984210293, Cheque #452"
                  value={referenciaBancaria}
                  onChange={(e) => setReferenciaBancaria(e.target.value)}
                />
              </div>
            )}

            {/* Observaciones */}
            <div className="cxp-form-group">
              <label htmlFor="obsAbono">Notas u Observaciones del Pago</label>
              <input
                id="obsAbono"
                type="text"
                className="cxp-input"
                placeholder="Ej. Chofer proveedor recogió cheque en mostrador..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
          </div>

          <div className="cxp-modal-footer">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || numMonto <= 0 || numMonto > cuenta.saldoInsoluto}
              leftIcon={<FileCheck size={16} />}
            >
              {isLoading ? "Aplicando Pago..." : esLiquidacionTotal ? "Liquidar Cuenta" : "Registrar Abono"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
