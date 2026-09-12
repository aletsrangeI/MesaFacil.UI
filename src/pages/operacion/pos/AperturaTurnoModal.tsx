import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { emptySplitApi as api } from '../../../services/baseApi';
import { useToast } from '../../../components/ui/toast';
import { DoorOpen, X, Check } from 'lucide-react';

const turnoApi = api.injectEndpoints({
  endpoints: (build) => ({
    abrirTurno: build.mutation<
      { isSuccess: boolean; message?: string },
      { idUsuario: number; idSucursal: number; apertura: string; cajaInicial: number }
    >({
      query: (body) => ({
        url: '/api/turno/insert-async',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Turno', 'Pedido', 'Mesa']
    })
  })
});

export const { useAbrirTurnoMutation } = turnoApi;

interface AperturaTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  idSucursal?: number;
  onTurnoAbierto?: () => void;
}

export function AperturaTurnoModal({
  isOpen,
  onClose,
  idSucursal = 1,
  onTurnoAbierto
}: AperturaTurnoModalProps) {
  const { usuarioId, nombreCompleto } = useSelector((state: RootState) => state.auth);
  const [abrirTurno, { isLoading }] = useAbrirTurnoMutation();
  const { addToast } = useToast();

  const [cajaInicial, setCajaInicial] = useState('1000.00');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const inicialNum = parseFloat(cajaInicial);
    if (isNaN(inicialNum) || inicialNum < 0) {
      addToast({ message: 'Ingresa un fondo de caja válido (mayor o igual a $0.00).', variant: 'error' });
      return;
    }

    try {
      const res = await abrirTurno({
        idUsuario: usuarioId || 1,
        idSucursal,
        apertura: new Date().toISOString(),
        cajaInicial: inicialNum
      }).unwrap();

      if (res?.isSuccess !== false) {
        addToast({
          message: `¡Turno abierto exitosamente con fondo de $${inicialNum.toFixed(2)}!`,
          variant: 'success'
        });
        if (onTurnoAbierto) onTurnoAbierto();
        onClose();
      } else {
        addToast({ message: res?.message || 'Error al abrir turno.', variant: 'error' });
      }
    } catch {
      addToast({ message: 'Error de conexión al abrir turno.', variant: 'error' });
    }
  };

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 460,
          padding: 0,
          overflow: 'hidden',
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.12))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface, #FAFAFA)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DoorOpen size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text, #1F1F1F)' }}>
                Apertura de Turno
              </h2>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted, #6B7280)' }}>
                Cajero: {nombreCompleto || 'Usuario en sesión'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-text-muted, #6B7280)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--color-text)' }}>
              Fondo Inicial de Caja (Cambio / Morralla)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 14, color: 'var(--color-text-muted)', fontSize: 18, fontWeight: 600 }}>
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={cajaInicial}
                onChange={(e) => setCajaInicial(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 34px',
                  borderRadius: 12,
                  border: '1px solid var(--color-border)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--color-primary, #D64545)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
              Ingresa la cantidad física de efectivo que se entrega en el cajón para dar cambio.
            </span>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !cajaInicial}
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                border: 'none',
                background: '#059669',
                color: '#FFFFFF',
                cursor: isLoading || !cajaInicial ? 'not-allowed' : 'pointer',
                opacity: isLoading || !cajaInicial ? 0.6 : 1,
                fontWeight: 600,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Check size={16} />
              {isLoading ? 'Abriendo turno...' : 'Iniciar Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
