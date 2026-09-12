import React, { useState } from "react";
import {
  Download,
  Printer,
  BarChart3,
} from "lucide-react";
import { useGetReporteAntiguedadSaldosQuery } from "../../services/cxpApi";
import { Button } from "../../components/ui/button/Button";

interface AntiguedadSaldosTabProps {
  idSucursal?: number;
  onSelectProveedor?: (idProveedor: number) => void;
}

export const AntiguedadSaldosTab: React.FC<AntiguedadSaldosTabProps> = ({
  idSucursal,
  onSelectProveedor,
}) => {
  const [selectedSucursal] = useState<number | undefined>(idSucursal);
  const { data: reporte, isLoading, isError } = useGetReporteAntiguedadSaldosQuery(selectedSucursal);

  const formatMxn = (val: number) =>
    `$${val.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleExportCSV = () => {
    if (!reporte || reporte.proveedores.length === 0) return;

    const headers = [
      "RFC",
      "Proveedor",
      "Al Corriente",
      "1 a 15 Dias",
      "16 a 30 Dias",
      "31 a 60 Dias",
      "Mas de 60 Dias",
      "Total Cartera",
    ];

    const rows = reporte.proveedores.map((p) => [
      `"${p.rfc}"`,
      `"${p.razonSocial.replace(/"/g, '""')}"`,
      p.alCorriente.toFixed(2),
      p.de1A15.toFixed(2),
      p.de16A30.toFixed(2),
      p.de31A60.toFixed(2),
      p.masDe60.toFixed(2),
      p.total.toFixed(2),
    ]);

    const totalRow = [
      '"TOTALES"',
      '""',
      reporte.totales.alCorriente.toFixed(2),
      reporte.totales.de1A15.toFixed(2),
      reporte.totales.de16A30.toFixed(2),
      reporte.totales.de31A60.toFixed(2),
      reporte.totales.masDe60.toFixed(2),
      reporte.totales.total.toFixed(2),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(",")), totalRow.join(",")].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Antiguedad_Saldos_CxP_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cxp-stack">
      {/* Barra de Acciones y Filtros */}
      <div className="cxp-filters-bar no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BarChart3 size={20} color="var(--color-primary, #d64545)" />
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text, #1f1f1f)" }}>
            Matriz Ejecutiva de Antigüedad de Pasivos
          </h3>
        </div>

        <div className="cxp-filter-group">
          <Button
            type="button"
            variant="secondary"
            onClick={handleExportCSV}
            leftIcon={<Download size={16} />}
            disabled={!reporte || reporte.proveedores.length === 0}
          >
            Exportar CSV
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handlePrint}
            leftIcon={<Printer size={16} />}
            disabled={!reporte || reporte.proveedores.length === 0}
          >
            Imprimir Reporte
          </Button>
        </div>
      </div>

      {/* Reporte imprimible */}
      <div className="cxp-printable">
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--color-text, #1f1f1f)" }}>
            Reporte de Antigüedad de Saldos con Proveedores
          </h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "var(--color-text-muted, #6b7280)", fontSize: "0.875rem" }}>
            Fecha de corte: <strong>{new Date().toLocaleDateString("es-MX")}</strong> | Moneda: <strong>MXN</strong>
          </p>
        </div>

        {/* Resumen de Buckets en Cards */}
        {reporte && (
          <div className="cxp-kpis-grid" style={{ marginBottom: "1.5rem" }}>
            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">Al Corriente</span>
                <span className="cxp-kpi-value" style={{ color: "var(--color-success, #3c8d40)" }}>
                  {formatMxn(reporte.totales.alCorriente)}
                </span>
                <span className="cxp-kpi-sub">Dentro del plazo de crédito</span>
              </div>
            </div>

            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">1 a 15 Días</span>
                <span className="cxp-kpi-value" style={{ color: "var(--color-secondary, #e2a72e)" }}>
                  {formatMxn(reporte.totales.de1A15)}
                </span>
                <span className="cxp-kpi-sub">Vencimiento reciente</span>
              </div>
            </div>

            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">16 a 30 Días</span>
                <span className="cxp-kpi-value" style={{ color: "#d97706" }}>
                  {formatMxn(reporte.totales.de16A30)}
                </span>
                <span className="cxp-kpi-sub">Mora moderada</span>
              </div>
            </div>

            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">31 a 60 Días</span>
                <span className="cxp-kpi-value" style={{ color: "var(--color-danger, #d64545)" }}>
                  {formatMxn(reporte.totales.de31A60)}
                </span>
                <span className="cxp-kpi-sub">Mora crítica</span>
              </div>
            </div>

            <div className="cxp-kpi-card">
              <div className="cxp-kpi-content">
                <span className="cxp-kpi-label">&gt; 60 Días</span>
                <span className="cxp-kpi-value" style={{ color: "#991b1b" }}>
                  {formatMxn(reporte.totales.masDe60)}
                </span>
                <span className="cxp-kpi-sub">Cartera muy vencida</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabla Matriz */}
        <div className="cxp-card-table">
          <div className="cxp-table-wrapper">
            <table className="cxp-table cxp-antiguedad-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "220px" }}>Proveedor / Razón Social</th>
                  <th>Al Corriente</th>
                  <th>1 a 15 días</th>
                  <th>16 a 30 días</th>
                  <th>31 a 60 días</th>
                  <th>&gt; 60 días</th>
                  <th style={{ fontWeight: 700 }}>Total por Pagar</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                      Calculando antigüedad de saldos...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--color-danger, #d64545)" }}>
                      Error al cargar el reporte de antigüedad.
                    </td>
                  </tr>
                ) : !reporte || reporte.proveedores.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted, #6b7280)" }}>
                      No se registraron pasivos pendientes de pago con proveedores.
                    </td>
                  </tr>
                ) : (
                  reporte.proveedores.map((p) => (
                    <tr key={p.idProveedor}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span
                            style={{
                              fontWeight: 600,
                              cursor: onSelectProveedor ? "pointer" : "default",
                              color: onSelectProveedor ? "var(--color-primary, #d64545)" : "inherit",
                            }}
                            onClick={() => onSelectProveedor && onSelectProveedor(p.idProveedor)}
                          >
                            {p.razonSocial}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                            RFC: {p.rfc}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: p.alCorriente > 0 ? "var(--color-success, #3c8d40)" : "inherit" }}>
                        {formatMxn(p.alCorriente)}
                      </td>
                      <td style={{ color: p.de1A15 > 0 ? "var(--color-secondary, #e2a72e)" : "inherit" }}>
                        {formatMxn(p.de1A15)}
                      </td>
                      <td style={{ color: p.de16A30 > 0 ? "#d97706" : "inherit" }}>
                        {formatMxn(p.de16A30)}
                      </td>
                      <td style={{ color: p.de31A60 > 0 ? "var(--color-danger, #d64545)" : "inherit" }}>
                        {formatMxn(p.de31A60)}
                      </td>
                      <td style={{ color: p.masDe60 > 0 ? "#991b1b" : "inherit", fontWeight: p.masDe60 > 0 ? 700 : 400 }}>
                        {formatMxn(p.masDe60)}
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatMxn(p.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {reporte && reporte.proveedores.length > 0 && (
                <tfoot>
                  <tr>
                    <td>
                      <strong>TOTAL GENERAL DE CARTERA</strong>
                    </td>
                    <td style={{ color: "var(--color-success, #3c8d40)" }}>
                      {formatMxn(reporte.totales.alCorriente)}
                    </td>
                    <td style={{ color: "var(--color-secondary, #e2a72e)" }}>
                      {formatMxn(reporte.totales.de1A15)}
                    </td>
                    <td style={{ color: "#d97706" }}>
                      {formatMxn(reporte.totales.de16A30)}
                    </td>
                    <td style={{ color: "var(--color-danger, #d64545)" }}>
                      {formatMxn(reporte.totales.de31A60)}
                    </td>
                    <td style={{ color: "#991b1b" }}>
                      {formatMxn(reporte.totales.masDe60)}
                    </td>
                    <td style={{ fontSize: "1rem", color: "var(--color-primary, #d64545)" }}>
                      {formatMxn(reporte.totales.total)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
