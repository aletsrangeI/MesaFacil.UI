import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { emptySplitApi as api } from '../../../services/baseApi';
import { useToast } from '../../../components/ui/toast';
import { useCatalogosGetAllQuery } from '../../../services/generated/api';
import { ThermalTicketModal } from './ThermalTicketModal';

const paymentApi = api.injectEndpoints({
  endpoints: (build) => ({
    generarCuenta: build.mutation<any, number>({
      query: (idPedido) => ({
        url: `/api/Cuentas/Generar/${idPedido}`,
        method: 'POST'
      })
    }),
    registrarPago: build.mutation<any, { idCuenta: number; monto: number; idMetodoDePago: number; propina: number }>({
      query: (body) => ({
        url: '/api/Pagos/Registrar',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Pedido', 'Mesa']
    })
  })
});

export const { useGenerarCuentaMutation, useRegistrarPagoMutation } = paymentApi;

export function PaymentModal({ isOpen, onClose, idPedido, onPaymentSuccess }: any) {
  const [generarCuenta, { isLoading: isGenerating }] = useGenerarCuentaMutation();
  const [registrarPago, { isLoading: isPaying }] = useRegistrarPagoMutation();
  const { data: metodosData } = useCatalogosGetAllQuery({ catalog: 'metodos-pago' });
  const { addToast } = useToast();

  const [cuenta, setCuenta] = useState<any>(null);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [idMetodo, setIdMetodo] = useState<number>(1);
  const [propina, setPropina] = useState('0');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [selectedSplit, setSelectedSplit] = useState<number>(1);
  const [showFinalTicket, setShowFinalTicket] = useState(false);
  const [finalTicketData, setFinalTicketData] = useState<any>(null);

  const metodos = Array.isArray((metodosData as any)?.data) ? (metodosData as any).data : [];

  const cargarCuenta = (id: number) => {
    generarCuenta(id).unwrap()
      .then(res => {
        if (res?.isSuccess) {
          const c = res.data;
          setCuenta(c);
          const saldo = c.saldoRestante !== undefined ? c.saldoRestante : c.total;
          setMontoRecibido(saldo.toFixed(2));
          setSelectedSplit(1);
          setPropina('0');
          setSelectedPercentage(null);
        } else {
          addToast({ message: res?.message || 'Error al generar cuenta', variant: 'error' });
          onClose();
        }
      })
      .catch(() => {
        addToast({ message: 'Error de red al generar cuenta', variant: 'error' });
        onClose();
      });
  };

  useEffect(() => {
    if (isOpen && idPedido) {
      setCuenta(null);
      setMontoRecibido('');
      setPropina('0');
      setSelectedPercentage(null);
      setSelectedSplit(1);
      cargarCuenta(idPedido);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idPedido]);

  const saldoActual = cuenta ? (cuenta.saldoRestante !== undefined ? cuenta.saldoRestante : cuenta.total) : 0;
  const montoActual = parseFloat(montoRecibido) || 0;

  const handleSelectSplit = (divisor: number) => {
    setSelectedSplit(divisor);
    if (!cuenta) return;
    const parte = Math.round((saldoActual / divisor) * 100) / 100;
    setMontoRecibido(parte.toFixed(2));
    if (selectedPercentage) {
      setPropina(((parte * selectedPercentage) / 100).toFixed(2));
    }
  };

  const handleSelectPercentage = (pct: number) => {
    if (!cuenta) return;
    const base = montoActual > 0 ? montoActual : saldoActual;
    if (selectedPercentage === pct) {
      setSelectedPercentage(null);
      setPropina('0');
    } else {
      setSelectedPercentage(pct);
      const calculated = ((base * pct) / 100).toFixed(2);
      setPropina(calculated);
    }
  };

  const handlePropinaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPercentage(null);
    setPropina(e.target.value);
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSplit(0);
    setMontoRecibido(e.target.value);
    if (selectedPercentage) {
      const val = parseFloat(e.target.value) || 0;
      setPropina(((val * selectedPercentage) / 100).toFixed(2));
    }
  };

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!cuenta) return;
    const monto = parseFloat(montoRecibido);
    if (isNaN(monto) || monto <= 0) {
      addToast({ message: 'Ingrese un monto válido a pagar', variant: 'error' });
      return;
    }

    const saldo = cuenta.saldoRestante !== undefined ? cuenta.saldoRestante : cuenta.total;
    const esPagoFinal = monto >= (saldo - 0.01);

    try {
      const res = await registrarPago({
        idCuenta: cuenta.id,
        monto: monto,
        idMetodoDePago: idMetodo,
        propina: parseFloat(propina) || 0
      }).unwrap();

      if (res?.isSuccess) {
        if (esPagoFinal) {
          addToast({ message: 'Cuenta liquidada exitosamente. Mesa liberada.', variant: 'success' });
          // Preparar datos para el Ticket Final
          const metodoNombre = metodos.find((m: any) => m.id === idMetodo)?.descripcion || 'Efectivo';
          const nuevosPagos = [
            ...(cuenta.pagosRealizados || []),
            {
              id: Date.now(),
              monto: monto,
              propina: parseFloat(propina) || 0,
              metodoDePago: metodoNombre,
              pagadoEn: new Date().toISOString()
            }
          ];

          setFinalTicketData({
            ...cuenta,
            totalPagado: (cuenta.totalPagado || 0) + monto,
            saldoRestante: 0,
            pagosRealizados: nuevosPagos
          });
          setShowFinalTicket(true);
        } else {
          const nuevoSaldo = Math.max(0, saldo - monto);
          addToast({ 
            message: `Abono de $${monto.toFixed(2)} registrado. Saldo pendiente: $${nuevoSaldo.toFixed(2)}`, 
            variant: 'success' 
          });
          // Recargar cuenta para el siguiente abono
          cargarCuenta(idPedido);
        }
      } else {
        addToast({ message: res?.message || 'Error al registrar pago', variant: 'error' });
      }
    } catch {
      addToast({ message: 'Error de conexión', variant: 'error' });
    }
  };

  return (
    <div className="pos-modal-overlay">
      <div 
        className="pos-modal-content" 
        style={{ 
          width: '90%',
          maxWidth: 550, 
          padding: 0, 
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg, 20px)',
          boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))',
          backgroundColor: 'var(--color-bg, #FFFFFF)'
        }}
      >
        <div style={{ padding: 'var(--space-6, 24px)', borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.12))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: 'var(--color-text, #1F1F1F)', fontFamily: 'var(--font-h2)' }}>Cobrar Pedido #{idPedido}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted, #6B7280)', display: 'flex', alignItems: 'center' }}>
            <X size={22} />
          </button>
        </div>
        
        <div style={{ padding: 'var(--space-6, 24px)' }}>
          {isGenerating || !cuenta ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted, #6B7280)' }}>Calculando totales...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4, 16px)' }}>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: 'var(--space-4, 16px)', borderRadius: 'var(--radius-md, 12px)', border: '1px solid var(--color-border, rgba(0,0,0,0.12))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2, 8px)' }}>
                  <span style={{ color: 'var(--color-text-muted, #6B7280)' }}>Subtotal</span>
                  <span style={{ color: 'var(--color-text, #1F1F1F)' }}>${cuenta.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2, 8px)' }}>
                  <span style={{ color: 'var(--color-text-muted, #6B7280)' }}>Impuestos</span>
                  <span style={{ color: 'var(--color-text, #1F1F1F)' }}>${cuenta.impuestoTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2, 8px)' }}>
                  <span style={{ color: 'var(--color-text-muted, #6B7280)' }}>Total de la Cuenta</span>
                  <span style={{ color: 'var(--color-text, #1F1F1F)', fontWeight: 600 }}>${cuenta.total.toFixed(2)}</span>
                </div>

                {cuenta.totalPagado > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2, 8px)', color: 'var(--color-success, #3C8D40)' }}>
                    <span>Ya Pagado ({cuenta.pagosRealizados?.length || 0} pago{(cuenta.pagosRealizados?.length || 0) > 1 ? 's' : ''})</span>
                    <span style={{ fontWeight: 600 }}>-${cuenta.totalPagado.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', width: '100%', fontWeight: 'bold', marginTop: 'var(--space-3, 12px)', paddingTop: 'var(--space-3, 12px)', borderTop: '1px solid var(--color-border, rgba(0,0,0,0.12))' }}>
                  <span style={{ color: 'var(--color-text, #1F1F1F)', fontSize: '1.1rem', flex: 1, textAlign: 'left' }}>
                    {cuenta.totalPagado > 0 ? 'SALDO RESTANTE' : 'TOTAL A PAGAR'}
                  </span>
                  <span style={{ color: 'var(--color-primary, #D64545)', fontSize: '1.5rem', textAlign: 'right' }}>
                    ${saldoActual.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* División de cuenta rápida */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2, 8px)' }}>
                  <label style={{ fontWeight: 500, fontSize: 14, color: 'var(--color-text, #1F1F1F)', margin: 0 }}>Dividir Cuenta</label>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted, #6B7280)' }}>Selecciona una parte o ingresa un monto libre</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2, 8px)' }}>
                  {[
                    { label: 'Todo (1/1)', divisor: 1 },
                    { label: '½ Mitad', divisor: 2 },
                    { label: '⅓ Tercio', divisor: 3 },
                    { label: '¼ Cuarto', divisor: 4 }
                  ].map(split => {
                    const isSelected = selectedSplit === split.divisor;
                    const splitAmount = Math.round((saldoActual / split.divisor) * 100) / 100;
                    return (
                      <button
                        key={split.divisor}
                        type="button"
                        onClick={() => handleSelectSplit(split.divisor)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 4px',
                          borderRadius: 'var(--radius-md, 12px)',
                          border: isSelected ? '2px solid var(--color-primary, #D64545)' : '1px solid var(--color-border, rgba(0,0,0,0.12))',
                          backgroundColor: isSelected ? 'rgba(214, 69, 69, 0.08)' : 'var(--color-bg, #FFFFFF)',
                          color: isSelected ? 'var(--color-primary, #D64545)' : 'var(--color-text, #1F1F1F)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontWeight: 600,
                          fontSize: '13px'
                        }}
                      >
                        <span>{split.label}</span>
                        <span style={{ fontSize: '11px', fontWeight: 400, color: isSelected ? 'var(--color-primary, #D64545)' : 'var(--color-text-muted, #6B7280)', marginTop: '2px' }}>
                          ${splitAmount.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2, 8px)', fontWeight: 500, fontSize: 14, color: 'var(--color-text, #1F1F1F)' }}>Método de Pago</label>
                <select 
                  value={idMetodo} 
                  onChange={e => setIdMetodo(Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', padding: 'var(--space-3, 12px)', borderRadius: 'var(--radius-md, 12px)', border: '1px solid var(--color-border, rgba(0,0,0,0.12))', color: 'var(--color-text, #1F1F1F)', background: 'transparent' }}
                >
                  {metodos.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.descripcion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2, 8px)', fontWeight: 500, fontSize: 14, color: 'var(--color-text, #1F1F1F)' }}>Monto a Cobrar</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={montoRecibido} 
                  onChange={handleMontoChange}
                  style={{ width: '100%', boxSizing: 'border-box', padding: 'var(--space-3, 12px)', borderRadius: 'var(--radius-md, 12px)', border: '1px solid var(--color-border, rgba(0,0,0,0.12))', fontSize: '1.1rem', color: 'var(--color-text, #1F1F1F)', outlineColor: 'var(--color-primary, #D64545)' }}
                />
                {montoActual > saldoActual && (
                  <div style={{ marginTop: 'var(--space-2, 8px)', color: 'var(--color-success, #3C8D40)', fontWeight: 500 }}>
                    Cambio sugerido: ${(montoActual - saldoActual).toFixed(2)}
                  </div>
                )}
                {montoActual < saldoActual && montoActual > 0 && (
                  <div style={{ marginTop: 'var(--space-2, 8px)', color: 'var(--color-text-muted, #6B7280)', fontSize: 13 }}>
                    Quedará un saldo pendiente de: ${(saldoActual - montoActual).toFixed(2)}
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2, 8px)' }}>
                  <label style={{ fontWeight: 500, fontSize: 14, color: 'var(--color-text, #1F1F1F)', margin: 0 }}>Propina (Opcional)</label>
                  {selectedPercentage && (
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted, #6B7280)', fontWeight: 500 }}>
                      {selectedPercentage}% del monto a cobrar
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2, 8px)', marginBottom: 'var(--space-2, 8px)' }}>
                  {[10, 15, 20].map(pct => {
                    const isSelected = selectedPercentage === pct;
                    const base = montoActual > 0 ? montoActual : saldoActual;
                    const calculatedAmount = ((base * pct) / 100).toFixed(2);
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleSelectPercentage(pct)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                          borderRadius: 'var(--radius-md, 12px)',
                          border: isSelected ? '2px solid var(--color-primary, #D64545)' : '1px solid var(--color-border, rgba(0,0,0,0.12))',
                          backgroundColor: isSelected ? 'rgba(214, 69, 69, 0.08)' : 'var(--color-bg, #FFFFFF)',
                          color: isSelected ? 'var(--color-primary, #D64545)' : 'var(--color-text, #1F1F1F)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontWeight: 600,
                          fontSize: '14px'
                        }}
                      >
                        <span>{pct}%</span>
                        <span style={{ fontSize: '11px', fontWeight: 400, color: isSelected ? 'var(--color-primary, #D64545)' : 'var(--color-text-muted, #6B7280)', marginTop: '2px' }}>
                          ${calculatedAmount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Monto personalizado"
                  value={propina} 
                  onChange={handlePropinaChange}
                  style={{ width: '100%', boxSizing: 'border-box', padding: 'var(--space-3, 12px)', borderRadius: 'var(--radius-md, 12px)', border: '1px solid var(--color-border, rgba(0,0,0,0.12))', color: 'var(--color-text, #1F1F1F)', outlineColor: 'var(--color-primary, #D64545)' }}
                />
              </div>

              <button 
                onClick={handlePay}
                disabled={isPaying || !montoRecibido || montoActual <= 0}
                style={{
                  background: 'var(--color-primary, #D64545)',
                  color: 'white',
                  padding: '16px',
                  border: 'none',
                  borderRadius: 'var(--radius-md, 12px)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: (isPaying || !montoRecibido || montoActual <= 0) ? 'not-allowed' : 'pointer',
                  opacity: (isPaying || !montoRecibido || montoActual <= 0) ? 0.6 : 1,
                  marginTop: 'var(--space-2, 8px)',
                  boxShadow: 'var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.06))'
                }}
              >
                {isPaying ? 'Procesando...' : (montoActual >= (saldoActual - 0.01) ? 'Confirmar Pago y Liquidar' : `Registrar Abono ($${montoActual.toFixed(2)})`)}
              </button>
            </div>
          )}
        </div>
      </div>

      <ThermalTicketModal
        isOpen={showFinalTicket}
        onClose={() => {
          setShowFinalTicket(false);
          onPaymentSuccess();
        }}
        idPedido={idPedido}
        tipo="ticket-final"
        cuentaData={finalTicketData}
      />
    </div>
  );
}
