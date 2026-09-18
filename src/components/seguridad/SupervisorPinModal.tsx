// src/components/seguridad/SupervisorPinModal.tsx
// Spec 024: Candado de Supervisor con PIN de 4 dígitos.
//
// Teclado numérico táctil + selector obligatorio de motivo. Al autorizar exitosamente, expone el
// `tokenAutorizacion` efímero (60s) recibido del backend al invocador vía `onAutorizado`, para que
// éste lo adjunte como header `X-Authorization-Token` en la operación protegida real (borrado de
// PedidoDetalle, aplicación de descuento excesivo, etc.).
import { useEffect, useState, type CSSProperties } from 'react';
import { Delete, Lock, ShieldAlert, X } from 'lucide-react';
import {
  useAutorizarSupervisorPinMutation,
  useGetMotivosCancelacionQuery,
  type AccionProtegida,
} from '../../services/seguridadSupervisorApi';
import { useCatalogosGetAllQuery } from '../../services/generated/api';

const PIN_LENGTH = 4;

/** Catálogo de respaldo si /api/auditoria/motivos-cancelacion no responde (spec 024, sección 2.2). */
const MOTIVOS_FALLBACK = [
  { id: -1, descripcion: 'Error de captura del mesero' },
  { id: -2, descripcion: 'Platillo devuelto por el comensal' },
  { id: -3, descripcion: 'Mesa se retiró sin consumir' },
  { id: -4, descripcion: 'Cortesía de la casa autorizada' },
];

/** Catálogo de respaldo para descuentos si /api/catalogos/tipos-descuento no responde o está vacío. */
const MOTIVOS_DESCUENTO_FALLBACK = [
  { id: -1, descripcion: 'Cortesía de la Casa' },
  { id: -2, descripcion: 'Compensación por Demora en Cocina' },
  { id: -3, descripcion: 'Inconformidad de Comensal con Platillo' },
  { id: -4, descripcion: 'Descuento a Colaborador / Empleado' },
  { id: -5, descripcion: 'Convenio Comercial / Descuento Empresarial' },
];

export interface SupervisorPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** "CancelarPlatilloCocina" | "DescuentoExcesivo" | "CancelarCuenta" */
  accionProtegida: AccionProtegida;
  idPedido: string;
  idPedidoDetalle?: string | null;
  /** Título contextual opcional, ej. nombre del platillo a cancelar. */
  titulo?: string;
  descripcion?: string;
  /** Si el motivo no aplica se puede omitir el selector. */
  requiereMotivo?: boolean;
  /** Etiqueta personalizada para el motivo (ej. "Motivo del Descuento") */
  labelMotivo?: string;
  /** Catálogo alternativo de motivos (por defecto consulta /api/catalogos/tipos-descuento si accionProtegida === "DescuentoExcesivo") */
  catalogoMotivos?: { id: number; descripcion: string }[];
  onAutorizado: (tokenAutorizacion: string, motivo: string, nombreSupervisor?: string) => void;
}

