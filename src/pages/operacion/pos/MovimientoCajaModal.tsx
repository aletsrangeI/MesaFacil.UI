import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { useToast } from '../../../components/ui/toast';
import { useRegistrarMovimientoMutation } from '../../../services/movimientoCajaApi';
import { useCatalogosGetAllQuery } from '../../../services/generated/api';
import { useGetResumenCorteQuery } from './CorteCajaModal';
import { ArrowDownRight, ArrowUpRight, X, Check } from 'lucide-react';

interface MovimientoCajaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idSucursal?: number;
  idTurno?: number;
  onMovementSuccess?: () => void;
}

const CONCEPTOS_EGRESO_FALLBACK = [
  'Compra de Insumos',
  'Pago a Proveedor',
  'Retiro a Caja Fuerte (Drop)',
  'Gasto Operativo',
  'Otro'
];

const CONCEPTOS_INGRESO_FALLBACK = [
  'Fondo Adicional / Cambio',
  'Ingreso Extraordinario',
  'Otro'
];

export function MovimientoCajaModal({
  isOpen,
  onClose,
  idSucursal = 1,
  idTurno: propIdTurno,
  onMovementSuccess
}: MovimientoCajaModalProps) {
  const { addToast } = useToast();
  const { data: resumenData } = useGetResumenCorteQuery({ idSucursal }, { skip: !isOpen });
  const [registrarMovimiento, { isLoading }] = useRegistrarMovimientoMutation();
  const { data: conceptosRes } = useCatalogosGetAllQuery({ catalog: 'conceptos-movimiento-caja' });

  const conceptosRaw = Array.isArray((conceptosRes as any)?.data) ? (conceptosRes as any).data : [];

  const [tipo, setTipo] = useState<'Egreso' | 'Ingreso'>('Egreso');
  const [concepto, setConcepto] = useState('Compra de Insumos');
  const [monto, setMonto] = useState('');
  const [nota, setNota] = useState('');

  const conceptosFiltrados = useMemo(() => {
    const list = conceptosRaw.filter((c: any) => !c.tipo || c.tipo.toLowerCase() === tipo.toLowerCase());
    if (list.length > 0) return list.map((c: any) => c.descripcion);
    return tipo === 'Egreso' ? CONCEPTOS_EGRESO_FALLBACK : CONCEPTOS_INGRESO_FALLBACK;
  }, [conceptosRaw, tipo]);

  useEffect(() => {
    if (conceptosFiltrados.length > 0 && !conceptosFiltrados.includes(concepto)) {
      setConcepto(conceptosFiltrados[0]);
    }
  }, [conceptosFiltrados]);

  if (!isOpen) return null;

  const turnoActivoId = propIdTurno ?? resumenData?.data?.idTurno;

  const handleTipoChange = (nuevoTipo: 'Egreso' | 'Ingreso') => {
    setTipo(nuevoTipo);
    const list = conceptosRaw.filter((c: any) => !c.tipo || c.tipo.toLowerCase() === nuevoTipo.toLowerCase());
    if (list.length > 0) {
      setConcepto(list[0].descripcion);
    } else {
      setConcepto(nuevoTipo === 'Egreso' ? CONCEPTOS_EGRESO_FALLBACK[0] : CONCEPTOS_INGRESO_FALLBACK[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      addToast({ message: 'Ingresa un monto válido mayor a cero.', variant: 'error' });
      return;
    }

    if (!turnoActivoId) {
      addToast({ message: 'No hay un turno activo para registrar este movimiento.', variant: 'error' });
      return;
    }

    if (tipo === 'Egreso' && (!nota || nota.trim().length < 4)) {
      addToast({ message: 'Para salidas de efectivo es obligatoria una justificación detallada.', variant: 'error' });
      return;
    }

    const notaFormateada = `[${concepto}] ${nota.trim()}`.trim();

    try {
      const res = await registrarMovimiento({
        idTurno: turnoActivoId,
        tipo,
        monto: montoNum,
        nota: notaFormateada
      }).unwrap();

      if (res?.isSuccess !== false) {
        addToast({
          message: `${tipo === 'Egreso' ? 'Salida' : 'Entrada'} de $${montoNum.toFixed(2)} registrada exitosamente.`,
          variant: 'success'
        });
        if (onMovementSuccess) onMovementSuccess();
        setMonto('');
        setNota('');
        onClose();
      } else {
        addToast({ message: res?.message || 'Error al registrar movimiento.', variant: 'error' });
      }
    } catch {
      addToast({ message: 'Error de conexión al registrar movimiento.', variant: 'error' });
    }
  };

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 480,
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg, 20px)',
          boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1))',
          backgroundColor: 'var(--color-bg, #FFFFFF)',
          display: 'flex',
          flexDirection: 'column'
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
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text, #1F1F1F)' }}>
              Movimiento de Efectivo
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted, #6B7280)' }}>
              {turnoActivoId ? `Turno activo #${turnoActivoId}` : 'Apertura de turno requerida'}
            </span>
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Selector de Tipo (Egreso / Ingreso) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => handleTipoChange('Egreso')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                border: tipo === 'Egreso' ? '2px solid #ef4444' : '1px solid var(--color-border)',
                background: tipo === 'Egreso' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                color: tipo === 'Egreso' ? '#dc2626' : 'var(--color-text-muted)'
              }}
            >
              <ArrowDownRight size={18} />
              <span>Salida (Egreso)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTipoChange('Ingreso')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                border: tipo === 'Ingreso' ? '2px solid #10b981' : '1px solid var(--color-border)',
                background: tipo === 'Ingreso' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                color: tipo === 'Ingreso' ? '#059669' : 'var(--color-text-muted)'
              }}
            >
              <ArrowUpRight size={18} />
              <span>Entrada (Ingreso)</span>
            </button>
          </div>

          {/* Concepto / Motivo */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>
              Concepto
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {conceptosFiltrados.map((c: string) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setConcepto(c)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: concepto === c ? '1px solid var(--color-primary, #D64545)' : '1px solid var(--color-border)',
                    background: concepto === c ? 'rgba(214, 69, 69, 0.08)' : 'var(--color-surface, #F9FAFB)',
                    color: concepto === c ? 'var(--color-primary, #D64545)' : 'var(--color-text)'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Input de Monto */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
              Monto a {tipo === 'Egreso' ? 'retirar' : 'ingresar'}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 14, color: 'var(--color-text-muted)', fontSize: 18, fontWeight: 600 }}>
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 34px',
                  borderRadius: 12,
                  border: '1px solid var(--color-border)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: tipo === 'Egreso' ? '#dc2626' : '#059669',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Justificación / Nota */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
              Justificación / Detalle {tipo === 'Egreso' && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <textarea
              rows={2}
              placeholder={tipo === 'Egreso' ? 'Ej. 2 bolsas de hielo compradas en la esquina' : 'Ej. Aporte de $300 en monedas de $10'}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                boxSizing: 'border-box',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
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
              disabled={isLoading || !monto || parseFloat(monto) <= 0}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: tipo === 'Egreso' ? '#dc2626' : '#059669',
                color: '#FFFFFF',
                cursor: isLoading || !monto || parseFloat(monto) <= 0 ? 'not-allowed' : 'pointer',
                opacity: isLoading || !monto || parseFloat(monto) <= 0 ? 0.6 : 1,
                fontWeight: 600,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Check size={16} />
              {isLoading ? 'Registrando...' : `Confirmar ${tipo}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
