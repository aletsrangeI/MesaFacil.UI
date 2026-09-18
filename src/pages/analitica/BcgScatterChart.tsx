import React, { useState, useMemo } from 'react';
import type { ItemIngenieriaMenuDTO } from '../../services/analiticaApi';

interface BcgScatterChartProps {
  items: ItemIngenieriaMenuDTO[];
  margenPromedio: number;
  umbralPopularidad: number;
  selectedItemId?: number | null;
  onSelectItem?: (item: ItemIngenieriaMenuDTO | null) => void;
}

const COLOR_MAP: Record<string, { fill: string; border: string; bg: string; name: string; icon: string }> = {
  Estrella: { fill: '#059669', border: '#047857', bg: '#ecfdf5', name: 'Estrella', icon: '⭐' },
  CaballoBatalla: { fill: '#0284c7', border: '#0369a1', bg: '#f0f9ff', name: 'Caballo de Batalla', icon: '🐎' },
  Puzzle: { fill: '#7c3aed', border: '#6d28d9', bg: '#faf5ff', name: 'Puzzle / Enigma', icon: '🧩' },
  Perro: { fill: '#dc2626', border: '#b91c1c', bg: '#fef2f2', name: 'Perro', icon: '🐕' },
};

export const BcgScatterChart: React.FC<BcgScatterChartProps> = ({
  items,
  margenPromedio,
  umbralPopularidad,
  selectedItemId,
  onSelectItem,
}) => {
  const [hoveredItem, setHoveredItem] = useState<ItemIngenieriaMenuDTO | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Dimensiones del SVG
  const width = 800;
  const height = 480;
  const margin = { top: 35, right: 35, bottom: 50, left: 65 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Escalas matemáticas
  const { maxX, maxY, maxRevenue, minRevenue } = useMemo(() => {
    if (!items.length) {
      return { maxX: 100, maxY: 50, maxRevenue: 1000, minRevenue: 0 };
    }
    const maxMarginItem = Math.max(...items.map((it) => it.margenContribucion), margenPromedio);
    const maxUnitsItem = Math.max(...items.map((it) => it.unidadesVendidas), umbralPopularidad);
    const maxRev = Math.max(...items.map((it) => it.ingresoTotal), 1);
    const minRev = Math.min(...items.map((it) => it.ingresoTotal), 0);

    return {
      maxX: Math.max(maxMarginItem * 1.25, 20),
      maxY: Math.max(maxUnitsItem * 1.25, 10),
      maxRevenue: maxRev,
      minRevenue: minRev,
    };
  }, [items, margenPromedio, umbralPopularidad]);

  // Conversión de coordenadas
  const scaleX = (val: number) => margin.left + (val / maxX) * plotWidth;
  const scaleY = (val: number) => margin.top + plotHeight - (val / maxY) * plotHeight;

  // Radio de burbuja proporcional al ingreso
  const getRadius = (revenue: number) => {
    if (maxRevenue <= minRevenue) return 14;
    const norm = (revenue - minRevenue) / (maxRevenue - minRevenue);
    return 9 + norm * 18; // Radio entre 9px y 27px
  };

  const thresholdX = scaleX(margenPromedio);
  const thresholdY = scaleY(umbralPopularidad);

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'block',
        }}
      >
        {/* Definición de sombreado de cuadrantes */}
        <defs>
          <filter id="bubble-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Fondo de los 4 Cuadrantes */}
        {/* Cuadrante Superior Izquierdo: CABALLOS DE BATALLA (X < Prom, Y >= Umbral) */}
        <rect
          x={margin.left}
          y={margin.top}
          width={Math.max(0, thresholdX - margin.left)}
          height={Math.max(0, thresholdY - margin.top)}
          fill="#f0f9ff"
        />
        <text
          x={margin.left + 12}
          y={margin.top + 22}
          fill="#0284c7"
          fontSize="11"
          fontWeight="700"
        >
          🐎 CABALLOS DE BATALLA (Bajo Margen, Alta Venta)
        </text>

        {/* Cuadrante Superior Derecho: ESTRELLAS (X >= Prom, Y >= Umbral) */}
        <rect
          x={thresholdX}
          y={margin.top}
          width={Math.max(0, margin.left + plotWidth - thresholdX)}
          height={Math.max(0, thresholdY - margin.top)}
          fill="#ecfdf5"
        />
        <text
          x={margin.left + plotWidth - 12}
          y={margin.top + 22}
          textAnchor="end"
          fill="#059669"
          fontSize="11"
          fontWeight="700"
        >
          ⭐ ESTRELLAS (Alto Margen, Alta Venta)
        </text>

        {/* Cuadrante Inferior Izquierdo: PERROS (X < Prom, Y < Umbral) */}
        <rect
          x={margin.left}
          y={thresholdY}
          width={Math.max(0, thresholdX - margin.left)}
          height={Math.max(0, margin.top + plotHeight - thresholdY)}
          fill="#fef2f2"
        />
        <text
          x={margin.left + 12}
          y={margin.top + plotHeight - 12}
          fill="#dc2626"
          fontSize="11"
          fontWeight="700"
        >
          🐕 PERROS (Bajo Margen, Baja Venta)
        </text>

        {/* Cuadrante Inferior Derecho: PUZZLES / ENIGMAS (X >= Prom, Y < Umbral) */}
        <rect
          x={thresholdX}
          y={thresholdY}
          width={Math.max(0, margin.left + plotWidth - thresholdX)}
          height={Math.max(0, margin.top + plotHeight - thresholdY)}
          fill="#faf5ff"
        />
        <text
          x={margin.left + plotWidth - 12}
          y={margin.top + plotHeight - 12}
          textAnchor="end"
          fill="#7c3aed"
          fontSize="11"
          fontWeight="700"
        >
          🧩 PUZZLES (Alto Margen, Baja Venta)
        </text>

        {/* 2. Líneas de Benchmark (Promedios) */}
        {/* Línea vertical: Margen Promedio */}
        <line
          x1={thresholdX}
          y1={margin.top}
          x2={thresholdX}
          y2={margin.top + plotHeight}
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />
        <text
          x={thresholdX + 6}
          y={margin.top + plotHeight + 35}
          fill="#64748b"
          fontSize="10"
          fontWeight="600"
        >
          Margen Prom. (${margenPromedio.toFixed(2)})
        </text>

        {/* Línea horizontal: Umbral de Popularidad */}
        <line
          x1={margin.left}
          y1={thresholdY}
          x2={margin.left + plotWidth}
          y2={thresholdY}
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />
        <text
          x={margin.left + 6}
          y={thresholdY - 6}
          fill="#64748b"
          fontSize="10"
          fontWeight="600"
        >
          Umbral Popularidad ({umbralPopularidad.toFixed(1)} u.)
        </text>

        {/* 3. Ejes X e Y */}
        <line
          x1={margin.left}
          y1={margin.top + plotHeight}
          x2={margin.left + plotWidth}
          y2={margin.top + plotHeight}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + plotHeight}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Etiquetas de ejes */}
        <text
          x={margin.left + plotWidth / 2}
          y={height - 12}
          textAnchor="middle"
          fill="#475569"
          fontSize="12"
          fontWeight="600"
        >
          Margen de Contribución Unitario ($ MXN) ──►
        </text>

        <text
          x={-(margin.top + plotHeight / 2)}
          y={18}
          transform="rotate(-90)"
          textAnchor="middle"
          fill="#475569"
          fontSize="12"
          fontWeight="600"
        >
          Popularidad (Unidades Vendidas) ──►
        </text>

        {/* 4. Burbujas de Platillos */}
        {items.map((item) => {
          const cx = scaleX(item.margenContribucion);
          const cy = scaleY(item.unidadesVendidas);
          const r = getRadius(item.ingresoTotal);
          const config = COLOR_MAP[item.cuadrante] || COLOR_MAP.Perro;
          const isSelected = selectedItemId === item.idProducto;
          const isHovered = hoveredItem?.idProducto === item.idProducto;

          return (
            <g
              key={item.idProducto}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => onSelectItem?.(isSelected ? null : item)}
              onMouseEnter={(e) => {
                setHoveredItem(item);
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
                setTooltipPos(null);
              }}
            >
              {/* Anillo de selección si está activo o en hover */}
              {(isSelected || isHovered) && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + 6}
                  fill="none"
                  stroke={config.fill}
                  strokeWidth="2.5"
                  strokeDasharray="4,3"
                  opacity="0.9"
                />
              )}

              {/* Burbuja principal */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={config.fill}
                fillOpacity={selectedItemId && !isSelected ? 0.35 : 0.88}
                stroke={isSelected ? '#0f172a' : config.border}
                strokeWidth={isSelected ? 2.5 : 1.5}
                filter="url(#bubble-glow)"
              />

              {/* Etiqueta abreviada si el radio es suficientemente grande */}
              {r >= 13 && (
                <text
                  cx={cx}
                  cy={cy}
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={r >= 18 ? '10' : '8.5'}
                  fontWeight="700"
                  pointerEvents="none"
                >
                  {item.nombreProducto.slice(0, r >= 18 ? 10 : 6)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip flotante enriquecido */}
      {hoveredItem && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPos ? `${tooltipPos.x}px` : '50%',
            top: tooltipPos ? `${tooltipPos.y - 12}px` : '50%',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 9999,
            backgroundColor: '#ffffff',
            color: '#1e293b',
            border: `1px solid ${COLOR_MAP[hoveredItem.cuadrante]?.border || '#0284c7'}`,
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            fontSize: '12px',
            minWidth: '220px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>
              {hoveredItem.nombreProducto}
            </span>
            <span
              style={{
                backgroundColor: COLOR_MAP[hoveredItem.cuadrante]?.bg,
                color: COLOR_MAP[hoveredItem.cuadrante]?.fill,
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '11px',
              }}
            >
              {COLOR_MAP[hoveredItem.cuadrante]?.icon} {COLOR_MAP[hoveredItem.cuadrante]?.name}
            </span>
          </div>

          <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '8px' }}>
            Categoría: {hoveredItem.categoria}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
            <div>
              <span style={{ color: '#64748b' }}>PVP Promedio:</span>{' '}
              <strong style={{ color: '#0284c7' }}>${hoveredItem.precioVentaPromedio.toFixed(2)}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Costo Receta:</span>{' '}
              <strong style={{ color: '#dc2626' }}>${hoveredItem.costoReceta.toFixed(2)}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Margen ($):</span>{' '}
              <strong style={{ color: '#059669' }}>${hoveredItem.margenContribucion.toFixed(2)}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Food Cost:</span>{' '}
              <strong style={{ color: hoveredItem.foodCostPct > 38 ? '#dc2626' : '#059669' }}>
                {hoveredItem.foodCostPct.toFixed(1)}%
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Vendidos:</span>{' '}
              <strong style={{ color: '#0f172a' }}>{hoveredItem.unidadesVendidas} un.</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Ingreso Total:</span>{' '}
              <strong style={{ color: '#d97706' }}>${hoveredItem.ingresoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