export function SupervisorPinModal({
  isOpen,
  onClose,
  accionProtegida,
  idPedido,
  idPedidoDetalle,
  titulo,
  descripcion,
  requiereMotivo = true,
  labelMotivo,
  catalogoMotivos,
  onAutorizado,
}: SupervisorPinModalProps) {
  const [pin, setPin] = useState('');
  const [motivo, setMotivo] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [bloqueadoHasta, setBloqueadoHasta] = useState<string | null>(null);

  const esDescuento = accionProtegida === 'DescuentoExcesivo';

  const { data: motivosData, isFetching: isFetchingMotivos } = useGetMotivosCancelacionQuery(undefined, {
    skip: !isOpen || !requiereMotivo || esDescuento || Boolean(catalogoMotivos),
  });
  const { data: tiposDescuentoData, isFetching: isFetchingTiposDescuento } = useCatalogosGetAllQuery(
    { catalog: 'tipos-descuento' },
    { skip: !isOpen || !requiereMotivo || !esDescuento || Boolean(catalogoMotivos) }
  );
  const [autorizarPin, { isLoading }] = useAutorizarSupervisorPinMutation();

  const rawTiposDescuento = (tiposDescuentoData as any)?.data;
  const catalogoTiposDescuento = Array.isArray(rawTiposDescuento)
    ? rawTiposDescuento
        .filter((x: any) => x && (x.isActive === undefined || x.isActive))
        .map((x: any) => ({
          id: x.id,
          descripcion: x.descripcion,
        }))
    : [];

  const isFetchingCatalogo = esDescuento ? isFetchingTiposDescuento : isFetchingMotivos;

  const motivosCatalogo = catalogoMotivos && catalogoMotivos.length > 0
    ? catalogoMotivos
    : esDescuento
    ? (catalogoTiposDescuento.length > 0 ? catalogoTiposDescuento : MOTIVOS_DESCUENTO_FALLBACK)
    : Array.isArray(motivosData?.data) && motivosData.data.length > 0
    ? motivosData.data
    : MOTIVOS_FALLBACK;

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setMotivo('');
      setErrorMsg(null);
      setShake(false);
      setBloqueadoHasta(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    if (isLoading || bloqueadoHasta) return;
    setErrorMsg(null);
    setPin((prev) => (prev.length >= PIN_LENGTH ? prev : prev + d));
  };

  const handleBackspace = () => {
    if (isLoading) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isLoading) return;
    setPin('');
  };

  const dispararError = (mensaje: string) => {
    setErrorMsg(mensaje);
    setShake(true);
    setPin('');
    setTimeout(() => setShake(false), 420);
  };

  const handleConfirmar = async () => {
    if (pin.length !== PIN_LENGTH) {
      dispararError('Ingresa los 4 dígitos del PIN.');
      return;
    }
    if (requiereMotivo && !motivo) {
      setErrorMsg('Selecciona un motivo antes de continuar.');
      return;
    }

    try {
      const res = await autorizarPin({
        pin,
        accionProtegida,
        idPedido,
        idPedidoDetalle: idPedidoDetalle ?? null,
        motivo: requiereMotivo ? motivo : (motivo || accionProtegida),
      }).unwrap();

      if (res.autorizado && res.tokenAutorizacion) {
        onAutorizado(res.tokenAutorizacion, motivo, res.nombreSupervisor || undefined);
      } else if (res.bloqueado) {
        setBloqueadoHasta(res.bloqueadoHastaUtc ?? null);
        dispararError(res.mensaje || 'PIN de supervisor bloqueado temporalmente por intentos fallidos.');
      } else {
        dispararError(res.mensaje || 'PIN de supervisor inválido.');
      }
    } catch {
      dispararError('Error de conexión al validar el PIN. Intenta de nuevo.');
    }
  };

  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 16,
      }}
    >
      <style>{`
        @keyframes supervisorPinShake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
        .supervisor-pin-shake { animation: supervisorPinShake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        .supervisor-pin-key:active { transform: scale(0.94); }
      `}</style>
      <div
        className={shake ? 'supervisor-pin-shake' : ''}
        style={{
          width: '95%',
          maxWidth: 380,
          background: 'var(--color-surface, #ffffff)',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert size={22} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{titulo || 'Autorización de Supervisor'}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{descripcion || 'Se requiere PIN de Gerente/Administrador'}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {requiereMotivo && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted, #64748b)', marginBottom: 6 }}>
                {labelMotivo || (esDescuento ? 'Motivo del Descuento' : 'Motivo de Cancelación')} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={motivo}
                onChange={(e) => { setMotivo(e.target.value); setErrorMsg(null); }}
                disabled={isFetchingCatalogo || isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--color-border, #cbd5e1)',
                  fontSize: '0.9rem',
                  background: 'var(--color-surface, #fff)',
                  color: 'var(--color-text, #1e293b)',
                }}
              >
                <option value="">{isFetchingCatalogo ? 'Cargando catálogo...' : 'Selecciona un motivo...'}</option>
                {motivosCatalogo.map((m) => (
                  <option key={m.id} value={m.descripcion}>{m.descripcion}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            {Array.from({ length: PIN_LENGTH }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: 44,
                  height: 52,
                  borderRadius: 10,
                  border: `2px solid ${idx < pin.length ? '#b91c1c' : 'var(--color-border, #cbd5e1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  background: idx < pin.length ? 'rgba(185,28,28,0.06)' : 'transparent',
                }}
              >
                {idx < pin.length ? '●' : ''}
              </div>
            ))}
          </div>

          {errorMsg && (
            <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 700, fontSize: '0.85rem', background: 'rgba(220,38,38,0.08)', borderRadius: 8, padding: '8px 10px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {teclas.map((k) => (
              <button
                key={k}
                type="button"
                className="supervisor-pin-key"
                onClick={() => handleDigit(k)}
                disabled={isLoading || !!bloqueadoHasta}
                style={numpadKeyStyle}
              >
                {k}
              </button>
            ))}
            <button
              type="button"
              className="supervisor-pin-key"
              onClick={handleClear}
              disabled={isLoading || !!bloqueadoHasta}
              style={{ ...numpadKeyStyle, fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)' }}
            >
              Borrar
            </button>
            <button
              type="button"
              className="supervisor-pin-key"
              onClick={() => handleDigit('0')}
              disabled={isLoading || !!bloqueadoHasta}
              style={numpadKeyStyle}
            >
              0
            </button>
            <button
              type="button"
              className="supervisor-pin-key"
              onClick={handleBackspace}
              disabled={isLoading || !!bloqueadoHasta}
              style={{ ...numpadKeyStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Borrar último dígito"
            >
              <Delete size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={isLoading || pin.length !== PIN_LENGTH || !!bloqueadoHasta}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: (isLoading || pin.length !== PIN_LENGTH || bloqueadoHasta) ? '#94a3b8' : '#b91c1c',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: (isLoading || pin.length !== PIN_LENGTH || bloqueadoHasta) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Lock size={16} />
            {isLoading ? 'Validando...' : 'Confirmar Autorización'}
          </button>
        </div>
      </div>
    </div>
  );
}

const numpadKeyStyle: CSSProperties = {
  padding: '16px 0',
  borderRadius: 12,
  border: '1px solid var(--color-border, #e2e8f0)',
  background: 'var(--color-surface-raised, #f8fafc)',
  color: 'var(--color-text, #1e293b)',
  fontSize: '1.3rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'transform 0.08s ease',
};
