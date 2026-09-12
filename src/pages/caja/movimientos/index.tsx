import { useState, useMemo } from 'react';
import { useGetHistorialMovimientosQuery } from '../../../services/movimientoCajaApi';
import Container from '../../../components/ui/layout/Container';
import { ArrowDownRight, ArrowUpRight, ArrowUpDown, Calendar, DollarSign, RefreshCw, Search } from 'lucide-react';

export default function MovimientosPage() {
  const hoyStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyStr);
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Egreso' | 'Ingreso'>('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Rango del día completo en UTC
  const { fechaInicio, fechaFin } = useMemo(() => {
    if (!fechaSeleccionada) return {};
    const dInicio = new Date(`${fechaSeleccionada}T00:00:00Z`);
    const dFin = new Date(`${fechaSeleccionada}T23:59:59Z`);
    return {
      fechaInicio: dInicio.toISOString(),
      fechaFin: dFin.toISOString()
    };
  }, [fechaSeleccionada]);

  const { data, isLoading, refetch, isFetching } = useGetHistorialMovimientosQuery({
    fechaInicio,
    fechaFin
  });

  const movimientos = data?.data || [];

  // Filtrado en memoria
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((m) => {
      const coincideTipo = filtroTipo === 'Todos' || m.tipo === filtroTipo;
      const coincideBusqueda =
        !busqueda ||
        m.concepto?.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.nota?.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase());
      return coincideTipo && coincideBusqueda;
    });
  }, [movimientos, filtroTipo, busqueda]);

  // KPIs
  const totalIngresos = useMemo(
    () => movimientos.filter((m) => m.tipo === 'Ingreso').reduce((sum, m) => sum + m.monto, 0),
    [movimientos]
  );
  const totalEgresos = useMemo(
    () => movimientos.filter((m) => m.tipo === 'Egreso').reduce((sum, m) => sum + m.monto, 0),
    [movimientos]
  );
  const balanceNeto = totalIngresos - totalEgresos;

  return (
    <Container as="div" maxWidth="xl" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text, #1F1F1F)' }}>
            Movimientos de Caja & Auditoría
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted, #6B7280)' }}>
            Registro y control de entradas, compras de insumos, retiros a caja fuerte y gastos operativos.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 10,
            border: '1px solid var(--color-border, rgba(0,0,0,0.12))',
            background: 'var(--color-surface, #FFFFFF)',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-text)'
          }}
        >
          <RefreshCw size={15} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          Actualizar
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Entradas / Ingresos */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            <ArrowUpRight size={18} /> Entradas de Efectivo
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#047857' }}>
            +${totalIngresos.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {movimientos.filter((m) => m.tipo === 'Ingreso').length} registros de entrada
          </div>
        </div>

        {/* Salidas / Egresos */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            <ArrowDownRight size={18} /> Salidas de Efectivo
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#b91c1c' }}>
            -${totalEgresos.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {movimientos.filter((m) => m.tipo === 'Egreso').length} gastos y retiros
          </div>
        </div>

        {/* Balance Neto */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: balanceNeto >= 0 ? 'rgba(59, 130, 246, 0.05)' : 'rgba(239, 68, 68, 0.08)',
            border: balanceNeto >= 0 ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: balanceNeto >= 0 ? '#2563eb' : '#dc2626',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 6
            }}
          >
            <DollarSign size={18} /> Flujo Neto en Caja
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: balanceNeto >= 0 ? '#1d4ed8' : '#b91c1c' }}>
            {balanceNeto >= 0 ? `+$${balanceNeto.toFixed(2)}` : `-$${Math.abs(balanceNeto).toFixed(2)}`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Diferencial de entradas vs salidas
          </div>
        </div>

        {/* Total Operaciones */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: 'var(--color-surface, #FFFFFF)',
            border: '1px solid var(--color-border, rgba(0,0,0,0.12))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            <ArrowUpDown size={18} /> Total Movimientos
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)' }}>
            {movimientos.length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Operaciones registradas en la fecha
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          padding: 16,
          borderRadius: 14,
          background: 'var(--color-surface, #FFFFFF)',
          border: '1px solid var(--color-border, rgba(0,0,0,0.12))',
          marginBottom: 20,
          alignItems: 'center'
        }}
      >
        {/* Selector de Fecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} color="var(--color-text-muted)" />
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-text)'
            }}
          />
        </div>

        {/* Filtro por Tipo */}
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          {(['Todos', 'Egreso', 'Ingreso'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: filtroTipo === t ? '1px solid var(--color-primary, #D64545)' : '1px solid var(--color-border)',
                background: filtroTipo === t ? 'rgba(214, 69, 69, 0.08)' : 'transparent',
                color: filtroTipo === t ? 'var(--color-primary, #D64545)' : 'var(--color-text-muted)'
              }}
            >
              {t === 'Todos' ? 'Todos' : t === 'Egreso' ? 'Salidas (Egresos)' : 'Entradas (Ingresos)'}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div style={{ position: 'relative', minWidth: 220 }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            type="text"
            placeholder="Buscar por nota o concepto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: '8px 12px 8px 32px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              fontSize: 13,
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div
        style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 14,
          border: '1px solid var(--color-border, rgba(0,0,0,0.12))',
          overflow: 'hidden'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Hora / Fecha</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Turno</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Cajero / Responsable</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tipo</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Concepto</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Justificación / Nota</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                  Cargando movimientos de caja...
                </td>
              </tr>
            ) : movimientosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-text-muted)' }}>
                  <ArrowUpDown size={36} opacity={0.3} style={{ marginBottom: 10 }} />
                  <p style={{ margin: '4px 0', fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                    Sin movimientos registrados
                  </p>
                  <span style={{ fontSize: 13 }}>
                    No hay entradas ni salidas registradas en la fecha seleccionada ({fechaSeleccionada}).
                  </span>
                </td>
              </tr>
            ) : (
              movimientosFiltrados.map((m) => {
                const esEgreso = m.tipo === 'Egreso';
                const fechaObj = new Date(m.createdAt);
                const horaStr = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const fechaCorta = fechaObj.toLocaleDateString([], { day: '2-digit', month: 'short' });

                return (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.06))',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{horaStr}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{fechaCorta}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.04)', fontWeight: 600, fontSize: 12 }}>
                        Turno #{m.idTurno}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>
                      {m.nombreUsuario || 'Cajero de Turno'}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: esEgreso ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: esEgreso ? '#dc2626' : '#059669'
                        }}
                      >
                        {esEgreso ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        {esEgreso ? 'Salida (Egreso)' : 'Entrada (Ingreso)'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text)' }}>
                      {m.concepto || (esEgreso ? 'Gasto de Caja' : 'Ingreso Extra')}
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', maxWidth: 280 }}>
                      {m.nota || '-'}
                    </td>

                    <td
                      style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: esEgreso ? '#dc2626' : '#059669'
                      }}
                    >
                      {esEgreso ? `-$${m.monto.toFixed(2)}` : `+$${m.monto.toFixed(2)}`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
