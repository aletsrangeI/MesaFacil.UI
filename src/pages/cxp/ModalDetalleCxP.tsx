import React from "react";
import {
  X,
  Printer,
  FileText,
  CreditCard,
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useGetCuentaPorPagarByIdQuery } from "../../services/cxpApi";
import { Button } from "../../components/ui/button/Button";

interface ModalDetalleCxPProps {
  idCuenta: number;
  onClose: () => void;
  onAbonarClick?: () => void;
}

export const ModalDetalleCxP: React.FC<ModalDetalleCxPProps> = ({
  idCuenta,
  onClose,
  onAbonarClick,
}) => {
  const { data: cuenta, isLoading } = useGetCuentaPorPagarByIdQuery(idCuenta);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !cuenta) {
    return (
      <div className="cxp-modal-overlay">
        <div className="cxp-modal-content" style={{ padding: "2rem", textAlign: "center" }}>
          <p>Cargando información del compromiso financiero...</p>
        </div>
      </div>
    );
  }

  const renderSemaforo = () => {
    if (cuenta.estado === "Pagada") {
      return (
        <span className="cxp-semaforo-badge al-corriente">
          <CheckCircle2 size={14} /> Liquidada
        </span>
      );
    }
    if (cuenta.semaforo === "Vencida") {
      return (
        <span className="cxp-semaforo-badge vencida">
          <AlertTriangle size={14} /> Vencida ({Math.abs(cuenta.diasParaVencer)} días de retraso)
        </span>
      );
    }
    if (cuenta.semaforo === "PorVencer") {
      return (
        <span className="cxp-semaforo-badge por-vencer">
          <Clock size={14} /> Vence pronto ({cuenta.diasParaVencer} días)
        </span>
      );
    }
    return (
      <span className="cxp-semaforo-badge al-corriente">
        <CheckCircle2 size={14} /> Al corriente ({cuenta.diasParaVencer} días)
      </span>
    );
  };

  return (
    <div className="cxp-modal-overlay">
      <div className="cxp-modal-content" style={{ maxWidth: "780px" }}>
        <div className="cxp-modal-header no-print">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={22} color="var(--color-primary, #d64545)" />
            <h2>Detalle de Cuenta por Pagar #{cuenta.id}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer size={16} />}
            >
              Imprimir Comprobante
            </Button>
            <button
              type="button"
              className="cxp-modal-close-btn"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="cxp-modal-body cxp-printable">
          {/* Cabecera para Impresión / Vista */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid var(--color-surface-sunken, #e5e7eb)",
              paddingBottom: "1rem",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--color-text, #1f1f1f)" }}>
                {cuenta.proveedorRazonSocial}
              </h3>
              <p style={{ margin: "0.25rem 0 0 0", color: "var(--color-text-muted, #6b7280)", fontSize: "0.875rem" }}>
                RFC: <strong>{cuenta.proveedorRFC}</strong> | Sucursal: <strong>{cuenta.sucursalNombre}</strong>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: "0.4rem" }}>{renderSemaforo()}</div>
              <span className={`cxp-status-badge ${cuenta.estado.toLowerCase()}`}>
                Estado: {cuenta.estado}
              </span>
            </div>
          </div>

          {/* Grilla de Datos de la Factura */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
              background: "var(--color-surface-raised, #f4f6f8)",
              padding: "1rem",
              borderRadius: "var(--radius-sm, 8px)",
              fontSize: "0.85rem",
            }}
          >
            <div>
              <span style={{ color: "var(--color-text-muted, #6b7280)", display: "block" }}>
                Factura / Folio:
              </span>
              <strong>
                {cuenta.facturaSerie || ""}
                {cuenta.facturaFolio || "Sin folio"}
              </strong>
            </div>
            {cuenta.facturaUUID && (
              <div style={{ gridColumn: "span 2" }}>
                <span style={{ color: "var(--color-text-muted, #6b7280)", display: "block" }}>
                  UUID Fiscal SAT:
                </span>
                <code style={{ fontSize: "0.8rem" }}>{cuenta.facturaUUID}</code>
              </div>
            )}
            <div>
              <span style={{ color: "var(--color-text-muted, #6b7280)", display: "block" }}>
                Fecha Emisión:
              </span>
              <strong>{new Date(cuenta.fechaEmision).toLocaleDateString("es-MX")}</strong>
            </div>
            <div>
              <span style={{ color: "var(--color-text-muted, #6b7280)", display: "block" }}>
                Fecha Vencimiento:
              </span>
              <strong>{new Date(cuenta.fechaVencimiento).toLocaleDateString("es-MX")}</strong>
            </div>
            <div>
              <span style={{ color: "var(--color-text-muted, #6b7280)", display: "block" }}>
                Días de Crédito:
              </span>
              <strong>{cuenta.diasCredito} días</strong>
            </div>
          </div>

          {/* Saldos Card */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              textAlign: "center",
              padding: "1rem",
              border: "1px solid var(--color-surface-sunken, #e5e7eb)",
              borderRadius: "var(--radius-sm, 8px)",
            }}
          >
            <div>
              <span style={{ color: "var(--color-text-muted, #6b7280)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Monto Original
              </span>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text, #1f1f1f)" }}>
                ${cuenta.montoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-muted, #6b7280)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Total Abonado
              </span>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-success, #3c8d40)" }}>
                ${cuenta.totalAbonado.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--color-text-muted, #6b7280)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Saldo Pendiente
              </span>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: cuenta.saldoInsoluto > 0 ? "var(--color-primary, #d64545)" : "var(--color-text, #1f1f1f)",
                }}
              >
                ${cuenta.saldoInsoluto.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Historial de Abonos */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <History size={18} color="var(--color-primary, #d64545)" />
              <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--color-text, #1f1f1f)" }}>
                Historial Cronológico de Pagos y Abonos ({cuenta.pagos.length})
              </h4>
            </div>

            {cuenta.pagos.length === 0 ? (
              <p style={{ color: "var(--color-text-muted, #6b7280)", fontStyle: "italic", fontSize: "0.875rem" }}>
                No se han registrado abonos para este compromiso.
              </p>
            ) : (
              <div className="cxp-table-wrapper" style={{ border: "1px solid var(--color-surface-sunken, #e5e7eb)", borderRadius: "var(--radius-sm, 8px)" }}>
                <table className="cxp-abonos-table">
                  <thead>
                    <tr>
                      <th>Fecha / Hora</th>
                      <th>Método de Pago</th>
                      <th>Caja / Referencia</th>
                      <th>Registrado por</th>
                      <th style={{ textAlign: "right" }}>Monto Abonado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuenta.pagos.map((pago) => (
                      <tr key={pago.id}>
                        <td>{new Date(pago.fechaPago).toLocaleString("es-MX")}</td>
                        <td>
                          <strong>{pago.metodoPagoNombre}</strong>
                        </td>
                        <td>
                          {pago.idMovimientoCaja ? (
                            <span style={{ color: "var(--color-success, #3c8d40)" }}>
                              Caja Chica (Egreso #{pago.idMovimientoCaja})
                            </span>
                          ) : (
                            pago.referenciaBancaria || "N/A"
                          )}
                        </td>
                        <td>{pago.usuarioNombre || pago.turnoUsuario || "Sistema"}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "var(--color-success, #3c8d40)" }}>
                          ${pago.monto.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {cuenta.observaciones && (
            <div style={{ fontSize: "0.825rem", color: "var(--color-text-muted, #6b7280)" }}>
              <strong>Notas:</strong> {cuenta.observaciones}
            </div>
          )}
        </div>

        <div className="cxp-modal-footer no-print">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          {cuenta.saldoInsoluto > 0 && cuenta.estado !== "Cancelada" && onAbonarClick && (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onClose();
                onAbonarClick();
              }}
              leftIcon={<CreditCard size={16} />}
            >
              Registrar Nuevo Abono
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
