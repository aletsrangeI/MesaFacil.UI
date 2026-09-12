import { useState } from "react";
import {
  useGetComprasQuery,
  useGetKpisComprasQuery,
  useGetCompraPorIdQuery,
  useAplicarCompraMutation,
  useCancelarCompraMutation,
  useGetProveedoresQuery,
  type CompraItemResumen,
} from "../../services/comprasApi";
import { useGetCatalogosBaseInventarioQuery } from "../../services/inventarioApi";
import { useToast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button/Button";
import { Modal } from "../../components/modal/Modal";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Download,
  Copy,
  Layers,
  ShieldAlert,
} from "lucide-react";

export function HistorialComprasTab() {
  const { addToast } = useToast();

  // Filters State
  const [buscar, setBuscar] = useState("");
  const [filtroSucursal, setFiltroSucursal] = useState<number | undefined>();
  const [filtroAlmacen, setFiltroAlmacen] = useState<number | undefined>();
  const [filtroProveedor, setFiltroProveedor] = useState<number | undefined>();
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Queries
  const { data: catalogos } = useGetCatalogosBaseInventarioQuery();
  const { data: proveedores = [] } = useGetProveedoresQuery();
  const sucursales = catalogos?.sucursales ?? [];
  const almacenes = catalogos?.almacenes ?? [];

  const { data: kpis } = useGetKpisComprasQuery(
    filtroSucursal ? { idSucursal: filtroSucursal } : undefined
  );

  const { data: compras = [], isLoading, refetch } = useGetComprasQuery({
    idSucursal: filtroSucursal,
    idAlmacen: filtroAlmacen,
    idProveedor: filtroProveedor,
    estado: filtroEstado !== "Todos" ? filtroEstado : undefined,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
    buscar: buscar || undefined,
  });

  // Mutations
  const [aplicarCompra, { isLoading: isAplicando }] = useAplicarCompraMutation();
  const [cancelarCompra, { isLoading: isCancelando }] = useCancelarCompraMutation();

  // Modal Detalle
  const [detalleId, setDetalleId] = useState<number | null>(null);

  // Modal Cancelar
  const [cancelarTarget, setCancelarTarget] = useState<CompraItemResumen | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  const handleAplicar = async (c: CompraItemResumen) => {
    if (!window.confirm(`¿Aprobar y aplicar la factura ${c.serie || ""}${c.folio} al inventario?`)) {
      return;
    }
    try {
      await aplicarCompra(c.id).unwrap();
      addToast({ variant: "success", message: "Factura aplicada correctamente. Kárdex actualizado." });
      refetch();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al aplicar la factura.";
      addToast({ variant: "error", message: errorMsg });
    }
  };

  const handleConfirmCancelar = async () => {
    if (!cancelarTarget) return;
    try {
      await cancelarCompra({
        id: cancelarTarget.id,
        motivo: motivoCancelacion.trim() || "Cancelación por usuario",
      }).unwrap();
      addToast({ variant: "success", message: "Factura cancelada y existencias reversadas." });
      setCancelarTarget(null);
      setMotivoCancelacion("");
      refetch();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al cancelar la factura.";
      addToast({ variant: "error", message: errorMsg });
    }
  };

  const exportarCsv = () => {
    if (compras.length === 0) {
      addToast({ variant: "error", message: "No hay compras para exportar." });
      return;
    }

    const headers = [
      "ID",
      "Serie",
      "Folio",
      "UUID SAT",
      "Fecha Emisión",
      "Fecha Recepción",
      "Proveedor",
      "RFC",
      "Sucursal",
      "Almacén",
      "Es Crédito",
      "Días Crédito",
      "Vencimiento",
      "Partidas",
      "Total (MXN)",
      "Estado",
    ];

    const rows = compras.map((c) => [
      c.id,
      c.serie || "",
      c.folio,
      c.uuid || "",
      c.fechaEmision?.substring(0, 10),
      c.fechaRecepcion?.substring(0, 10),
      `"${c.proveedorRazonSocial.replace(/"/g, '""')}"`,
      c.proveedorRFC,
      `"${c.sucursalNombre}"`,
      `"${c.almacenNombre}"`,
      c.esCredito ? "Sí" : "No",
      c.diasCredito || 0,
      c.fechaVencimiento?.substring(0, 10) || "",
      c.cantidadPartidas,
      c.total.toFixed(2),
      c.estado,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `compras_mesafacil_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="compras-stack">
      {/* KPIs Cards */}
      <div className="compras-kpis-grid">
        <div className="compras-kpi-card">
          <div className="compras-kpi-icon" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
            <DollarSign size={22} />
          </div>
          <div className="compras-kpi-info">
            <span className="compras-kpi-label">Total Compras del Mes</span>
            <span className="compras-kpi-value">
              ${kpis?.totalComprasMes?.toLocaleString("es-MX", { minimumFractionDigits: 2 }) || "0.00"}
            </span>
            <span style={{ fontSize: "0.725rem", color: "var(--color-text-muted)", marginTop: 2 }}>
              {kpis?.totalFacturasMes || 0} facturas procesadas
            </span>
          </div>
        </div>

        <div className="compras-kpi-card">
          <div className="compras-kpi-icon" style={{ background: "rgba(60, 141, 64, 0.12)", color: "#3c8d40" }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="compras-kpi-info">
            <span className="compras-kpi-label">Facturas Aplicadas</span>
            <span className="compras-kpi-value" style={{ color: "var(--color-success, #3c8d40)" }}>
              {kpis?.facturasAplicadas || 0}
            </span>
            <span style={{ fontSize: "0.725rem", color: "var(--color-text-muted)", marginTop: 2 }}>
              Ingresadas al Kárdex
            </span>
          </div>
        </div>

        <div className="compras-kpi-card">
          <div className="compras-kpi-icon" style={{ background: "rgba(226, 167, 46, 0.14)", color: "#b45309" }}>
            <Clock size={22} />
          </div>
          <div className="compras-kpi-info">
            <span className="compras-kpi-label">Facturas en Borrador</span>
            <span className="compras-kpi-value" style={{ color: "#b45309" }}>
              {kpis?.facturasBorrador || 0}
            </span>
            <span style={{ fontSize: "0.725rem", color: "var(--color-text-muted)", marginTop: 2 }}>
              Pendientes de ingreso físico
            </span>
          </div>
        </div>

        <div className="compras-kpi-card">
          <div className="compras-kpi-icon" style={{ background: "rgba(147, 51, 234, 0.12)", color: "#9333ea" }}>
            <Layers size={22} />
          </div>
          <div className="compras-kpi-info">
            <span className="compras-kpi-label">Pasivos a Crédito (CxP)</span>
            <span className="compras-kpi-value" style={{ color: "#9333ea" }}>
              ${kpis?.totalCreditoPendiente?.toLocaleString("es-MX", { minimumFractionDigits: 2 }) || "0.00"}
            </span>
            <span style={{ fontSize: "0.725rem", color: "var(--color-text-muted)", marginTop: 2 }}>
              {kpis?.facturasPendientesPago || 0} facturas con plazo pactado
            </span>
          </div>
        </div>
      </div>

      {/* Barra y Panel de Filtros Unificados */}
      <div className="compras-section">
        <div className="compras-section-header">
          <div className="compras-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por Folio, UUID SAT o Proveedor..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="compras-search-input"
            />
          </div>

          <div className="compras-filter-group">
            <Button
              type="button"
              variant="secondary"
              onClick={exportarCsv}
              leftIcon={<Download size={16} />}
            >
              Exportar CSV
            </Button>
          </div>
        </div>

        <div className="compras-form-grid">
          {/* Sucursal */}
          <div className="compras-form-group">
            <label className="compras-form-label">Sucursal</label>
            <select
              value={filtroSucursal || 0}
              onChange={(e) =>
                setFiltroSucursal(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : undefined)
              }
              className="compras-form-select"
            >
              <option value={0}>Todas las sucursales</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Almacén */}
          <div className="compras-form-group">
            <label className="compras-form-label">Almacén</label>
            <select
              value={filtroAlmacen || 0}
              onChange={(e) =>
                setFiltroAlmacen(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : undefined)
              }
              className="compras-form-select"
            >
              <option value={0}>Todos los almacenes</option>
              {almacenes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Proveedor */}
          <div className="compras-form-group">
            <label className="compras-form-label">Proveedor</label>
            <select
              value={filtroProveedor || 0}
              onChange={(e) =>
                setFiltroProveedor(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : undefined)
              }
              className="compras-form-select"
            >
              <option value={0}>Todos los proveedores</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.razonSocial}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="compras-form-group">
            <label className="compras-form-label">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="compras-form-select"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Aplicada">Aplicada (En almacén)</option>
              <option value="Borrador">Borrador</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          {/* Rango de fechas */}
          <div className="compras-form-group">
            <label className="compras-form-label">Fecha Desde</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="compras-form-input"
            />
          </div>

          <div className="compras-form-group">
            <label className="compras-form-label">Fecha Hasta</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="compras-form-input"
            />
          </div>
        </div>
      </div>

      {/* Tabla de Facturas */}
      <div className="compras-table-card">
        <div className="compras-table-wrapper">
          <table className="compras-table">
            <thead>
              <tr>
                <th>Folio / Serie</th>
                <th>UUID SAT</th>
                <th>Emisión</th>
                <th>Proveedor</th>
                <th>Destino</th>
                <th>Condición</th>
                <th className="compras-col-center">Partidas</th>
                <th className="compras-col-right">Total Factura</th>
                <th>Estado</th>
                <th className="compras-col-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="compras-table-loading">
                    Cargando historial de compras...
                  </td>
                </tr>
              ) : compras.length === 0 ? (
                <tr>
                  <td colSpan={10} className="compras-table-empty">
                    No se encontraron facturas o entradas registradas.
                  </td>
                </tr>
              ) : (
                compras.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {c.serie ? `${c.serie}-` : ""}
                        {c.folio}
                      </div>
                      <div className="compras-text-subtle">ID #{c.id}</div>
                    </td>

                    <td>
                      {c.uuid ? (
                        <div className="compras-inline-row" style={{ gap: "0.35rem" }}>
                          <span className="compras-code-pill">
                            {c.uuid.substring(0, 8)}...
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(c.uuid || "");
                              addToast({ variant: "success", message: "UUID copiado" });
                            }}
                            className="compras-icon-btn"
                            title={c.uuid}
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      ) : (
                        <span className="compras-text-subtle" style={{ fontStyle: "italic" }}>Sin CFDI (Manual)</span>
                      )}
                    </td>

                    <td>
                      <div style={{ fontSize: "0.825rem" }}>
                        {c.fechaEmision?.substring(0, 10)}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: "0.825rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.proveedorRazonSocial}
                      </div>
                      <div className="compras-text-subtle" style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>{c.proveedorRFC}</div>
                    </td>

                    <td>
                      <div style={{ fontSize: "0.825rem", fontWeight: 500 }}>{c.almacenNombre}</div>
                      <div className="compras-text-subtle">{c.sucursalNombre}</div>
                    </td>

                    <td>
                      {c.esCredito ? (
                        <div>
                          <span className="compras-badge compras-badge--info">
                            <Clock size={12} />
                            Crédito {c.diasCredito}d
                          </span>
                          {c.fechaVencimiento && (
                            <div className="compras-text-subtle">
                              Vence: {c.fechaVencimiento.substring(0, 10)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="compras-badge compras-badge--success">Contado</span>
                      )}
                    </td>

                    <td className="compras-col-center" style={{ fontWeight: 600, fontSize: "0.825rem" }}>
                      {c.cantidadPartidas}
                    </td>

                    <td className="compras-col-right" style={{ fontFamily: "SFMono-Regular, Consolas, monospace", fontWeight: 700, fontSize: "0.85rem" }}>
                      ${c.total?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>

                    <td>
                      {c.estado === "Aplicada" ? (
                        <span className="compras-badge compras-badge--success">
                          <CheckCircle2 size={12} /> Aplicada
                        </span>
                      ) : c.estado === "Borrador" ? (
                        <span className="compras-badge compras-badge--warning">
                          <Clock size={12} /> Borrador
                        </span>
                      ) : (
                        <span className="compras-badge compras-badge--danger">
                          <XCircle size={12} /> Cancelada
                        </span>
                      )}
                    </td>

                    <td className="compras-col-right">
                      <div className="compras-table-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconOnly
                          leftIcon={<Eye size={16} />}
                          onClick={() => setDetalleId(c.id)}
                          title="Ver detalle de partidas"
                          aria-label="Ver detalle"
                        />

                        {c.estado === "Borrador" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconOnly
                            disabled={isAplicando}
                            leftIcon={<CheckCircle2 size={16} color="var(--color-success, #3c8d40)" />}
                            onClick={() => handleAplicar(c)}
                            title="Aprobar e ingresar al almacén"
                            aria-label="Aprobar"
                          />
                        )}

                        {c.estado !== "Cancelada" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconOnly
                            disabled={isCancelando}
                            leftIcon={<XCircle size={16} color="var(--color-danger, #d64545)" />}
                            onClick={() => setCancelarTarget(c)}
                            title="Cancelar factura"
                            aria-label="Cancelar"
                          />
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

      {/* Modal Detalle de Factura */}
      {detalleId && (
        <ModalDetalleCompra idCompra={detalleId} onClose={() => setDetalleId(null)} />
      )}

      {/* Modal Confirmar Cancelación */}
      {cancelarTarget && (
        <Modal
          open={Boolean(cancelarTarget)}
          onClose={() => setCancelarTarget(null)}
          title="Cancelar Factura de Compra"
          description={`Folio: ${cancelarTarget.serie || ""}${cancelarTarget.folio} - ${cancelarTarget.proveedorRazonSocial}`}
          size="md"
          footer={
            <div className="compras-form-actions">
              <Button variant="secondary" onClick={() => setCancelarTarget(null)}>
                Volver
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmCancelar}
                disabled={!motivoCancelacion.trim() || isCancelando}
                style={{ backgroundColor: "var(--color-danger, #d64545)" }}
              >
                Confirmar Cancelación
              </Button>
            </div>
          }
        >
          <div className="compras-stack" style={{ gap: "1rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text)", margin: 0 }}>
              ¿Estás seguro de cancelar la factura <strong>{cancelarTarget.serie || ""}{cancelarTarget.folio}</strong> de <strong>{cancelarTarget.proveedorRazonSocial}</strong>?
            </p>
            {cancelarTarget.estado === "Aplicada" && (
              <div className="compras-alert compras-alert--warning">
                <ShieldAlert size={20} className="compras-alert-icon" />
                <div className="compras-alert-body">
                  <h4 className="compras-alert-title">Aviso de reversa en Kárdex</h4>
                  <p className="compras-alert-text">
                    La factura se encuentra aplicada; al cancelarla se descontará automáticamente el stock de los insumos en el almacén y se registrará un movimiento de cancelación en el Kárdex.
                  </p>
                </div>
              </div>
            )}
            <div className="compras-form-group">
              <label className="compras-form-label">
                Motivo de Cancelación *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ej. Devolución de mercancía al proveedor / Error en captura de folio..."
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="compras-form-textarea"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ModalDetalleCompra({
  idCompra,
  onClose,
}: {
  idCompra: number;
  onClose: () => void;
}) {
  const { data: compra, isLoading } = useGetCompraPorIdQuery(idCompra);

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Detalle de Factura: ${compra?.serie || ""}${compra?.folio || ""}`}
      description={compra ? `Proveedor: ${compra.proveedorRazonSocial} (${compra.proveedorRFC})` : "Cargando..."}
      size="lg"
      footer={
        <div className="compras-form-actions">
          <Button onClick={onClose} variant="secondary">
            Cerrar
          </Button>
        </div>
      }
    >
      {isLoading || !compra ? (
        <div className="compras-table-loading">Cargando detalle de la factura...</div>
      ) : (
        <div className="compras-stack" style={{ gap: "1.25rem" }}>
          {/* Metadatos Generales */}
          <div className="compras-meta-grid">
            <div className="compras-meta-item">
              <span className="compras-meta-label">ESTADO</span>
              <span className="compras-meta-value">{compra.estado}</span>
            </div>
            <div className="compras-meta-item">
              <span className="compras-meta-label">FECHA EMISIÓN</span>
              <span className="compras-meta-value">{compra.fechaEmision?.substring(0, 10)}</span>
            </div>
            <div className="compras-meta-item">
              <span className="compras-meta-label">DESTINO</span>
              <span className="compras-meta-value">{compra.almacenNombre}</span>
            </div>
            <div className="compras-meta-item">
              <span className="compras-meta-label">CONDICIÓN</span>
              <span className="compras-meta-value">
                {compra.esCredito ? `Crédito ${compra.diasCredito} días` : "Contado"}
              </span>
            </div>
            {compra.uuid && (
              <div className="compras-meta-item compras-meta-item--full">
                <span className="compras-meta-label">FOLIO FISCAL (UUID)</span>
                <span className="compras-meta-value compras-meta-value--mono">{compra.uuid}</span>
              </div>
            )}
          </div>

          {/* Partidas */}
          <div className="compras-table-card">
            <div className="compras-table-wrapper">
              <table className="compras-table">
                <thead>
                  <tr>
                    <th>Insumo Recibido</th>
                    <th className="compras-col-center">Cant. Compra</th>
                    <th className="compras-col-center">Factor</th>
                    <th className="compras-col-center">Ingreso Kárdex</th>
                    <th className="compras-col-right">Costo Unit.</th>
                    <th className="compras-col-right">IVA</th>
                    <th className="compras-col-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {compra.detalles.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{d.insumoNombre}</div>
                        {d.descripcionOriginal && (
                          <div className="compras-text-subtle">{d.descripcionOriginal}</div>
                        )}
                      </td>
                      <td className="compras-col-center" style={{ fontWeight: 500 }}>
                        {d.cantidad} {d.unidadSAT || ""}
                      </td>
                      <td className="compras-col-center" style={{ fontFamily: "SFMono-Regular, Consolas, monospace", color: "var(--color-text-muted)" }}>
                        x{d.factorConversion}
                      </td>
                      <td className="compras-col-center" style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                        {d.cantidadInsumo} {d.unidadMedidaNombre}
                      </td>
                      <td className="compras-col-right" style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>
                        ${d.costoUnitario.toFixed(2)}
                      </td>
                      <td className="compras-col-right" style={{ fontFamily: "SFMono-Regular, Consolas, monospace", color: "var(--color-text-muted)" }}>
                        ${d.importeIVA.toFixed(2)}
                      </td>
                      <td className="compras-col-right" style={{ fontFamily: "SFMono-Regular, Consolas, monospace", fontWeight: 700 }}>
                        ${d.importeTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen Financiero */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="compras-resumen" style={{ minWidth: 320 }}>
              <div className="compras-resumen-row">
                <span>Subtotal:</span>
                <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${compra.subtotal.toFixed(2)}</span>
              </div>
              {compra.totalDescuento > 0 && (
                <div className="compras-resumen-row compras-resumen-row--danger">
                  <span>Descuentos:</span>
                  <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>-${compra.totalDescuento.toFixed(2)}</span>
                </div>
              )}
              <div className="compras-resumen-row">
                <span>IVA Trasladado:</span>
                <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${compra.totalIVA.toFixed(2)}</span>
              </div>
              {compra.totalIEPS > 0 && (
                <div className="compras-resumen-row">
                  <span>IEPS:</span>
                  <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${compra.totalIEPS.toFixed(2)}</span>
                </div>
              )}
              <div className="compras-resumen-row compras-resumen-row--total">
                <span>Total Factura:</span>
                <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${compra.total.toFixed(2)} MXN</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
