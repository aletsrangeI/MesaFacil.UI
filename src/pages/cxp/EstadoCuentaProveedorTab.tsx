import React, { useState } from "react";
import {
  Building2,
  Printer,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { useGetEstadoCuentaProveedorQuery } from "../../services/cxpApi";
import { useGetProveedoresQuery } from "../../services/comprasApi";
import { Button } from "../../components/ui/button/Button";

interface EstadoCuentaProveedorTabProps {
  initialProveedorId?: number;
}

export const EstadoCuentaProveedorTab: React.FC<EstadoCuentaProveedorTabProps> = ({
  initialProveedorId,
}) => {
  const [selectedProveedorId, setSelectedProveedorId] = useState<number | undefined>(
    initialProveedorId
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: proveedores = [] } = useGetProveedoresQuery();
  const { data: estadoCuenta, isLoading } = useGetEstadoCuentaProveedorQuery(
    { idProveedor: selectedProveedorId || 0 },
    { skip: !selectedProveedorId || selectedProveedorId <= 0 }
  );

  const filteredProveedores = proveedores.filter(
    (p) =>
      p.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rfc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMxn = (val: number) =>
    `$${val.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cxp-stack">
      {/* Selector de Proveedor */}
      <div className="cxp-filters-bar no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Building2 size={20} color="var(--color-primary, #d64545)" />
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text, #1f1f1f)" }}>
            Estado de Cuenta por Proveedor
          </h3>
        </div>

        <div className="cxp-filter-group" style={{ flex: 1, justifyContent: "flex-end" }}>
          <div className="cxp-search-input" style={{ maxWidth: "320px" }}>
            <Search size={16} color="var(--color-text-muted, #6b7280)" />
            <input
              type="text"
              placeholder="Buscar proveedor por nombre o RFC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="cxp-select"
            value={selectedProveedorId || ""}
            onChange={(e) => setSelectedProveedorId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
          >
            <option value="">-- Seleccionar Proveedor --</option>
            {filteredProveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.razonSocial} ({p.rfc})
              </option>
            ))}
          </select>

          {selectedProveedorId && (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrint}
              leftIcon={<Printer size={16} />}
              disabled={!estadoCuenta}
            >
              Imprimir Estado de Cuenta
            </Button>
          )}
        </div>
      </div>

      {!selectedProveedorId ? (
        <div
          style={{
            background: "var(--color-surface, #ffffff)",
            border: "1px solid var(--color-surface-sunken, #e5e7eb)",
            borderRadius: "var(--radius-md, 12px)",
            padding: "3rem 1.5rem",
            textAlign: "center",
            color: "var(--color-text-muted, #6b7280)",
          }}
        >
          <Building2 size={40} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
          <h4 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-text, #1f1f1f)" }}>
            Selecciona un proveedor para consultar su estado de cuenta
          </h4>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
            Podrás visualizar el histórico de compras a crédito, abonos aplicados y el saldo vivo resultante.
          </p>
        </div>
      ) : isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          Cargando estado de cuenta del proveedor...
        </div>
      ) : !estadoCuenta ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-danger, #d64545)" }}>
          No fue posible obtener el estado de cuenta del proveedor.
        </div>
      ) : (
        <div className="cxp-printable">
          {/* Cabecera Proveedor */}
          <div
            style={{
              background: "var(--color-surface, #ffffff)",
              border: "1px solid var(--color-surface-sunken, #e5e7eb)",
              borderRadius: "var(--radius-md, 12px)",
              padding: "1.25rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--color-text, #1f1f1f)" }}>
                {estadoCuenta.razonSocial}
              </h2>
              <p style={{ margin: "0.25rem 0 0 0", color: "var(--color-text-muted, #6b7280)", fontSize: "0.875rem" }}>
                RFC: <strong>{estadoCuenta.rfc}</strong> | Condiciones de crédito: <strong>{estadoCuenta.diasCredito} días</strong>
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted, #6b7280)", textTransform: "uppercase" }}>
                Saldo Vivo Pendiente
              </span>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: estadoCuenta.saldoTotalPendiente > 0 ? "var(--color-primary, #d64545)" : "var(--color-success, #3c8d40)",
                }}
              >
                {formatMxn(estadoCuenta.saldoTotalPendiente)}
              </div>
            </div>
          </div>

          {/* Cards Resumen */}
          <div className="cxp-kpis-grid" style={{ marginBottom: "1.5rem" }}>
            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">Total Comprado a Crédito</span>
                <span className="cxp-kpi-value">{formatMxn(estadoCuenta.totalCompradoCredito)}</span>
                <span className="cxp-kpi-sub">Suma histórica de facturas</span>
              </div>
            </div>

            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">Total Liquidado / Abonado</span>
                <span className="cxp-kpi-value" style={{ color: "var(--color-success, #3c8d40)" }}>
                  {formatMxn(estadoCuenta.totalAbonado)}
                </span>
                <span className="cxp-kpi-sub">Pagos aplicados formalmente</span>
              </div>
            </div>

            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">Saldo Pendiente Actual</span>
                <span
                  className="cxp-kpi-value"
                  style={{
                    color: estadoCuenta.saldoTotalPendiente > 0 ? "var(--color-primary, #d64545)" : "inherit",
                  }}
                >
                  {formatMxn(estadoCuenta.saldoTotalPendiente)}
                </span>
                <span className="cxp-kpi-sub">Pasivo exigible</span>
              </div>
            </div>
          </div>

          {/* Tabla de Movimientos del Estado de Cuenta */}
          <div className="cxp-card-table">
            <div className="cxp-table-wrapper">
              <table className="cxp-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Referencia / Folio</th>
                    <th>Método / Notas</th>
                    <th style={{ textAlign: "right" }}>Cargo (Factura)</th>
                    <th style={{ textAlign: "right" }}>Abono (Pago)</th>
                    <th style={{ textAlign: "right", fontWeight: 700 }}>Saldo Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {estadoCuenta.movimientos.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted, #6b7280)" }}>
                        No hay movimientos registrados para este proveedor.
                      </td>
                    </tr>
                  ) : (
                    estadoCuenta.movimientos.map((m, idx) => (
                      <tr key={idx}>
                        <td>{new Date(m.fecha).toLocaleDateString("es-MX")}</td>
                        <td>
                          {m.tipo === "Factura" ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--color-primary, #d64545)", fontWeight: 600 }}>
                              <ArrowUpRight size={14} /> Factura
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--color-success, #3c8d40)", fontWeight: 600 }}>
                              <ArrowDownLeft size={14} /> Abono
                            </span>
                          )}
                        </td>
                        <td>
                          <strong>{m.referencia}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted, #6b7280)" }}>
                            {m.metodoPago ? `[${m.metodoPago}] ` : ""}
                            {m.observaciones || ""}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", color: m.cargo > 0 ? "var(--color-text, #1f1f1f)" : "inherit" }}>
                          {m.cargo > 0 ? formatMxn(m.cargo) : "-"}
                        </td>
                        <td style={{ textAlign: "right", color: m.abono > 0 ? "var(--color-success, #3c8d40)" : "inherit", fontWeight: m.abono > 0 ? 600 : 400 }}>
                          {m.abono > 0 ? formatMxn(m.abono) : "-"}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>
                          {formatMxn(m.saldoAcumulado)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
