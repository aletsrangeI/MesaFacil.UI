import { useState } from 'react';
import { useToast } from '../../../components/ui/toast';
import { DollarSign, CreditCard, Coins, AlertCircle, CheckCircle2, ArrowRight, X, Calculator, Bike } from 'lucide-react';
import { CalculadoraDenominaciones } from './CalculadoraDenominaciones';
import { useGetResumenCorteQuery, useRealizarCorteMutation } from '../../../services/corteCajaApi';

export { useGetResumenCorteQuery, useRealizarCorteMutation };

interface CorteCajaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idSucursal?: number;
  idTurno?: number;
  onCorteSuccess?: () => void;
}

export function CorteCajaModal({ isOpen, onClose, idSucursal = 1, idTurno, onCorteSuccess }: CorteCajaModalProps) {
  const { data: resumenData, isLoading } = useGetResumenCorteQuery({ idSucursal, idTurno }, { skip: !isOpen });
  const [realizarCorte, { isLoading: isSubmitting }] = useRealizarCorteMutation();
  const { addToast } = useToast();

  const [declarado, setDeclarado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);

  if (!isOpen) return null;

  const resumen = resumenData?.data;
  const cajaEsperada = resumen?.cajaEsperada ?? 0;
  const declaradoNum = parseFloat(declarado);
  const tieneDeclarado = !isNaN(declaradoNum);
  const diferencia = tieneDeclarado ? declaradoNum - cajaEsperada : 0;

  const handleConfirmarCorte = async () => {
    if (!tieneDeclarado) {
      addToast({ message: 'Por favor ingresa el monto de efectivo físico contado.', variant: 'error' });
      return;
    }

    try {
      const res = await realizarCorte({
        idSucursal,
        idTurno: resumen?.idTurno ?? idTurno,
        declarado: declaradoNum,
        observaciones: observaciones || undefined
      }).unwrap();

      if (res?.isSuccess) {
        addToast({ message: '¡Corte de caja registrado exitosamente! Turno cerrado.', variant: 'success' });
        if (onCorteSuccess) onCorteSuccess();
        onClose();
      } else {
        addToast({ message: res?.message || 'Error al procesar corte', variant: 'error' });
      }
    } catch {
      addToast({ message: 'Error de conexión al realizar corte', variant: 'error' });
    }
  };

  return (
    <div className="pos-modal-overlay">
      <div 
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 620,
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg, 20px)',
          boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))',
          backgroundColor: 'var(--color-bg, #FFFFFF)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.12))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--color-surface, #FAFAFA)'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text, #1F1F1F)' }}>
              Corte de Caja & Arqueo
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted, #6B7280)' }}>
              {resumen?.fechaInicio ? `Desde: ${new Date(resumen.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Turno actual'} • {resumen?.cantidadCuentasPagadas || 0} cuentas cobradas
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted, #6B7280)', display: 'flex', alignItems: 'center' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body scrollable */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isLoading || !resumen ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted, #6B7280)' }}>
              Calculando totales del turno...
            </div>
          ) : (
            <>
              {/* Grilla de Métricas de Venta */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {/* Total Ventas */}
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(0,0,0,0.02)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 4 }}>
                    <DollarSign size={16} /> Total Ventas
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    ${resumen.totalVentas.toFixed(2)}
                  </div>
                </div>

                {/* Vouchers Tarjeta */}
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb', fontSize: 13, marginBottom: 4 }}>
                    <CreditCard size={16} /> Tarjeta (Venta + Propina)
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1d4ed8' }}>
                    ${(resumen.totalTarjeta + resumen.totalPropinasTarjeta).toFixed(2)}
                  </div>
                  <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 2 }}>
                    Venta: ${resumen.totalTarjeta.toFixed(2)} • Propina: ${resumen.totalPropinasTarjeta.toFixed(2)}
                  </div>
                </div>

                {/* Efectivo en Ventas */}
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontSize: 13, marginBottom: 4 }}>
                    <Coins size={16} /> Ventas en Efectivo
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#047857' }}>
                    ${resumen.totalEfectivo.toFixed(2)}
                  </div>
                </div>

                {/* Propinas Totales */}
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d97706', fontSize: 13, marginBottom: 4 }}>
                    <DollarSign size={16} /> Propinas Acumuladas
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b45309' }}>
                    ${resumen.totalPropinas.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 11, color: '#d97706', marginTop: 2 }}>
                    Tarjeta: ${resumen.totalPropinasTarjeta.toFixed(2)} (A liquidar a meseros)
                  </div>
                </div>

                {/* Plataformas de Delivery (Uber Eats, Rappi, Didi) */}
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(147, 51, 234, 0.05)', border: '1px solid rgba(147, 51, 234, 0.2)', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9333ea', fontSize: 13 }}>
                      <Bike size={16} /> Plataformas Delivery (Uber Eats / Rappi / Didi)
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#7e22ce', background: 'rgba(147, 51, 234, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                      Cobro en App • No afecta cajón físico
                    </span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#7e22ce', marginTop: 4 }}>
                    ${(resumen.totalPlataformas ?? 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Sección Arqueo de Efectivo Físico */}
              <div style={{
                background: 'rgba(0,0,0,0.02)',
                borderRadius: 'var(--radius-md, 12px)',
                padding: '16px',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--color-text)' }}>
                  Arqueo de Efectivo en Cajón
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                  <span>Fondo Inicial de Caja</span>
                  <span>+${resumen.cajaInicial.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                  <span>Ventas en Efectivo</span>
                  <span>+${resumen.totalEfectivo.toFixed(2)}</span>
                </div>
                {resumen.totalIngresos > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#059669', marginBottom: 4 }}>
                    <span>Entradas / Ingresos de Caja</span>
                    <span>+${resumen.totalIngresos.toFixed(2)}</span>
                  </div>
                )}
                {resumen.totalEgresos > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#dc2626', marginBottom: 4 }}>
                    <span>Salidas / Egresos de Caja</span>
                    <span>-${resumen.totalEgresos.toFixed(2)}</span>
                  </div>
                )}
                {(resumen.totalPlataformas ?? 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9333ea', fontStyle: 'italic', marginBottom: 4 }}>
                    <span>Plataformas Delivery (Uber / Rappi / Didi)</span>
                    <span>${(resumen.totalPlataformas ?? 0).toFixed(2)} (En App)</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderTop: '1px dashed var(--color-border)',
                  paddingTop: 8,
                  marginTop: 6
                }}>
                  <span>Efectivo Esperado en Cajón:</span>
                  <span style={{ color: 'var(--color-primary, #D64545)' }}>
                    ${cajaEsperada.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Input de Declaración */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>
                    Efectivo Físico Contado (Declarado)
                  </label>
                  <button
                    type="button"
                    onClick={() => setMostrarCalculadora(!mostrarCalculadora)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      border: 'none',
                      background: mostrarCalculadora ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      color: mostrarCalculadora ? '#2563eb' : 'var(--color-text-muted)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: 6
                    }}
                  >
                    <Calculator size={14} />
                    {mostrarCalculadora ? 'Ocultar calculadora' : 'Contar billetes y monedas'}
                  </button>
                </div>

                {mostrarCalculadora && (
                  <div style={{ marginBottom: 12 }}>
                    <CalculadoraDenominaciones
                      onTotalChange={(total, desglose) => {
                        setDeclarado(total > 0 ? total.toFixed(2) : '');
                        if (desglose && (!observaciones || observaciones.startsWith('[Desglose:'))) {
                          setObservaciones(`[Desglose: ${desglose}]`);
                        }
                      }}
                    />
                  </div>
                )}

                <input
                  type="number"
                  step="0.01"
                  placeholder="Ingresa el monto que contaste en el cajón..."
                  value={declarado}
                  onChange={(e) => setDeclarado(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md, 12px)',
                    border: '1px solid var(--color-border)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: 'var(--color-text)'
                  }}
                />
              </div>

              {/* Indicador de Diferencia */}
              {tieneDeclarado && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: Math.abs(diferencia) < 0.01 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : diferencia < 0 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(59, 130, 246, 0.1)',
                  color: Math.abs(diferencia) < 0.01 
                    ? '#059669' 
                    : diferencia < 0 
                      ? '#dc2626' 
                      : '#2563eb'
                }}>
                  {Math.abs(diferencia) < 0.01 ? (
                    <>
                      <CheckCircle2 size={20} />
                      <span style={{ fontWeight: 600 }}>Caja cuadrada exactamente ($0.00)</span>
                    </>
                  ) : diferencia < 0 ? (
                    <>
                      <AlertCircle size={20} />
                      <span style={{ fontWeight: 600 }}>
                        Faltante en caja: -${Math.abs(diferencia).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      <span style={{ fontWeight: 600 }}>
                        Sobrante en caja: +${diferencia.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Observaciones */}
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                  Observaciones (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Notas adicionales sobre el corte..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    fontSize: 13,
                    color: 'var(--color-text)'
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border, rgba(0,0,0,0.12))',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          background: 'var(--color-surface, #FAFAFA)'
        }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmarCorte}
            disabled={isSubmitting || !tieneDeclarado || isLoading}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--color-primary, #D64545)',
              color: '#FFFFFF',
              cursor: (isSubmitting || !tieneDeclarado || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (isSubmitting || !tieneDeclarado || isLoading) ? 0.6 : 1,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar y Cerrar Turno'}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
