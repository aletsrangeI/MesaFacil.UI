import type { CSSProperties } from 'react';
import {
  REGIMENES_FISCALES_SAT,
  USOS_CFDI,
  isRfcValido,
  type DatosFiscalesReceptor,
} from '../../services/facturacionApi';

export type { DatosFiscalesReceptor };

interface DatosFiscalesFormProps {
  value: DatosFiscalesReceptor;
  onChange: (value: DatosFiscalesReceptor) => void;
  /** Muestra el campo de correo electrónico (usado en POS; opcional en autofactura) */
  showEmail?: boolean;
  disabled?: boolean;
}

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: 'var(--space-3, 12px)',
  borderRadius: 'var(--radius-md, 12px)',
  border: '1px solid var(--color-border, rgba(0,0,0,0.12))',
  color: 'var(--color-text, #1F1F1F)',
  fontSize: '0.95rem',
};

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: 'var(--space-2, 8px)',
  fontWeight: 500,
  fontSize: 14,
  color: 'var(--color-text, #1F1F1F)',
};

/**
 * Formulario reutilizable de datos fiscales del receptor (RFC, Razón Social,
 * Régimen Fiscal SAT, Código Postal y Uso de CFDI). Compartido entre el checkbox
 * "Solicitar Factura Fiscal" del POS (PaymentModal) y el Portal Público de
 * Autofacturación, para mantener la misma validación de RFC (L11/L12 SAT) en ambos.
 */
export function DatosFiscalesForm({ value, onChange, showEmail = false, disabled }: DatosFiscalesFormProps) {
  const rfcTrimmed = (value.rfcReceptor || '').trim();
  const rfcInvalido = rfcTrimmed.length > 0 && !isRfcValido(rfcTrimmed);

  const set = (patch: Partial<DatosFiscalesReceptor>) => onChange({ ...value, ...patch });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3, 12px)' }}>
      <div>
        <label style={labelStyle}>RFC *</label>
        <input
          type="text"
          value={value.rfcReceptor}
          disabled={disabled}
          maxLength={13}
          placeholder="XAXX010101000"
          onChange={(e) => set({ rfcReceptor: e.target.value.toUpperCase() })}
          style={{
            ...inputStyle,
            textTransform: 'uppercase',
            borderColor: rfcInvalido ? 'var(--color-danger, #D64545)' : (inputStyle.border as string),
          }}
        />
        {rfcInvalido && (
          <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-danger, #D64545)' }}>
            RFC inválido. Debe tener 12 (persona moral) o 13 (persona física) caracteres con formato SAT.
          </div>
        )}
      </div>

      <div>
        <label style={labelStyle}>Razón Social / Nombre *</label>
        <input
          type="text"
          value={value.nombreReceptor}
          disabled={disabled}
          placeholder="Nombre o razón social tal como aparece ante el SAT"
          onChange={(e) => set({ nombreReceptor: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3, 12px)' }}>
        <div>
          <label style={labelStyle}>Régimen Fiscal *</label>
          <select
            value={value.regimenFiscalReceptor}
            disabled={disabled}
            onChange={(e) => set({ regimenFiscalReceptor: e.target.value })}
            style={{ ...inputStyle, background: disabled ? 'rgba(0,0,0,0.03)' : 'transparent' }}
          >
            <option value="">Selecciona...</option>
            {REGIMENES_FISCALES_SAT.map((r) => (
              <option key={r.clave} value={r.clave}>{r.descripcion}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Código Postal *</label>
          <input
            type="text"
            value={value.codigoPostalReceptor}
            disabled={disabled}
            maxLength={5}
            placeholder="00000"
            onChange={(e) => set({ codigoPostalReceptor: e.target.value.replace(/\D/g, '') })}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Uso de CFDI *</label>
        <select
          value={value.usoCfdi}
          disabled={disabled}
          onChange={(e) => set({ usoCfdi: e.target.value })}
          style={{ ...inputStyle, background: disabled ? 'rgba(0,0,0,0.03)' : 'transparent' }}
        >
          <option value="">Selecciona...</option>
          {USOS_CFDI.map((u) => (
            <option key={u.clave} value={u.clave}>{u.descripcion}</option>
          ))}
        </select>
      </div>

      {showEmail && (
        <div>
          <label style={labelStyle}>Correo electrónico (opcional)</label>
          <input
            type="email"
            value={value.correoReceptor || ''}
            disabled={disabled}
            placeholder="correo@ejemplo.com"
            onChange={(e) => set({ correoReceptor: e.target.value })}
            style={inputStyle}
          />
        </div>
      )}
    </div>
  );
}

export function datosFiscalesCompletos(value: DatosFiscalesReceptor): boolean {
  return (
    isRfcValido(value.rfcReceptor) &&
    !!value.nombreReceptor?.trim() &&
    !!value.regimenFiscalReceptor &&
    /^\d{5}$/.test(value.codigoPostalReceptor || '') &&
    !!value.usoCfdi
  );
}

export const DATOS_FISCALES_VACIOS: DatosFiscalesReceptor = {
  rfcReceptor: '',
  nombreReceptor: '',
  regimenFiscalReceptor: '',
  codigoPostalReceptor: '',
  usoCfdi: '',
  correoReceptor: '',
};
