// src/pages/dashboard/DashboardCancelacionesAlert.tsx
// Spec 024, sección 2.4: Monitor de Auditoría y Umbral del 2% en Dashboard.
import { useState } from 'react';
import Icon from '../../components/ui/icons/Icon';
import { useGetCancelacionesTurnoQuery } from '../../services/seguridadSupervisorApi';

interface DashboardCancelacionesAlertProps {
  idTurno?: number | null;
}

type Semaforo = 'verde' | 'ambar' | 'rojo';

function getSemaforo(pct: number): Semaforo {
  if (pct > 2) return 'rojo';
  if (pct >= 1) return 'ambar';
  return 'verde';
}

const SEMAFORO_STYLES: Record<Semaforo, { bg: string; border: string; text: string; icon: string }> = {
  verde: { bg: 'rgba(60,141,64,0.08)', border: '#3c8d40', text: '#256029', icon: '#3c8d40' },
  ambar: { bg: 'rgba(217,119,6,0.10)', border: '#d97706', text: '#92400e', icon: '#d97706' },
  rojo: { bg: 'rgba(220,38,38,0.10)', border: '#dc2626', text: '#991b1b', icon: '#dc2626' },
};

export function DashboardCancelacionesAlert({ idTurno }: DashboardCancelacionesAlertProps) {
  const [showDesglose, setShowDesglose] = useState(false);
  const { data, isFetching } = useGetCancelacionesTurnoQuery(
    { idTurno: idTurno as number },
    { skip: !idTurno, pollingInterval: 30000 }
  );

  const resumen = data?.data;
  const pct = resumen?.porcentajeCancelaciones ?? 0;
  const semaforo = getSemaforo(pct);
  const style = SEMAFORO_STYLES[semaforo];

  if (!idTurno) {
    return null;
  }

  return (
    <>
      <section
        className="dash-bento-card"
        style={{ cursor: resumen && resumen.totalEventos > 0 ? 'pointer' : 'default' }}
        onClick={() => { if (resumen && resumen.totalEventos > 0) setShowDesglose(true); }}
        title={resumen && resumen.totalEventos > 0 ? 'Ver desglose de cancelaciones del turno' : undefined}
      >
        <div className="dash-card-header">
          <h2>
            <Icon name="ShieldAlert" />
            <span>Auditoría de Cancelaciones</span>
          </h2>
          {resumen && resumen.totalEventos > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver desglose <Icon name="ArrowRight" />
            </span>
          )}
        </div>

        {isFetching && !resumen ? (
          <div style={{ textAlign: 'center', padding: '20px 12px', color: 'var(--color-text-muted, #64748b)' }}>
            Calculando auditoría del turno...
          </div>
        ) : !resumen || resumen.totalEventos === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 12px', color: 'var(--color-text-muted, #64748b)' }}>
            <div style={{ margin: '0 auto 8px', width: 40, height: 40, borderRadius: '50%', background: 'rgba(60,141,64,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3c8d40' }}>
              <Icon name="CheckCircle" />
            </div>
            <strong style={{ display: 'block', color: 'var(--color-text, #1e293b)' }}>Sin cancelaciones en este turno</strong>
            <span style={{ fontSize: '0.85rem' }}>Operación limpia y ágil</span>
          </div>
        ) : (
          <div
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name={semaforo === 'rojo' ? 'AlertTriangle' : semaforo === 'ambar' ? 'AlertCircle' : 'CheckCircle'} />
              <strong style={{ color: style.text, fontSize: '1.05rem' }}>
                {pct.toFixed(1)}% del turno cancelado
              </strong>
            </div>
            <div style={{ color: style.text, fontSize: '0.9rem' }}>
              Cancelaciones del turno: ${resumen.totalCancelacionesTurno.toFixed(2)} MXN ({resumen.totalEventos} evento{resumen.totalEventos !== 1 ? 's' : ''})
            </div>
            {resumen.superaUmbralAlerta && (
              <div style={{ color: style.text, fontSize: '0.82rem', fontWeight: 700 }}>
                Umbral del 2% superado — Revisar autorizaciones de Gerente
              </div>
            )}
          </div>
        )}
      </section>

      {showDesglose && resumen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 16
          }}
          onClick={() => setShowDesglose(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '95%', maxWidth: 640, maxHeight: '85dvh', overflow: 'hidden',
              background: 'var(--color-surface, #fff)', borderRadius: 16, display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--color-text, #1e293b)' }}>Desglose de Cancelaciones del Turno</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted, #64748b)' }}>
                  Total ventas: ${resumen.totalVentasTurno.toFixed(2)} · Cancelado: ${resumen.totalCancelacionesTurno.toFixed(2)} ({pct.toFixed(1)}%)
                </p>
              </div>
              <button
                onClick={() => setShowDesglose(false)}
                style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}
              >
                <Icon name="X" />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '8px 0' }}>
              {resumen.desglose.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted, #64748b)' }}>Sin eventos registrados.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--color-text-muted, #64748b)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 16px' }}>Hora</th>
                      <th style={{ padding: '8px 16px' }}>Mesa</th>
                      <th style={{ padding: '8px 16px' }}>Platillo</th>
                      <th style={{ padding: '8px 16px' }}>Importe</th>
                      <th style={{ padding: '8px 16px' }}>Mesero</th>
                      <th style={{ padding: '8px 16px' }}>Supervisor</th>
                      <th style={{ padding: '8px 16px' }}>Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumen.desglose.map((ev, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid var(--color-border, #f1f5f9)' }}>
                        <td style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>{new Date(ev.fechaHora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td style={{ padding: '8px 16px' }}>{ev.mesa || '-'}</td>
                        <td style={{ padding: '8px 16px' }}>{ev.platillo || '-'}</td>
                        <td style={{ padding: '8px 16px' }}>${ev.importe.toFixed(2)}</td>
                        <td style={{ padding: '8px 16px' }}>{ev.mesero || '-'}</td>
                        <td style={{ padding: '8px 16px' }}>{ev.supervisor || '-'}</td>
                        <td style={{ padding: '8px 16px' }}>{ev.motivo || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
