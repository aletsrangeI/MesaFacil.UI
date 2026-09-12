import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../../../components/ui/layout/Container';
import { Button } from '../../../../components/ui/button/Button';
import {
  useGetDeliveryHistorialQuery,
  type DeliveryHistorialItem,
} from '../../../../services/deliveryApi';
import { useSucursalesGetAllQuery, useCatalogosGetAllQuery } from '../../../../services/generated/api';
import { DeliveryAuditoriaModal } from './DeliveryAuditoriaModal';
import {
  PackageCheck,
  Kanban,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  Search,
  Bike,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import './delivery-historial.css';

export default function DeliveryHistorialPage() {
  const hoyStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [presetFecha, setPresetFecha] = useState<'hoy' | 'ayer' | 'semana' | 'mes' | 'custom'>('hoy');
  const [fechaCustomInicio, setFechaCustomInicio] = useState(hoyStr);
  const [fechaCustomFin, setFechaCustomFin] = useState(hoyStr);

  const [selectedSucursal, setSelectedSucursal] = useState<number | undefined>(undefined);
  const [filtroCanal, setFiltroCanal] = useState<string>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // Modal de auditoría
  const [selectedPedido, setSelectedPedido] = useState<DeliveryHistorialItem | null>(null);
  const [showAuditoriaModal, setShowAuditoriaModal] = useState(false);

  // Sucursales y Canales de Venta
  const { data: sucursalesData } = useSucursalesGetAllQuery();
  const sucursales = Array.isArray(sucursalesData?.data) ? sucursalesData.data : [];

  const { data: canalesData } = useCatalogosGetAllQuery({ catalog: 'canales-venta' });
  const canalesOpciones = useMemo(() => {
    const list = Array.isArray((canalesData as any)?.data)
      ? (canalesData as any).data
          .filter((c: any) => !c.descripcion?.toLowerCase().includes('comedor') && !c.nombre?.toLowerCase().includes('comedor'))
          .map((c: any) => (c.descripcion || c.nombre) as string)
      : [];
    return list.length > 0 ? list : ['Para Llevar', 'Delivery Propio', 'Uber Eats', 'Rappi', 'Didi Food'];
  }, [canalesData]);

  // Rango de fechas calculado según preset
  const { fInicioStr, fFinStr } = useMemo(() => {
    const ahora = new Date();
    if (presetFecha === 'hoy') {
      const d = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
      const fin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);
      return { fInicioStr: d.toISOString(), fFinStr: fin.toISOString() };
    }
    if (presetFecha === 'ayer') {
      const d = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1, 0, 0, 0);
      const fin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1, 23, 59, 59);
      return { fInicioStr: d.toISOString(), fFinStr: fin.toISOString() };
    }
    if (presetFecha === 'semana') {
      const d = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 7, 0, 0, 0);
      const fin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);
      return { fInicioStr: d.toISOString(), fFinStr: fin.toISOString() };
    }
    if (presetFecha === 'mes') {
      const d = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0);
      const fin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);
      return { fInicioStr: d.toISOString(), fFinStr: fin.toISOString() };
    }
    // Custom
    const d = new Date(`${fechaCustomInicio}T00:00:00Z`);
    const fin = new Date(`${fechaCustomFin}T23:59:59Z`);
    return { fInicioStr: d.toISOString(), fFinStr: fin.toISOString() };
  }, [presetFecha, fechaCustomInicio, fechaCustomFin]);

  // Consulta API
  const { data, isLoading, refetch, isFetching } = useGetDeliveryHistorialQuery({
    fechaInicio: fInicioStr,
    fechaFin: fFinStr,
    idSucursal: selectedSucursal,
    canal: filtroCanal !== 'Todos' ? filtroCanal : undefined,
  });

  const resumen = data?.data;
  const pedidos = useMemo(() => resumen?.pedidos || [], [resumen]);

  // Filtrado local por estado y búsqueda
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      // Filtro Estado
      if (filtroEstado === 'Entregados' && p.idEstadoPedido < 5) return false;
      if (filtroEstado === 'Rebotados' && p.idEstadoPedido !== 6 && !p.motivoCancelacion) return false;
      if (filtroEstado === 'En Camino' && p.idEstadoPedido !== 4) return false;

      // Búsqueda
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase();
      const matchFolio = p.folio.toLowerCase().includes(q) || (p.idExterno && p.idExterno.toLowerCase().includes(q));
      const matchCliente = p.clienteNombre && p.clienteNombre.toLowerCase().includes(q);
      const matchRepartidor = p.nombreRepartidor && p.nombreRepartidor.toLowerCase().includes(q);
      const matchDireccion = p.direccionEntrega && p.direccionEntrega.toLowerCase().includes(q);

      return matchFolio || matchCliente || matchRepartidor || matchDireccion;
    });
  }, [pedidos, filtroEstado, busqueda]);

  const handleVerAuditoria = (pedido: DeliveryHistorialItem) => {
    setSelectedPedido(pedido);
    setShowAuditoriaModal(true);
  };

  const handleExportCSV = () => {
    if (pedidosFiltrados.length === 0) return;

    const headers = [
      'Folio',
      'ID Externo',
      'Tipo Pedido',
      'Canal',
      'Cliente',
      'Telefono',
      'Direccion',
      'Repartidor',
      'Estado',
      'Total',
      'Esta Pagado',
      'Fecha Creacion',
      'Fecha Entrega',
      'Minutos Totales',
      'Motivo Incidencia',
    ];

    const rows = pedidosFiltrados.map((p) => [
      `"${p.folio}"`,
      `"${p.idExterno || ''}"`,
      `"${p.tipoPedido}"`,
      `"${p.canalOrigen}"`,
      `"${p.clienteNombre || ''}"`,
      `"${p.clienteTelefono || ''}"`,
      `"${p.direccionEntrega?.replace(/"/g, '""') || ''}"`,
      `"${p.nombreRepartidor || ''}"`,
      `"${p.estadoNombre}"`,
      p.total.toFixed(2),
      p.estaPagado ? 'SI' : 'NO',
      `"${new Date(p.abiertoEn).toLocaleString()}"`,
      p.entregadoEn ? `"${new Date(p.entregadoEn).toLocaleString()}"` : '',
      p.minutosTotales ?? '',
      `"${p.motivoCancelacion?.replace(/"/g, '""') || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `despachos_${presetFecha}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCanalBadge = (canal: string, tipo: string) => {
    const isLlevar = tipo.toLowerCase().includes('llevar');
    if (isLlevar) return <span className="canal-badge llevar">🛍️ Para Llevar</span>;
    switch (canal.toLowerCase()) {
      case 'uber eats':
        return <span className="canal-badge uber">🟢 Uber Eats</span>;
      case 'rappi':
        return <span className="canal-badge rappi">🟠 Rappi</span>;
      case 'didi food':
        return <span className="canal-badge didi">🔴 Didi Food</span>;
      default:
        return <span className="canal-badge propio">🛵 Delivery Propio</span>;
    }
  };

  const getStatusPill = (pedido: DeliveryHistorialItem) => {
    if (pedido.idEstadoPedido === 6 || !!pedido.motivoCancelacion) {
      return <span className="status-pill rebotado"><AlertTriangle size={12} /> Rebotado / Cancelado</span>;
    }
    if (pedido.idEstadoPedido >= 5) {
      return <span className="status-pill entregado"><CheckCircle2 size={12} /> Entregado</span>;
    }
    if (pedido.idEstadoPedido === 4) {
      return <span className="status-pill camino"><Bike size={12} /> En Camino</span>;
    }
    return <span className="status-pill listo"><Clock size={12} /> {pedido.estadoNombre}</span>;
  };

  return (
    <Container className="delivery-hist-container">
      {/* Pestañas de Navegación */}
      <nav className="delivery-nav-tabs">
        <Link to="/delivery" className="delivery-tab-btn">
          <Kanban size={16} /> Tablero en Vivo
        </Link>
        <div className="delivery-tab-btn active">
          <FileText size={16} /> Historial & Auditoría
        </div>
      </nav>

      {/* Encabezado */}
      <div className="delivery-hist-header">
        <div className="delivery-hist-title">
          <h1>
            <PackageCheck size={26} style={{ color: '#d97706' }} />
            Auditoría de Despachos & Delivery
          </h1>
          <p>
            Métricas de plataformas, tiempos de entrega y trazabilidad de pedidos para llevar
          </p>
        </div>

        <div className="delivery-hist-actions">
          {sucursales.length > 0 && (
            <select
              value={selectedSucursal || ''}
              onChange={(e) => setSelectedSucursal(e.target.value ? Number(e.target.value) : undefined)}
              className="delivery-select-branch"
            >
              <option value="">Todas las Sucursales</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            leftIcon={<RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />}
          >
            Actualizar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            disabled={pedidosFiltrados.length === 0}
            leftIcon={<Download size={14} />}
          >
            Exportar CSV ({pedidosFiltrados.length})
          </Button>
        </div>
      </div>

      {/* Selector de Fechas y Presets */}
      <div className="delivery-filter-section">
        <div className="delivery-date-presets">
          {(
            [
              { id: 'hoy', label: 'Hoy' },
              { id: 'ayer', label: 'Ayer' },
              { id: 'semana', label: 'Esta Semana' },
              { id: 'mes', label: 'Este Mes' },
              { id: 'custom', label: 'Personalizado' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              className={`delivery-preset-pill ${presetFecha === p.id ? 'active' : ''}`}
              onClick={() => setPresetFecha(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {presetFecha === 'custom' && (
          <div className="delivery-date-inputs">
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Desde:</span>
            <input
              type="date"
              value={fechaCustomInicio}
              onChange={(e) => setFechaCustomInicio(e.target.value)}
              className="delivery-date-field"
            />
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Hasta:</span>
            <input
              type="date"
              value={fechaCustomFin}
              onChange={(e) => setFechaCustomFin(e.target.value)}
              className="delivery-date-field"
            />
          </div>
        )}
      </div>

      {/* Grilla de Métricas KPI */}
      <div className="delivery-kpi-grid">
        {/* Total Pedidos */}
        <div className="delivery-kpi-card">
          <div className="delivery-kpi-header">
            <span className="delivery-kpi-label">Total Pedidos</span>
            <div className="delivery-kpi-icon blue">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="delivery-kpi-value">{resumen?.totalPedidos ?? 0}</div>
          <span className="delivery-kpi-sub">
            En el período seleccionado
          </span>
        </div>

        {/* Facturación Total */}
        <div className="delivery-kpi-card">
          <div className="delivery-kpi-header">
            <span className="delivery-kpi-label">Ventas Delivery</span>
            <div className="delivery-kpi-icon green">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="delivery-kpi-value">
            ${(resumen?.totalVentas ?? 0).toFixed(2)}
          </div>
          <span className="delivery-kpi-sub">
            (Excluye cancelados/rebotados)
          </span>
        </div>

        {/* Tasa de Éxito */}
        <div className="delivery-kpi-card">
          <div className="delivery-kpi-header">
            <span className="delivery-kpi-label">Tasa de Entrega</span>
            <div className="delivery-kpi-icon amber">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="delivery-kpi-value">
            {resumen?.tasaExitoPorcentaje ?? 0}%
          </div>
          <span className="delivery-kpi-sub">
            {resumen?.totalEntregados ?? 0} entregados con éxito
          </span>
        </div>

        {/* Incidencias / Rebotes */}
        <div className="delivery-kpi-card">
          <div className="delivery-kpi-header">
            <span className="delivery-kpi-label">Rebotes / Anulados</span>
            <div className="delivery-kpi-icon red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="delivery-kpi-value">{resumen?.totalRebotados ?? 0}</div>
          <span className="delivery-kpi-sub" style={{ color: (resumen?.totalRebotados ?? 0) > 0 ? '#dc2626' : '#64748b' }}>
            {(resumen?.totalRebotados ?? 0) > 0 ? 'Con incidencia reportada' : 'Sin rebotes'}
          </span>
        </div>

        {/* Tiempo Promedio */}
        <div className="delivery-kpi-card">
          <div className="delivery-kpi-header">
            <span className="delivery-kpi-label">Tiempo Promedio</span>
            <div className="delivery-kpi-icon purple">
              <Clock size={18} />
            </div>
          </div>
          <div className="delivery-kpi-value">
            {resumen?.tiempoPromedioEntregaMinutos ?? 0} <span style={{ fontSize: '1rem', fontWeight: 500 }}>min</span>
          </div>
          <span className="delivery-kpi-sub">
            De orden a entrega final
          </span>
        </div>
      </div>

      {/* Desglose Financiero por Canal */}
      {resumen?.ventasPorCanal && resumen.ventasPorCanal.length > 0 && (
        <div className="delivery-channels-card">
          <div className="delivery-channels-title">
            <TrendingUp size={16} style={{ color: '#d97706' }} />
            Conciliación y Distribución por Canal de Venta
          </div>

          {/* Barra de progreso segmentada */}
          <div className="delivery-progress-bar">
            {resumen.ventasPorCanal.map((c) => {
              const canalKey = c.canal.toLowerCase().replace(/\s+/g, '');
              const bgClass =
                canalKey.includes('uber')
                  ? 'channel-bg-uber'
                  : canalKey.includes('rappi')
                  ? 'channel-bg-rappi'
                  : canalKey.includes('didi')
                  ? 'channel-bg-didi'
                  : canalKey.includes('llevar')
                  ? 'channel-bg-llevar'
                  : 'channel-bg-propio';

              return (
                <div
                  key={c.canal}
                  className={`delivery-progress-segment ${bgClass}`}
                  style={{ width: `${c.porcentaje}%` }}
                  title={`${c.canal}: ${c.porcentaje}% ($${c.totalVentas.toFixed(2)})`}
                />
              );
            })}
          </div>

          {/* Badges de resumen */}
          <div className="delivery-channel-badges-grid">
            {resumen.ventasPorCanal.map((c) => (
              <div key={c.canal} className="delivery-channel-summary-item">
                <div>
                  <strong>{c.canal}</strong>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                    {c.cantidadPedidos} pedido(s) ({c.porcentaje}%)
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                  ${c.totalVentas.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de Auditoría */}
      <div className="delivery-table-card">
        {/* Controles de Búsqueda y Filtrado */}
        <div className="delivery-table-controls">
          <div className="delivery-search-box">
            <Search size={15} className="delivery-search-icon" />
            <input
              type="text"
              placeholder="Buscar por folio, cliente, dirección o repartidor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="delivery-search-input"
            />
          </div>

          <div className="delivery-table-filters">
            {/* Filtro Canal */}
            <select
              value={filtroCanal}
              onChange={(e) => setFiltroCanal(e.target.value)}
              className="delivery-select-filter"
            >
              <option value="Todos">Todos los Canales</option>
              {canalesOpciones.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Filtro Estado */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="delivery-select-filter"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Entregados">Entregados</option>
              <option value="Rebotados">Rebotados / Cancelados</option>
              <option value="En Camino">En Camino</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="delivery-table-wrapper">
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha & Hora</th>
                <th>Canal</th>
                <th>Cliente</th>
                <th>Repartidor</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Tiempo Ciclo</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Cargando historial de pedidos...
                  </td>
                </tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No se encontraron pedidos de delivery en este período o criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((p) => (
                  <tr key={p.idPedido}>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                        {p.folio}
                      </div>
                      {p.idExterno && (
                        <div style={{ fontFamily: 'monospace', fontSize: '0.6875rem', color: '#64748b' }}>
                          {p.idExterno}
                        </div>
                      )}
                    </td>
                    <td>
                      <div>{new Date(p.abiertoEn).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                        {new Date(p.abiertoEn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>{getCanalBadge(p.canalOrigen, p.tipoPedido)}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {p.clienteNombre || 'Comensal Mostrador'}
                      </div>
                      {p.clienteTelefono && (
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                          {p.clienteTelefono}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.nombreRepartidor ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1d4ed8', fontWeight: 500 }}>
                          <Bike size={13} />
                          <span>{p.nombreRepartidor}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        ${p.total.toFixed(2)}
                      </div>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: p.estaPagado ? '#dcfce7' : '#fef3c7',
                          color: p.estaPagado ? '#15803d' : '#b45309',
                        }}
                      >
                        {p.estaPagado ? 'Pagado' : 'Por Cobrar'}
                      </span>
                    </td>
                    <td>{getStatusPill(p)}</td>
                    <td>
                      {p.minutosTotales ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                          <Clock size={12} style={{ color: '#94a3b8' }} />
                          {p.minutosTotales} min
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleVerAuditoria(p)}
                        leftIcon={<ExternalLink size={13} />}
                        className="text-xs py-1 px-2.5"
                      >
                        Auditar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Auditoría */}
      <DeliveryAuditoriaModal
        pedido={selectedPedido}
        isOpen={showAuditoriaModal}
        onClose={() => setShowAuditoriaModal(false)}
      />
    </Container>
  );
}
