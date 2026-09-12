import { useState, useMemo } from 'react';
import {
  useGetHistorialCortesQuery,
  useGetResumenCorteQuery,
  type CorteCajaHistorialItem
} from '../../../services/corteCajaApi';
import { useSucursalesGetAllQuery } from '../../../services/generated/api';
import Container from '../../../components/ui/layout/Container';
import { Button } from '../../../components/ui/button/Button';
import { CorteDetalleModal } from './CorteDetalleModal';
import { TicketCorteModal } from './TicketCorteModal';
import { CorteXModal } from '../../operacion/pos/CorteXModal';
import {
  DollarSign,
  Coins,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Calendar,
  RefreshCw,
  Printer,
  Eye,
  FileSpreadsheet,
  Clock,
  User,
  Activity
} from 'lucide-react';

export default function CortesPage() {
  const hoyStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [presetFecha, setPresetFecha] = useState<'hoy' | 'ayer' | 'semana' | 'custom'>('hoy');
  const [fechaCustomInicio, setFechaCustomInicio] = useState(hoyStr);
  const [fechaCustomFin, setFechaCustomFin] = useState(hoyStr);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | undefined>(undefined);

  // Estados de modales
  const [selectedCorte, setSelectedCorte] = useState<CorteCajaHistorialItem | null>(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCorteX, setShowCorteX] = useState(false);

  // Consulta de sucursales
  const { data: sucursalesData } = useSucursalesGetAllQuery();
  const sucursales = Array.isArray(sucursalesData?.data) ? sucursalesData.data : [];

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
    // Custom
    const d = new Date(`${fechaCustomInicio}T00:00:00Z`);
    const fin = new Date(`${fechaCustomFin}T23:59:59Z`);
    return { fInicioStr: d.toISOString(), fFinStr: fin.toISOString() };
  }, [presetFecha, fechaCustomInicio, fechaCustomFin]);

  // Consulta del Historial de Cortes
  const { data, isLoading, refetch, isFetching } = useGetHistorialCortesQuery({
    fechaInicio: fInicioStr,
    fechaFin: fFinStr,
    idSucursal: sucursalSeleccionada
  });

  // Consulta de Turno Activo (en vivo)
  const { data: turnoActivoData } = useGetResumenCorteQuery({
    idSucursal: sucursalSeleccionada || 1
  });

  const resumen = data?.data;
  const cortes = resumen?.cortes || [];
  const turnoActivo = turnoActivoData?.data;

  const handleVerDetalle = (corte: CorteCajaHistorialItem) => {
    setSelectedCorte(corte);
    setShowDetalleModal(true);
  };

  const handleImprimirTicket = (corte: CorteCajaHistorialItem) => {
    setSelectedCorte(corte);
    setShowTicketModal(true);
  };

  const diferenciaNeta = resumen?.diferenciaNeta ?? 0;
  const esDiferenciaCero = Math.abs(diferenciaNeta) < 0.01;
  const esDiferenciaFaltante = diferenciaNeta < -0.01;

  return (
    <Container as="div" maxWidth="xl" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text, #1F1F1F)' }}>
            Control & Cortes de Caja
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted, #6B7280)' }}>
            Supervisión diaria de cierres de turno, arqueo de efectivo, conciliación de terminales y liquidación de propinas.
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

      {/* Widget de Turno Activo (si hay uno en curso) */}
      {turnoActivo && turnoActivo.idTurno && (
        <div
          style={{
            marginBottom: 24,
            padding: '16px 20px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#2563eb',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1e3a8a' }}>
                  Turno #{turnoActivo.idTurno} en Curso
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#10b981',
                    color: '#FFFFFF'
                  }}
                >
                  EN VIVO
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#3b82f6', marginTop: 2 }}>
                Iniciado a las {new Date(turnoActivo.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                {turnoActivo.cantidadCuentasPagadas} cuentas cobradas hasta ahora
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Efectivo Esperado en Cajón</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary, #D64545)' }}>
                ${turnoActivo.cajaEsperada.toFixed(2)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Ventas Acumuladas</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a' }}>
                ${turnoActivo.totalVentas.toFixed(2)}
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCorteX(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, borderColor: '#3b82f6', color: '#1d4ed8' }}
            >
              <Eye size={15} />
              Corte X en Vivo
            </Button>
          </div>
        </div>
      )}

      {/* Tarjetas KPI del Periodo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24
        }}
      >
        {/* Total Ventas */}
        <div style={{ padding: 18, borderRadius: 14, background: 'var(--color-surface, #FFFFFF)', border: '1px solid var(--color-border, rgba(0,0,0,0.12))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            <DollarSign size={16} /> Total Ventas Cobradas
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)' }}>
            ${(resumen?.totalVentas ?? 0).toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {resumen?.cantidadCortes ?? 0} cortes cerrados
          </div>
        </div>

        {/* Efectivo Recaudado */}
        <div style={{ padding: 18, borderRadius: 14, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            <Coins size={16} /> Total en Efectivo
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#047857' }}>
            ${(resumen?.totalEfectivo ?? 0).toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Ingresado a cajón por ventas
          </div>
        </div>

        {/* Vouchers Tarjeta */}
        <div style={{ padding: 18, borderRadius: 14, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            <CreditCard size={16} /> Vouchers de Tarjeta
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1d4ed8' }}>
            ${(resumen?.totalTarjeta ?? 0).toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Terminales bancarias
          </div>
        </div>

        {/* Propinas Tarjeta */}
        <div style={{ padding: 18, borderRadius: 14, background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            <DollarSign size={16} /> Propinas de Tarjeta
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#b45309' }}>
            ${(resumen?.totalPropinasTarjeta ?? 0).toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: '#d97706', marginTop: 4 }}>
            A liquidar al personal / meseros
          </div>
        </div>

        {/* Balance Neto de Diferencias */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: esDiferenciaCero
              ? 'rgba(16, 185, 129, 0.05)'
              : esDiferenciaFaltante
              ? 'rgba(239, 68, 68, 0.08)'
              : 'rgba(59, 130, 246, 0.08)',
            border: esDiferenciaCero
              ? '1px solid rgba(16, 185, 129, 0.2)'
              : esDiferenciaFaltante
              ? '1px solid rgba(239, 68, 68, 0.3)'
              : '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: esDiferenciaCero ? '#059669' : esDiferenciaFaltante ? '#dc2626' : '#2563eb',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 6
            }}
          >
            {esDiferenciaCero ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            Balance de Descuadres
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: esDiferenciaCero ? '#047857' : esDiferenciaFaltante ? '#b91c1c' : '#1d4ed8'
            }}
          >
            {esDiferenciaCero ? '$0.00' : diferenciaNeta < 0 ? `-$${Math.abs(diferenciaNeta).toFixed(2)}` : `+$${diferenciaNeta.toFixed(2)}`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {esDiferenciaCero ? 'Cajas cuadradas exactas' : esDiferenciaFaltante ? 'Faltante neto acumulado' : 'Sobrante neto acumulado'}
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          padding: 16,
          borderRadius: 14,
          background: 'var(--color-surface, #FFFFFF)',
          border: '1px solid var(--color-border, rgba(0,0,0,0.12))',
          marginBottom: 20,
          alignItems: 'center'
        }}
      >
        {/* Presets Rápidos */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['hoy', 'ayer', 'semana', 'custom'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPresetFecha(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: presetFecha === p ? '1px solid var(--color-primary, #D64545)' : '1px solid var(--color-border)',
                background: presetFecha === p ? 'rgba(214, 69, 69, 0.08)' : 'transparent',
                color: presetFecha === p ? 'var(--color-primary, #D64545)' : 'var(--color-text-muted)'
              }}
            >
              {p === 'hoy' ? 'Hoy' : p === 'ayer' ? 'Ayer' : p === 'semana' ? 'Últimos 7 días' : 'Personalizado'}
            </button>
          ))}
        </div>

        {/* Inputs de fecha para Personalizado */}
        {presetFecha === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="var(--color-text-muted)" />
            <input
              type="date"
              value={fechaCustomInicio}
              onChange={(e) => setFechaCustomInicio(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                fontSize: 13
              }}
            />
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>al</span>
            <input
              type="date"
              value={fechaCustomFin}
              onChange={(e) => setFechaCustomFin(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                fontSize: 13
              }}
            />
          </div>
        )}

        {/* Selector de Sucursal */}
        {sucursales.length > 1 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Sucursal:</span>
            <select
              value={sucursalSeleccionada ?? ''}
              onChange={(e) => setSucursalSeleccionada(e.target.value ? Number(e.target.value) : undefined)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                background: '#FFFFFF'
              }}
            >
              <option value="">Todas las sucursales</option>
              {sucursales.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabla de Cortes de Caja */}
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
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Folio / Turno</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Cajero</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Horario</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Fondo Inicial</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Total Ventas</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Esperado</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Declarado</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'center' }}>Diferencia</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                  Consultando cortes de caja...
                </td>
              </tr>
            ) : cortes.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-text-muted)' }}>
                  <FileSpreadsheet size={36} opacity={0.3} style={{ marginBottom: 10 }} />
                  <p style={{ margin: '4px 0', fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                    No se encontraron cortes de caja
                  </p>
                  <span style={{ fontSize: 13 }}>
                    No hay cierres registrados en el periodo seleccionado.
                  </span>
                </td>
              </tr>
            ) : (
              cortes.map((c) => {
                const esCuadrado = Math.abs(c.diferencia) < 0.01;
                const esFaltante = c.diferencia < -0.01;
                const fInicio = new Date(c.fechaInicio);
                const fFin = new Date(c.fechaFin);

                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.06))',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>Corte #{c.id}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        Turno #{c.idTurno || '-'} • {c.nombreSucursal}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} color="var(--color-text-muted)" />
                        <span>{c.nombreCajero}</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} color="var(--color-text-muted)" />
                        <span>
                          {fInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {fFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        {fFin.toLocaleDateString([], { day: '2-digit', month: 'short' })}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                      ${c.cajaInicial.toFixed(2)}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
                      ${c.totalVentas.toFixed(2)}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                      ${c.cajaEsperada.toFixed(2)}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--color-text)' }}>
                      ${c.declarado.toFixed(2)}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background: esCuadrado
                            ? 'rgba(16, 185, 129, 0.1)'
                            : esFaltante
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(59, 130, 246, 0.1)',
                          color: esCuadrado ? '#059669' : esFaltante ? '#dc2626' : '#2563eb'
                        }}
                      >
                        {esCuadrado ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        {esCuadrado
                          ? '$0.00'
                          : esFaltante
                          ? `-$${Math.abs(c.diferencia).toFixed(2)}`
                          : `+$${c.diferencia.toFixed(2)}`}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleVerDetalle(c)}
                          title="Ver Detalle Contable"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid var(--color-border)',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'var(--color-text)'
                          }}
                        >
                          <Eye size={14} /> Detalle
                        </button>

                        <button
                          onClick={() => handleImprimirTicket(c)}
                          title="Reimprimir Ticket Térmico"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid var(--color-border)',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'var(--color-text-muted)'
                          }}
                        >
                          <Printer size={14} /> Ticket
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle de Corte */}
      <CorteDetalleModal
        isOpen={showDetalleModal}
        onClose={() => setShowDetalleModal(false)}
        corte={selectedCorte}
        onOpenTicket={(corte) => {
          setShowDetalleModal(false);
          handleImprimirTicket(corte);
        }}
      />

      {/* Modal de Ticket Térmico Imprimible */}
      <TicketCorteModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        corte={selectedCorte}
      />

      {/* Modal de Corte X en Vivo */}
      <CorteXModal
        isOpen={showCorteX}
        onClose={() => setShowCorteX(false)}
      />
    </Container>
  );
}
