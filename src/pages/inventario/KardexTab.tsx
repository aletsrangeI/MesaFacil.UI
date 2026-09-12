import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../components/ui/toast";
import {
  useLazyGetKardexQuery,
  type Insumo,
  type Almacen,
} from "../../services/inventarioApi";
import {
  BookOpen,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
} from "lucide-react";

interface KardexTabProps {
  insumos: Insumo[];
  almacenes: Almacen[];
  preselectedInsumoId?: number;
}

export const KardexTab: React.FC<KardexTabProps> = ({
  insumos,
  almacenes,
  preselectedInsumoId,
}) => {
  const { addToast } = useToast();

  const [idInsumo, setIdInsumo] = useState<number>(preselectedInsumoId || (insumos[0]?.id ?? 0));
  const [idAlmacen, setIdAlmacen] = useState<string>("");

  const hoy = new Date();
  const haceUnMes = new Date();
  haceUnMes.setMonth(haceUnMes.getMonth() - 1);

  const [fechaInicio, setFechaInicio] = useState(haceUnMes.toISOString().split("T")[0]);
  const [fechaFin, setFechaFin] = useState(hoy.toISOString().split("T")[0]);

  const [fetchKardex, { data: kardex, isLoading, isFetching }] = useLazyGetKardexQuery();

  useEffect(() => {
    if (preselectedInsumoId) {
      setIdInsumo(preselectedInsumoId);
      fetchKardex({
        idInsumo: preselectedInsumoId,
        idAlmacen: idAlmacen ? Number(idAlmacen) : undefined,
        fechaInicio: `${fechaInicio}T00:00:00`,
        fechaFin: `${fechaFin}T23:59:59`,
      });
    } else if (insumos.length > 0 && !idInsumo) {
      setIdInsumo(insumos[0].id);
    }
  }, [preselectedInsumoId, insumos]);

  const handleConsultar = () => {
    if (!idInsumo) {
      addToast({ message: "Seleccione un insumo para consultar su kárdex", variant: "error" });
      return;
    }

    fetchKardex({
      idInsumo,
      idAlmacen: idAlmacen ? Number(idAlmacen) : undefined,
      fechaInicio: `${fechaInicio}T00:00:00`,
      fechaFin: `${fechaFin}T23:59:59`,
    });
  };

  const handleExportarCSV = () => {
    if (!kardex || !kardex.movimientos.length) {
      addToast({ message: "No hay movimientos para exportar", variant: "error" });
      return;
    }

    const headers = [
      "Fecha y Hora",
      "Almacén",
      "Insumo",
      "Código",
      "Tipo Movimiento",
      "Submotivo",
      "Doc. Referencia",
      "Cantidad",
      "Unidad",
      "Costo Unitario",
      "Costo Total",
      "Saldo Anterior",
      "Saldo Nuevo",
      "CPP Resultante",
      "Usuario",
      "Observaciones",
    ];

    const rows = kardex.movimientos.map((m) => [
      `"${new Date(m.fechaHora).toLocaleString("es-MX")}"`,
      `"${m.almacenNombre}"`,
      `"${m.insumoNombre}"`,
      `"${m.insumoCodigo}"`,
      `"${m.tipoMovimiento}"`,
      `"${m.submotivo || ""}"`,
      `"${m.documentoReferencia || ""}"`,
      m.cantidad,
      `"${m.unidadMedidaCodigo}"`,
      m.costoUnitario,
      m.costoTotal,
      m.saldoAnterior,
      m.saldoNuevo,
      m.costoPromedioResultante,
      `"${m.usuarioNombre || ""}"`,
      `"${(m.observaciones || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Kardex_${kardex.insumoCodigo}_${fechaInicio}_${fechaFin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ message: "Kárdex exportado a CSV con éxito", variant: "success" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Controles de Consulta */}
      <div className="inv-filters-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", flex: 1 }}>
          <div style={{ minWidth: "220px", flex: 1 }}>
            <label className="inv-form-label" style={{ display: "block", marginBottom: "0.25rem" }}>Insumo *</label>
            <select
              className="inv-select"
              style={{ width: "100%" }}
              value={idInsumo}
              onChange={(e) => setIdInsumo(Number(e.target.value))}
            >
              <option value="">Seleccione un insumo</option>
              {insumos.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.codigo} - {i.nombre} ({i.unidadMedidaCodigo})
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: "180px" }}>
            <label className="inv-form-label" style={{ display: "block", marginBottom: "0.25rem" }}>Almacén</label>
            <select
              className="inv-select"
              style={{ width: "100%" }}
              value={idAlmacen}
              onChange={(e) => setIdAlmacen(e.target.value)}
            >
              <option value="">Todos los Almacenes</option>
              {almacenes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="inv-form-label" style={{ display: "block", marginBottom: "0.25rem" }}>Fecha Desde</label>
            <input
              type="date"
              className="inv-form-input"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          <div>
            <label className="inv-form-label" style={{ display: "block", marginBottom: "0.25rem" }}>Fecha Hasta</label>
            <input
              type="date"
              className="inv-form-input"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <Button
            variant="primary"
            onClick={handleConsultar}
            disabled={isLoading || isFetching || !idInsumo}
            leftIcon={<Filter size={16} />}
          >
            {isFetching ? "Consultando..." : "Consultar Kárdex"}
          </Button>

          <Button
            variant="secondary"
            onClick={handleExportarCSV}
            disabled={!kardex || !kardex.movimientos.length}
            leftIcon={<Download size={16} />}
          >
            Descargar CSV
          </Button>
        </div>
      </div>

      {/* Resumen de Balance del Kárdex */}
      {kardex && (
        <div className="inv-kpi-grid">
          <div className="inv-kpi-card">
            <div className="inv-kpi-icon" style={{ background: "rgba(107, 114, 128, 0.12)", color: "#4b5563" }}>
              <BookOpen size={20} />
            </div>
            <div className="inv-kpi-info">
              <span className="inv-kpi-label">Saldo Inicial</span>
              <span className="inv-kpi-value">
                {kardex.saldoInicial.toFixed(2)} {kardex.unidadMedida}
              </span>
            </div>
          </div>

          <div className="inv-kpi-card">
            <div className="inv-kpi-icon" style={{ background: "rgba(60, 141, 64, 0.12)", color: "#3c8d40" }}>
              <ArrowUpRight size={20} />
            </div>
            <div className="inv-kpi-info">
              <span className="inv-kpi-label">Total Entradas</span>
              <span className="inv-kpi-value" style={{ color: "#3c8d40" }}>
                +{kardex.totalEntradas.toFixed(2)} {kardex.unidadMedida}
              </span>
            </div>
          </div>

          <div className="inv-kpi-card">
            <div className="inv-kpi-icon" style={{ background: "rgba(214, 69, 69, 0.12)", color: "#d64545" }}>
              <ArrowDownRight size={20} />
            </div>
            <div className="inv-kpi-info">
              <span className="inv-kpi-label">Total Salidas / Mermas</span>
              <span className="inv-kpi-value" style={{ color: "#d64545" }}>
                -{kardex.totalSalidas.toFixed(2)} {kardex.unidadMedida}
              </span>
            </div>
          </div>

          <div className="inv-kpi-card">
            <div className="inv-kpi-icon" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
              <Sliders size={20} />
            </div>
            <div className="inv-kpi-info">
              <span className="inv-kpi-label">Saldo Final (CPP ${kardex.costoPromedioFinal.toFixed(2)})</span>
              <span className="inv-kpi-value">
                {kardex.saldoFinal.toFixed(2)} {kardex.unidadMedida}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabla Cronológica del Kárdex */}
      <div className="inv-table-card">
        <div className="inv-table-wrapper">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Almacén</th>
                <th>Tipo de Movimiento</th>
                <th>Motivo / Referencia</th>
                <th style={{ textAlign: "right" }}>Cantidad</th>
                <th style={{ textAlign: "right" }}>Costo Unit.</th>
                <th style={{ textAlign: "right" }}>Costo Total</th>
                <th style={{ textAlign: "right" }}>Saldo Anterior</th>
                <th style={{ textAlign: "right" }}>Saldo Nuevo</th>
                <th style={{ textAlign: "right" }}>CPP Resultante</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {!kardex ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted, #6b7280)" }}>
                    Selecciona un insumo y presiona "Consultar Kárdex" para visualizar los movimientos.
                  </td>
                </tr>
              ) : kardex.movimientos.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted, #6b7280)" }}>
                    No se registraron movimientos para este insumo en el rango de fechas seleccionado.
                  </td>
                </tr>
              ) : (
                kardex.movimientos.map((m) => {
                  const isEntrada =
                    m.tipoMovimiento === "EntradaManual" ||
                    m.tipoMovimiento === "TraspasoEntrada" ||
                    (m.tipoMovimiento === "AjusteInventario" && m.saldoNuevo >= m.saldoAnterior);
                  return (
                    <tr key={m.id}>
                      <td style={{ whiteSpace: "nowrap", fontSize: "0.825rem" }}>
                        {new Date(m.fechaHora).toLocaleString("es-MX", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td style={{ fontWeight: 500 }}>{m.almacenNombre}</td>
                      <td>
                        <span
                          className={`inv-badge ${
                            isEntrada ? "inv-badge-normal" : "inv-badge-agotado"
                          }`}
                        >
                          {m.tipoMovimiento}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{m.submotivo || "—"}</div>
                        {m.documentoReferencia && (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                            Ref: {m.documentoReferencia}
                          </span>
                        )}
                        {m.observaciones && (
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)", fontStyle: "italic" }}>
                            {m.observaciones}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>
                        <span className={isEntrada ? "inv-mov-entrada" : "inv-mov-salida"}>
                          {isEntrada ? "+" : "-"}
                          {m.cantidad.toFixed(2)} {m.unidadMedidaCodigo}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>${m.costoUnitario.toFixed(2)}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>${m.costoTotal.toFixed(2)}</td>
                      <td style={{ textAlign: "right", color: "var(--color-text-muted, #6b7280)" }}>
                        {m.saldoAnterior.toFixed(2)}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>
                        {m.saldoNuevo.toFixed(2)} {m.unidadMedidaCodigo}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600, color: "var(--color-primary, #d64545)" }}>
                        ${m.costoPromedioResultante.toFixed(2)}
                      </td>
                      <td style={{ fontSize: "0.825rem", color: "var(--color-text-muted, #6b7280)" }}>
                        {m.usuarioNombre || "Sistema"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
