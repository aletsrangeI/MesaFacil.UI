import React, { useState } from "react";
import {
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  DollarSign,
  Eye,
  Receipt,
  RotateCcw,
} from "lucide-react";
import {
  useGetCuentasPorPagarQuery,
  useGetKpisCxPQuery,
  type CuentaPorPagarItem,
  type FiltroCxP,
} from "../../services/cxpApi";
import { useGetProveedoresQuery } from "../../services/comprasApi";
import { Button } from "../../components/ui/button/Button";
import { ModalRegistrarAbono } from "./ModalRegistrarAbono";
import { ModalDetalleCxP } from "./ModalDetalleCxP";

interface CxPDashboardTabProps {
  idSucursal?: number;
}

export const CxPDashboardTab: React.FC<CxPDashboardTabProps> = ({ idSucursal }) => {
  const [filtro, setFiltro] = useState<FiltroCxP>({
    idSucursal,
    estado: "Todos",
    semaforo: "Todos",
    buscar: "",
  });

  const [cuentaAbonar, setCuentaAbonar] = useState<CuentaPorPagarItem | null>(null);
  const [idCuentaDetalle, setIdCuentaDetalle] = useState<number | null>(null);

  const { data: kpis } = useGetKpisCxPQuery(idSucursal);
  const {
    data: cuentas = [],
    isLoading: isLoadingCuentas,
    refetch,
  } = useGetCuentasPorPagarQuery(filtro);
  const { data: proveedores = [] } = useGetProveedoresQuery();

  const formatMxn = (val: number) =>
    `$${val.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const renderSemaforo = (c: CuentaPorPagarItem) => {
    if (c.estado === "Pagada") {
      return (
        <span className="cxp-semaforo-badge al-corriente">
          <CheckCircle2 size={13} /> Liquidada
        </span>
      );
    }
    if (c.estado === "Cancelada") {
      return (
        <span className="cxp-status-badge cancelada">
          Cancelada
        </span>
      );
    }
    if (c.semaforo === "Vencida") {
      return (
        <span className="cxp-semaforo-badge vencida">
          <AlertTriangle size={13} /> {Math.abs(c.diasParaVencer)}d de retraso
        </span>
      );
    }
    if (c.semaforo === "PorVencer") {
      return (
        <span className="cxp-semaforo-badge por-vencer">
          <Clock size={13} /> Vence en {c.diasParaVencer}d
        </span>
      );
    }
    return (
      <span className="cxp-semaforo-badge al-corriente">
        <CheckCircle2 size={13} /> Al corriente ({c.diasParaVencer}d)
      </span>
    );
  };

  return (
    <div className="cxp-stack">
      {/* 4 KPIs Clave de Tesorería */}
      <div className="cxp-kpis-grid">
        <div className="cxp-kpi-card">
          <div className="cxp-kpi-icon info">
            <CreditCard size={24} />
          </div>
          <div className="cxp-kpi-content">
            <span className="cxp-kpi-label">Saldo Total por Pagar</span>
            <span className="cxp-kpi-value">
              {kpis ? formatMxn(kpis.totalPorPagar) : "$0.00"}
            </span>
            <span className="cxp-kpi-sub">
              {kpis ? `${kpis.cantidadPendientes} facturas con saldo vivo` : "Cargando..."}
            </span>
          </div>
        </div>

        <div className="cxp-kpi-card">
          <div className="cxp-kpi-icon danger">
            <AlertTriangle size={24} />
          </div>
          <div className="cxp-kpi-content">
            <span className="cxp-kpi-label">Vencido Hoy / Anterior</span>
            <span className="cxp-kpi-value" style={{ color: "var(--color-danger, #d64545)" }}>
              {kpis ? formatMxn(kpis.totalVencido) : "$0.00"}
            </span>
            <span className="cxp-kpi-sub">
              {kpis ? `${kpis.cantidadVencidas} facturas en mora crítica` : "Cargando..."}
            </span>
          </div>
        </div>

        <div className="cxp-kpi-card">
          <div className="cxp-kpi-icon warning">
            <Clock size={24} />
          </div>
          <div className="cxp-kpi-content">
            <span className="cxp-kpi-label">Vence esta Semana</span>
            <span className="cxp-kpi-value" style={{ color: "#d97706" }}>
              {kpis ? formatMxn(kpis.totalVenceEstaSemana) : "$0.00"}
            </span>
            <span className="cxp-kpi-sub">Próximos 7 días hábiles</span>
          </div>
        </div>

        <div className="cxp-kpi-card">
          <div className="cxp-kpi-icon success">
            <DollarSign size={24} />
          </div>
          <div className="cxp-kpi-content">
            <span className="cxp-kpi-label">Abonado en el Mes</span>
            <span className="cxp-kpi-value" style={{ color: "var(--color-success, #3c8d40)" }}>
              {kpis ? formatMxn(kpis.totalPagadoMes) : "$0.00"}
            </span>
            <span className="cxp-kpi-sub">Egresos efectivos aplicados</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="cxp-filters-bar">
        <div className="cxp-search-input">
          <Search size={16} color="var(--color-text-muted, #6b7280)" />
          <input
            type="text"
            placeholder="Buscar por folio, UUID, RFC o nombre de proveedor..."
            value={filtro.buscar || ""}
            onChange={(e) => setFiltro({ ...filtro, buscar: e.target.value })}
          />
        </div>

        <div className="cxp-filter-group">
          {/* Semáforo */}
          <select
            className="cxp-select"
            value={filtro.semaforo || "Todos"}
            onChange={(e) => setFiltro({ ...filtro, semaforo: e.target.value })}
          >
            <option value="Todos">Semáforo: Todos</option>
            <option value="Vencida">Rojo (Vencidas)</option>
            <option value="PorVencer">Ámbar (Próximas 7 días)</option>
            <option value="AlCorriente">Verde (Al corriente)</option>
          </select>

          {/* Estado */}
          <select
            className="cxp-select"
            value={filtro.estado || "Todos"}
            onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
          >
            <option value="Todos">Estado: Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Abonada">Abonada</option>
            <option value="Pagada">Pagada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          {/* Proveedor */}
          <select
            className="cxp-select"
            value={filtro.idProveedor || ""}
            onChange={(e) =>
              setFiltro({
                ...filtro,
                idProveedor: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
          >
            <option value="">Proveedor: Todos</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.razonSocial}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setFiltro({
                idSucursal,
                estado: "Todos",
                semaforo: "Todos",
                buscar: "",
              })
            }
            leftIcon={<RotateCcw size={14} />}
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* Tabla de Cuentas por Pagar */}
      <div className="cxp-card-table">
        <div className="cxp-table-wrapper">
          <table className="cxp-table">
            <thead>
              <tr>
                <th>Semáforo</th>
                <th>Proveedor / RFC</th>
                <th>Factura / Folio</th>
                <th>Vencimiento</th>
                <th>Monto Total</th>
                <th>Saldo Pendiente</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingCuentas ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem" }}>
                    Cargando cuentas por pagar...
                  </td>
                </tr>
              ) : cuentas.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "var(--color-text-muted, #6b7280)",
                    }}
                  >
                    <Receipt size={36} style={{ margin: "0 auto 0.75rem auto", opacity: 0.5 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      No se encontraron cuentas por pagar con los filtros seleccionados.
                    </p>
                  </td>
                </tr>
              ) : (
                cuentas.map((c) => (
                  <tr key={c.id}>
                    <td>{renderSemaforo(c)}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600 }}>{c.proveedorRazonSocial}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                          RFC: {c.proveedorRFC}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600 }}>
                          {c.facturaSerie || ""}
                          {c.facturaFolio || `CxP #${c.id}`}
                        </span>
                        {c.facturaUUID && (
                          <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted, #6b7280)" }}>
                            UUID: {c.facturaUUID.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{new Date(c.fechaVencimiento).toLocaleDateString("es-MX")}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
                          Plazo: {c.diasCredito} días
                        </span>
                      </div>
                    </td>
                    <td>{formatMxn(c.montoTotal)}</td>
                    <td>
                      <strong
                        style={{
                          color:
                            c.saldoInsoluto > 0
                              ? "var(--color-primary, #d64545)"
                              : "var(--color-success, #3c8d40)",
                        }}
                      >
                        {formatMxn(c.saldoInsoluto)}
                      </strong>
                    </td>
                    <td>
                      <span className={`cxp-status-badge ${c.estado.toLowerCase()}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setIdCuentaDetalle(c.id)}
                          leftIcon={<Eye size={14} />}
                        >
                          Ver
                        </Button>

                        {c.saldoInsoluto > 0 && c.estado !== "Cancelada" && (
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => setCuentaAbonar(c)}
                            leftIcon={<CreditCard size={14} />}
                          >
                            Abonar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Abono */}
      {cuentaAbonar && (
        <ModalRegistrarAbono
          cuenta={cuentaAbonar}
          onClose={() => setCuentaAbonar(null)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Modal de Detalle */}
      {idCuentaDetalle !== null && (
        <ModalDetalleCxP
          idCuenta={idCuentaDetalle}
          onClose={() => setIdCuentaDetalle(null)}
          onAbonarClick={() => {
            const cta = cuentas.find((x) => x.id === idCuentaDetalle);
            if (cta) setCuentaAbonar(cta);
          }}
        />
      )}
    </div>
  );
};
