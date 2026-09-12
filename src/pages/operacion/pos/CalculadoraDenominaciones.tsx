import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface CalculadoraDenominacionesProps {
  onTotalChange: (total: number, desgloseTexto: string) => void;
}

const BILLETES = [1000, 500, 200, 100, 50, 20];
const MONEDAS = [20, 10, 5, 2, 1, 0.5];

export function CalculadoraDenominaciones({ onTotalChange }: CalculadoraDenominacionesProps) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const handleCantidadChange = (denomKey: string, valorStr: string) => {
    const val = parseInt(valorStr, 10);
    const nuevaCant = isNaN(val) || val < 0 ? 0 : val;
    setCantidades((prev) => ({ ...prev, [denomKey]: nuevaCant }));
  };

  const handleReset = () => {
    setCantidades({});
  };

  // Calcular total acumulado
  const totalCalculado = Object.entries(cantidades).reduce((sum, [key, cant]) => {
    const denom = parseFloat(key);
    return sum + (isNaN(denom) ? 0 : denom * cant);
  }, 0);

  // Generar string del desglose
  const desgloseTexto = Object.entries(cantidades)
    .filter(([_, cant]) => cant > 0)
    .map(([key, cant]) => `${cant}x$${key}`)
    .join(', ');

  useEffect(() => {
    onTotalChange(totalCalculado, desgloseTexto);
  }, [totalCalculado, desgloseTexto, onTotalChange]);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: 'var(--color-surface, #F9FAFB)',
        border: '1px solid var(--color-border, rgba(0,0,0,0.1))',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
          Desglose por Piezas de Dinero
        </span>
        <button
          type="button"
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            fontSize: 12,
            cursor: 'pointer',
            padding: '2px 6px'
          }}
        >
          <RotateCcw size={13} /> Limpiar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Columna Billetes */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', marginBottom: 8, textTransform: 'uppercase' }}>
            Billetes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {BILLETES.map((b) => {
              const cant = cantidades[b.toString()] || 0;
              const subtotal = cant * b;
              return (
                <div
                  key={`b-${b}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    gap: 6
                  }}
                >
                  <span style={{ width: 50, fontWeight: 600, color: 'var(--color-text)' }}>
                    ${b}
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={cant === 0 ? '' : cant}
                    onChange={(e) => handleCantidadChange(b.toString(), e.target.value)}
                    style={{
                      width: 60,
                      padding: '4px 6px',
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      fontSize: 12,
                      textAlign: 'center',
                      background: '#FFFFFF'
                    }}
                  />
                  <span style={{ width: 65, textAlign: 'right', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Monedas */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#d97706', marginBottom: 8, textTransform: 'uppercase' }}>
            Monedas
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MONEDAS.map((m) => {
              const cant = cantidades[m.toString()] || 0;
              const subtotal = cant * m;
              return (
                <div
                  key={`m-${m}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    gap: 6
                  }}
                >
                  <span style={{ width: 50, fontWeight: 600, color: 'var(--color-text)' }}>
                    ${m === 0.5 ? '0.50' : m}
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={cant === 0 ? '' : cant}
                    onChange={(e) => handleCantidadChange(m.toString(), e.target.value)}
                    style={{
                      width: 60,
                      padding: '4px 6px',
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      fontSize: 12,
                      textAlign: 'center',
                      background: '#FFFFFF'
                    }}
                  />
                  <span style={{ width: 65, textAlign: 'right', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtotal General Calculado */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 8,
          borderTop: '1px dashed var(--color-border)',
          fontWeight: 700,
          fontSize: 13,
          color: '#111827'
        }}
      >
        <span>Total Contado por Calculadora:</span>
        <span style={{ color: '#059669', fontSize: 15 }}>
          ${totalCalculado.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
