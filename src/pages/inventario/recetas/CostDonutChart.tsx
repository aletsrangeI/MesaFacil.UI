import React, { useState } from "react";

export interface DonutSegment {
  id: string | number;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface CostDonutChartProps {
  segments: DonutSegment[];
  totalCost: number;
}

const PALETTE = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#64748b", // Slate
];

export const CostDonutChart: React.FC<CostDonutChartProps> = ({ segments, totalCost }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Asignar colores consistentes si no vienen asignados
  const coloredSegments = segments.map((s, idx) => ({
    ...s,
    color: s.color || PALETTE[idx % PALETTE.length],
  }));

  const radius = 64;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let cumulativePct = 0;

  if (coloredSegments.length === 0 || totalCost <= 0) {
    return (
      <div className="studio-donut-wrap">
        <div className="studio-donut-title">Distribución de Costos</div>
        <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
          Agrega ingredientes para visualizar el desglose del costo.
        </div>
      </div>
    );
  }

  return (
    <div className="studio-donut-wrap">
      <div className="studio-donut-title">Distribución de Costos</div>

      <div style={{ position: "relative", width: 170, height: 170 }}>
        <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: "rotate(-90deg)" }}>
          {coloredSegments.map((seg, idx) => {
            const strokeDash = (seg.percentage / 100) * circumference;
            const strokeOffset = circumference - (cumulativePct / 100) * circumference;
            cumulativePct += seg.percentage;

            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={seg.id}
                cx="85"
                cy="85"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="butt"
                style={{
                  transition: "stroke-width 0.2s ease, opacity 0.2s ease",
                  cursor: "pointer",
                  opacity: hoveredIdx === null || isHovered ? 1 : 0.6,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Centro del Donut */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {hoveredIdx !== null ? (
            <>
              <span style={{ fontSize: "0.7rem", color: "#64748b", maxWidth: 90, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {coloredSegments[hoveredIdx].label}
              </span>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                {coloredSegments[hoveredIdx].percentage}%
              </span>
              <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600 }}>
                ${coloredSegments[hoveredIdx].value.toFixed(2)}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Costo Total</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                ${totalCost.toFixed(2)}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>MXN</span>
            </>
          )}
        </div>
      </div>

      {/* Leyenda interactiva */}
      <div className="studio-donut-legend">
        {coloredSegments.slice(0, 6).map((seg, idx) => (
          <div
            key={seg.id}
            className="studio-donut-legend-item"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              cursor: "pointer",
              fontWeight: hoveredIdx === idx ? 600 : 400,
              color: hoveredIdx === idx ? "#0f172a" : "#475569",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", minWidth: 0 }}>
              <span className="studio-donut-legend-color" style={{ backgroundColor: seg.color }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
                {seg.label}
              </span>
            </div>
            <span>{seg.percentage}%</span>
          </div>
        ))}
        {coloredSegments.length > 6 && (
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textAlign: "right" }}>
            +{coloredSegments.length - 6} otros ingredientes
          </div>
        )}
      </div>
    </div>
  );
};
