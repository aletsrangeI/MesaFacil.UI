import React, { useState, useMemo } from 'react';
import type { ItemIngenieriaMenuDTO } from '../../services/analiticaApi';
import { X, TrendingUp, DollarSign, Percent, Sparkles, CheckSquare, Square } from 'lucide-react';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItemIngenieriaMenuDTO[];
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  if (!isOpen) return null;

  // Filtrar por defecto los Caballos de Batalla (los objetivos principales de ajuste de precio)
  const [targetCategory, setTargetCategory] = useState<'CaballoBatalla' | 'Todos'>('CaballoBatalla');
  const [adjustmentType, setAdjustmentType] = useState<'monto' | 'porcentaje'>('monto');
  const [adjustmentValue, setAdjustmentValue] = useState<number>(15); // +$15 MXN por defecto
  const [elasticityPct, setElasticityPct] = useState<number>(100); // 100% retención de volumen (conservador sin pérdida)

  // Selección individual de platillos incluidos
  const eligibleItems = useMemo(() => {
    return targetCategory === 'CaballoBatalla'
      ? items.filter((it) => it.cuadrante === 'CaballoBatalla')
      : items;
  }, [items, targetCategory]);

  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(() => {
    return new Set(items.filter((it) => it.cuadrante === 'CaballoBatalla').map((it) => it.idProducto));
  });

  // Toggle item
  const toggleItem = (id: number) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.size === eligibleItems.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(eligibleItems.map((it) => it.idProducto)));
    }
  };

  // Cálculos de la simulación
  const simulationResults = useMemo(() => {
    let extraProfitTotal = 0;
    let originalProfitTotal = 0;
    let originalRevenueTotal = 0;
    let simulatedRevenueTotal = 0;
    let originalCostTotal = 0;

    const rows = eligibleItems.map((item) => {
      const isIncluded = selectedProductIds.has(item.idProducto);
      const originalPvp = item.precioVentaPromedio;
      const originalCost = item.costoReceta;
      const originalMargin = item.margenContribucion;

      let deltaPrice = 0;
      if (isIncluded && adjustmentValue > 0) {
        if (adjustmentType === 'monto') {
          deltaPrice = adjustmentValue;
        } else {
          deltaPrice = Math.round((originalPvp * (adjustmentValue / 100)) * 100) / 100;
        }
      }

      const simulatedPvp = originalPvp + deltaPrice;
      const simulatedMargin = simulatedPvp - originalCost;
      const simulatedFoodCostPct = simulatedPvp > 0 ? (originalCost / simulatedPvp) * 100 : 0;

      // Unidades ajustadas por elasticidad
      const effectiveUnits = isIncluded
        ? Math.round(item.unidadesVendidas * (elasticityPct / 100))
        : item.unidadesVendidas;

      const itemExtraProfit = isIncluded
        ? (simulatedMargin * effectiveUnits) - (originalMargin * item.unidadesVendidas)
        : 0;

      if (isIncluded) {
        extraProfitTotal += itemExtraProfit;
        originalProfitTotal += originalMargin * item.unidadesVendidas;
        originalRevenueTotal += originalPvp * item.unidadesVendidas;
        simulatedRevenueTotal += simulatedPvp * effectiveUnits;
        originalCostTotal += originalCost * effectiveUnits;
      }

      return {
        item,
        isIncluded,
        originalPvp,
        simulatedPvp,
        originalCost,
        originalMargin,
        simulatedMargin,
        originalFoodCostPct: item.foodCostPct,
        simulatedFoodCostPct,
        effectiveUnits,
        itemExtraProfit,
      };
    });

    const originalFoodCostGlobal = originalRevenueTotal > 0 ? (originalCostTotal / originalRevenueTotal) * 100 : 0;
    const simulatedFoodCostGlobal = simulatedRevenueTotal > 0 ? (originalCostTotal / simulatedRevenueTotal) * 100 : 0;

    return {
      rows,
      extraProfitTotal: Math.round(extraProfitTotal),
      simulatedProfitTotal: Math.round(originalProfitTotal + extraProfitTotal),
      originalFoodCostGlobal,
      simulatedFoodCostGlobal,
      includedCount: rows.filter((r) => r.isIncluded).length,
    };
  }, [eligibleItems, selectedProductIds, adjustmentType, adjustmentValue, elasticityPct]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          color: '#f8fafc',
          overflow: 'hidden',
        }}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(2, 132, 199, 0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                Simulador de Impacto Financiero ("What-If")
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Proyecta el impacto en utilidad y Food Cost al optimizar precios en platillos estratégicos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body Modal */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controles de Simulación */}
          <div
            style={{
              backgroundColor: '#1e293b',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid #334155',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Tipo de Ajuste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Modo de Ajuste</label>
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
                <button
                  type="button"
                  onClick={() => setAdjustmentType('monto')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: adjustmentType === 'monto' ? '#0284c7' : 'transparent',
                    color: adjustmentType === 'monto' ? '#ffffff' : '#94a3b8',
                  }}
                >
                  <DollarSign size={14} /> Importe Fijo ($)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType('porcentaje')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: adjustmentType === 'porcentaje' ? '#0284c7' : 'transparent',
                    color: adjustmentType === 'porcentaje' ? '#ffffff' : '#94a3b8',
                  }}
                >
                  <Percent size={14} /> Porcentaje (%)
                </button>
              </div>
            </div>

            {/* Valor de Incremento */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>
                {adjustmentType === 'monto' ? 'Subida al Precio ($ MXN)' : 'Incremento Porcentual (%)'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="0"
                  step={adjustmentType === 'monto' ? '1' : '0.5'}
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  style={{
                    width: '100px',
                    padding: '6px 10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontWeight: '700',
                    fontSize: '14px',
                  }}
                />
                {/* Presets Rápidos */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {adjustmentType === 'monto' ? (
                    <>
                      {[5, 10, 15, 20].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAdjustmentValue(v)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: adjustmentValue === v ? '#0284c7' : '#0f172a',
                            color: adjustmentValue === v ? '#ffffff' : '#cbd5e1',
                            border: '1px solid #334155',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          +${v}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {[5, 8, 10, 12].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAdjustmentValue(v)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: adjustmentValue === v ? '#0284c7' : '#0f172a',
                            color: adjustmentValue === v ? '#ffffff' : '#cbd5e1',
                            border: '1px solid #334155',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          +{v}%
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Target Cuadrante */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Filtrar Catálogo</label>
              <select
                value={targetCategory}
                onChange={(e) => {
                  const val = e.target.value as 'CaballoBatalla' | 'Todos';
                  setTargetCategory(val);
                  if (val === 'CaballoBatalla') {
                    setSelectedProductIds(new Set(items.filter((it) => it.cuadrante === 'CaballoBatalla').map((it) => it.idProducto)));
                  }
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              >
                <option value="CaballoBatalla">Solo Caballos de Batalla (Recomendado)</option>
                <option value="Todos">Todos los Platillos del Menú</option>
              </select>
            </div>

            {/* Elasticidad / Retención de Ventas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>
                Retención de Demanda ({elasticityPct}%)
              </label>
              <select
                value={elasticityPct}
                onChange={(e) => setElasticityPct(Number(e.target.value))}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              >
                <option value={100}>100% (Sin caída de demanda)</option>
                <option value={95}>95% (Caída leve del 5%)</option>
                <option value={90}>90% (Caída del 10%)</option>
                <option value={85}>85% (Escenario pesimista -15%)</option>
              </select>
            </div>
          </div>

          {/* Tarjeta de Impacto Proyectado */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(2, 132, 199, 0.15))',
              border: '1px solid #10b981',
              borderRadius: '12px',
              padding: '18px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Utilidad Adicional Proyectada
              </span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={24} />
                +${simulationResults.extraProfitTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </div>
              <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                Sobre {simulationResults.includedCount} platillo(s) simulado(s)
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Optimización Food Cost %
              </span>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
                {simulationResults.originalFoodCostGlobal.toFixed(1)}% ──►{' '}
                <span style={{ color: '#34d399' }}>{simulationResults.simulatedFoodCostGlobal.toFixed(1)}%</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Reducción de {(simulationResults.originalFoodCostGlobal - simulationResults.simulatedFoodCostGlobal).toFixed(1)} pts porcentuales
              </span>
            </div>
          </div>

          {/* Tabla de Desglose de Platillos Simulados */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                Platillos Evaluados ({simulationResults.rows.length})
              </span>
              <button
                type="button"
                onClick={toggleSelectAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {selectedProductIds.size === eligibleItems.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
              </button>
            </div>

            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#1e293b',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '8px 12px', width: '40px' }}></th>
                    <th style={{ padding: '8px 12px' }}>Platillo</th>
                    <th style={{ padding: '8px 12px' }}>Cuadrante</th>
                    <th style={{ padding: '8px 12px' }}>PVP Actual</th>
                    <th style={{ padding: '8px 12px' }}>PVP Simulado</th>
                    <th style={{ padding: '8px 12px' }}>Food Cost Actual</th>
                    <th style={{ padding: '8px 12px' }}>Food Cost Simulado</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Ganancia Extra Proyectada</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationResults.rows.map((row) => (
                    <tr
                      key={row.item.idProducto}
                      onClick={() => toggleItem(row.item.idProducto)}
                      style={{
                        borderBottom: '1px solid #334155',
                        cursor: 'pointer',
                        backgroundColor: row.isIncluded ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        {row.isIncluded ? (
                          <CheckSquare size={16} color="#38bdf8" />
                        ) : (
                          <Square size={16} color="#64748b" />
                        )}
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: '600', color: '#f8fafc' }}>
                        {row.item.nombreProducto}
                      </td>
                      <td style={{ padding: '8px 12px', color: '#cbd5e1' }}>
                        {row.item.cuadrante === 'CaballoBatalla' ? '🐎 Caballo' : row.item.cuadrante}
                      </td>
                      <td style={{ padding: '8px 12px', color: '#94a3b8' }}>
                        ${row.originalPvp.toFixed(2)}
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: '700', color: row.isIncluded ? '#38bdf8' : '#94a3b8' }}>
                        ${row.simulatedPvp.toFixed(2)}
                      </td>
                      <td style={{ padding: '8px 12px', color: '#94a3b8' }}>
                        {row.originalFoodCostPct.toFixed(1)}%
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: '600', color: row.isIncluded ? '#34d399' : '#94a3b8' }}>
                        {row.simulatedFoodCostPct.toFixed(1)}%
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: row.itemExtraProfit > 0 ? '#34d399' : '#94a3b8' }}>
                        {row.itemExtraProfit > 0
                          ? `+$${row.itemExtraProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                          : '$0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1e293b',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            * Simulación basada en el volumen de ventas histórico del período seleccionado.
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cerrar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
