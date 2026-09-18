import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIdSucursal } from '../../state/authSlice';
import { useSucursalesGetAllQuery } from '../../services/generated/api';
import {
  useGetIngenieriaMenuQuery,
  type ItemIngenieriaMenuDTO,
} from '../../services/analiticaApi';
import { BcgScatterChart } from './BcgScatterChart';
import { WhatIfSimulatorModal } from './WhatIfSimulatorModal';
import Container from '../../components/ui/layout/Container';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Sparkles,
  Download,
  Printer,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ChefHat,
  Filter,
} from 'lucide-react';
import './menu-engineering.css';

export default function MenuEngineeringPage() {
  const navigate = useNavigate();
  const authSucursalId = useSelector(selectIdSucursal);

  // Filtros
  const [selectedSucursal, setSelectedSucursal] = useState<number | undefined>(authSucursalId);
  const [presetFecha, setPresetFecha] = useState<'7d' | '30d' | 'mes' | 'custom'>('30d');
  const [customInicio, setCustomInicio] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [customFin, setCustomFin] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [activeQuadrantTab, setActiveQuadrantTab] = useState<'Todos' | 'Estrella' | 'CaballoBatalla' | 'Puzzle' | 'Perro'>('Todos');
  const [selectedItem, setSelectedItem] = useState<ItemIngenieriaMenuDTO | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Sincronizar sucursal de sesión
  useEffect(() => {
    if (authSucursalId && selectedSucursal === undefined) {
      setSelectedSucursal(authSucursalId);
    }
  }, [authSucursalId, selectedSucursal]);

  // Lista de sucursales para el selector
  const { data: sucursalesResp } = useSucursalesGetAllQuery();
  const sucursales = Array.isArray(sucursalesResp?.data) ? sucursalesResp.data : [];

  // Rango de fechas calculado
  const { fechaInicioStr, fechaFinStr } = useMemo(() => {
    const ahora = new Date();
    if (presetFecha === '7d') {
      const d = new Date(ahora);
      d.setDate(d.getDate() - 7);
      return {
        fechaInicioStr: d.toISOString().split('T')[0],
        fechaFinStr: ahora.toISOString().split('T')[0],
      };
    }
    if (presetFecha === '30d') {
      const d = new Date(ahora);
      d.setDate(d.getDate() - 30);
      return {
        fechaInicioStr: d.toISOString().split('T')[0],
        fechaFinStr: ahora.toISOString().split('T')[0],
      };
    }
    if (presetFecha === 'mes') {
      const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      return {
        fechaInicioStr: primerDia.toISOString().split('T')[0],
        fechaFinStr: ahora.toISOString().split('T')[0],
      };
    }
    return {
      fechaInicioStr: customInicio,
      fechaFinStr: customFin,
    };
  }, [presetFecha, customInicio, customFin]);

  // Query analítica
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetIngenieriaMenuQuery(
    {
      idSucursal: selectedSucursal,
      fechaInicio: fechaInicioStr,
      fechaFin: fechaFinStr,
    },
    { refetchOnMountOrArgChange: true }
  );

  const report = apiResponse?.data;
  const items = report?.items || [];
  const pendientes = report?.pendientesDeCosteo || [];
  const kpis = report?.kpis;

  // Filtrar platillos por cuadrante en la tabla
  const filteredItems = useMemo(() => {
    if (activeQuadrantTab === 'Todos') return items;
    return items.filter((it) => it.cuadrante === activeQuadrantTab);
  }, [items, activeQuadrantTab]);

  // Exportar reporte a Excel (CSV con formato es-MX)
  const handleExportCsv = () => {
    if (!items.length) return;

    const headers = [
      'ID Producto',
      'Platillo',
      'Categoría',
      'Cuadrante BCG',
      'PVP Promedio ($)',
      'Costo Receta ($)',
      'Margen Contribución ($)',
      'Food Cost %',
      'Unidades Vendidas',
      'Mix Popularidad %',
      'Ingreso Total ($)',
      'Utilidad Total ($)',
      'Recomendación Prescriptiva',
    ];

    const rows = items.map((it) => [
      it.idProducto,
      `"${it.nombreProducto.replace(/"/g, '""')}"`,
      `"${it.categoria.replace(/"/g, '""')}"`,
      it.cuadrante,
      it.precioVentaPromedio.toFixed(2),
      it.costoReceta.toFixed(2),
      it.margenContribucion.toFixed(2),
      it.foodCostPct.toFixed(2),
      it.unidadesVendidas,
      it.porcentajePopularidad.toFixed(2),
      it.ingresoTotal.toFixed(2),
      it.utilidadTotal.toFixed(2),
      `"${it.recomendacionAccion.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Ingenieria_Menu_BCG_${fechaInicioStr}_al_${fechaFinStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Imprimir reporte ejecutivo
  const handlePrint = () => {
    window.print();
  };

  return (
    <Container maxWidth="full">
      <div className="bcg-page">
        {/* Header Principal */}
        <div className="bcg-header">
          <div className="bcg-title-group">
            <div className="bcg-title-row">
              <h1 className="bcg-title">
                <Sparkles style={{ color: '#fbbf24' }} size={24} />
                Inteligencia Gastronómica & Matriz BCG
              </h1>
              <span className="bcg-model-badge">
                Kasavana & Smith
              </span>
            </div>
            <p className="bcg-subtitle">
              Optimización estratégica de rentabilidad, Food Cost % y recomendaciones prescriptivas de carta.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="bcg-actions-group">
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              disabled={!items.length}
              className="bcg-btn bcg-btn-primary"
            >
              <Sparkles size={16} />
              Simulador What-If
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!items.length}
              className="bcg-btn bcg-btn-secondary"
            >
              <Download size={16} />
              Exportar Excel
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="bcg-btn-icon"
              title="Imprimir informe ejecutivo"
            >
              <Printer size={16} />
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="bcg-btn-icon"
              title="Actualizar datos"
            >
              <RefreshCw size={16} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="bcg-filter-bar">
          {/* Presets de Fecha */}
          <div className="bcg-filter-group">
            <Calendar size={16} style={{ color: '#94a3b8' }} />
            <span className="bcg-filter-label">Período:</span>
            <div className="bcg-period-pills">
              {[
                { id: '7d', label: '7 días' },
                { id: '30d', label: '30 días' },
                { id: 'mes', label: 'Mes actual' },
                { id: 'custom', label: 'Personalizado' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPresetFecha(p.id as any)}
                  className={`bcg-pill-btn ${presetFecha === p.id ? 'active' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {presetFecha === 'custom' && (
              <div className="bcg-filter-group" style={{ marginLeft: '0.5rem' }}>
                <input
                  type="date"
                  value={customInicio}
                  onChange={(e) => setCustomInicio(e.target.value)}
                  className="bcg-date-input"
                />
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>a</span>
                <input
                  type="date"
                  value={customFin}
                  onChange={(e) => setCustomFin(e.target.value)}
                  className="bcg-date-input"
                />
              </div>
            )}
          </div>

          {/* Selector de Sucursal */}
          {sucursales.length > 1 && (
            <div className="bcg-filter-group">
              <span className="bcg-filter-label">Sucursal:</span>
              <select
                value={selectedSucursal || ''}
                onChange={(e) =>
                  setSelectedSucursal(e.target.value ? Number(e.target.value) : undefined)
                }
                className="bcg-select"
              >
                <option value="">Todas las sucursales</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tarjetas KPI Superiores */}
        {kpis && (
          <div className="bcg-kpi-grid">
            {/* KPI 1: Food Cost General */}
            <div className="bcg-kpi-card">
              <div className="bcg-kpi-content">
                <span className="bcg-kpi-label">Food Cost General</span>
                <div className="bcg-kpi-value">
                  {kpis.foodCostPromedioGeneral.toFixed(1)}%
                </div>
                <div>
                  <span
                    className={
                      kpis.foodCostPromedioGeneral < 30
                        ? 'badge-health-saludable'
                        : kpis.foodCostPromedioGeneral <= 38
                        ? 'badge-health-ajustado'
                        : 'badge-health-critico'
                    }
                  >
                    {kpis.foodCostPromedioGeneral < 30
                      ? 'Saludable (<30%)'
                      : kpis.foodCostPromedioGeneral <= 38
                      ? 'Ajustado (30-38%)'
                      : 'Crítico (>38%)'}
                  </span>
                </div>
              </div>
              <div className="bcg-kpi-icon-wrapper icon-emerald">
                <PieChart size={22} />
              </div>
            </div>

            {/* KPI 2: Margen Promedio */}
            <div className="bcg-kpi-card">
              <div className="bcg-kpi-content">
                <span className="bcg-kpi-label">Margen Promedio Unitario</span>
                <div className="bcg-kpi-value">
                  ${kpis.margenPromedio.toFixed(2)} MXN
                </div>
                <span className="bcg-kpi-subtitle" style={{ color: '#94a3b8' }}>
                  Umbral de corte de la matriz
                </span>
              </div>
              <div className="bcg-kpi-icon-wrapper icon-sky">
                <DollarSign size={22} />
              </div>
            </div>

            {/* KPI 3: Platillo Más Rentable */}
            <div className="bcg-kpi-card">
              <div className="bcg-kpi-content">
                <span className="bcg-kpi-label">Mayor Margen Unitario</span>
                <div className="bcg-kpi-value" style={{ fontSize: '1.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={kpis.platilloMasRentable}>
                  {kpis.platilloMasRentable}
                </div>
                <span className="bcg-kpi-subtitle" style={{ color: '#34d399', fontWeight: 600 }}>
                  +${kpis.margenPlatilloMasRentable.toFixed(2)} MXN / plato
                </span>
              </div>
              <div className="bcg-kpi-icon-wrapper icon-purple">
                <TrendingUp size={22} />
              </div>
            </div>

            {/* KPI 4: Platillo Más Vendido */}
            <div className="bcg-kpi-card">
              <div className="bcg-kpi-content">
                <span className="bcg-kpi-label">Líder en Volumen</span>
                <div className="bcg-kpi-value" style={{ fontSize: '1.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={kpis.platilloMasVendido}>
                  {kpis.platilloMasVendido}
                </div>
                <span className="bcg-kpi-subtitle" style={{ color: '#38bdf8', fontWeight: 600 }}>
                  {kpis.unidadesPlatilloMasVendido} unidades vendidas
                </span>
              </div>
              <div className="bcg-kpi-icon-wrapper icon-amber">
                <ChefHat size={22} />
              </div>
            </div>
          </div>
        )}

        {/* Banner de Platillos Sin Costear */}
        {pendientes.length > 0 && (
          <div className="bcg-alert-banner">
            <div className="bcg-alert-content">
              <div className="bcg-alert-icon">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="bcg-alert-title">
                  {pendientes.length} platillo(s) vendido(s) no tienen escandallo de receta
                </h4>
                <p className="bcg-alert-text">
                  Para clasificarse en los cuadrantes BCG, cada platillo requiere su costo calculado en Recipe Studio.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/inventario?tab=recetas')}
              className="bcg-alert-btn"
            >
              Costear en Recipe Studio
              <ExternalLink size={14} />
            </button>
          </div>
        )}

        {/* Matriz Visual BCG (Scatter Plot) */}
        <div className="bcg-matrix-card">
          <div className="bcg-matrix-header">
            <div>
              <h2 className="bcg-section-title">
                Matriz de Cuadrantes BCG
              </h2>
              <p className="bcg-section-desc">
                El tamaño de cada burbuja representa los ingresos totales generados. Pasa el cursor o haz clic para detalles.
              </p>
            </div>

            {/* Filtros de Cuadrante para la Tabla */}
            {kpis && (
              <div className="bcg-quadrant-pills">
                <button
                  type="button"
                  onClick={() => setActiveQuadrantTab('Todos')}
                  className={`bcg-quadrant-btn ${activeQuadrantTab === 'Todos' ? 'active-todos' : ''}`}
                >
                  Todos ({items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuadrantTab('Estrella')}
                  className={`bcg-quadrant-btn ${activeQuadrantTab === 'Estrella' ? 'active-estrella' : ''}`}
                >
                  ⭐ Estrellas ({kpis.cantidadEstrellas})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuadrantTab('CaballoBatalla')}
                  className={`bcg-quadrant-btn ${activeQuadrantTab === 'CaballoBatalla' ? 'active-caballo' : ''}`}
                >
                  🐎 Caballos ({kpis.cantidadCaballos})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuadrantTab('Puzzle')}
                  className={`bcg-quadrant-btn ${activeQuadrantTab === 'Puzzle' ? 'active-puzzle' : ''}`}
                >
                  🧩 Puzzles ({kpis.cantidadPuzzles})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuadrantTab('Perro')}
                  className={`bcg-quadrant-btn ${activeQuadrantTab === 'Perro' ? 'active-perro' : ''}`}
                >
                  🐕 Perros ({kpis.cantidadPerros})
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div style={{ height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '0.5rem' }}>
              <RefreshCw className="animate-spin" size={28} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.8125rem' }}>Calculando matriz de ingeniería de menú...</span>
            </div>
          ) : items.length === 0 ? (
            <div style={{ height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '0.5rem', border: '1px dashed #334155', borderRadius: '0.5rem' }}>
              <ChefHat size={32} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>No se registraron ventas en el período seleccionado.</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Prueba ajustando el rango de fechas o cambiando de sucursal.</span>
            </div>
          ) : (
            <BcgScatterChart
              items={items}
              margenPromedio={report?.margenContribucionPromedio || 0}
              umbralPopularidad={report?.umbralPopularidadUnidades || 0}
              selectedItemId={selectedItem?.idProducto}
              onSelectItem={setSelectedItem}
            />
          )}
        </div>

        {/* Tabla Detallada con Recomendaciones Prescriptivas */}
        {items.length > 0 && (
          <div className="bcg-table-card">
            <div className="bcg-table-header">
              <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} style={{ color: '#38bdf8' }} />
                Desglose y Acciones Prescriptivas ({filteredItems.length})
              </h3>
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Limpiar selección activa ({selectedItem.nombreProducto})
                </button>
              )}
            </div>

            <div className="bcg-table-wrapper">
              <table className="bcg-table">
                <thead>
                  <tr>
                    <th>Platillo</th>
                    <th>Categoría</th>
                    <th>Cuadrante</th>
                    <th className="text-right">PVP Promedio</th>
                    <th className="text-right">Costo Receta</th>
                    <th className="text-right">Margen ($)</th>
                    <th className="text-right">Food Cost %</th>
                    <th className="text-right">Vendidos</th>
                    <th className="text-right">Utilidad Total</th>
                    <th>Acción Recomendada</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((it) => {
                    const isSelected = selectedItem?.idProducto === it.idProducto;
                    return (
                      <tr
                        key={it.idProducto}
                        onClick={() => setSelectedItem(isSelected ? null : it)}
                        className={isSelected ? 'selected-row' : ''}
                      >
                        <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                          {it.nombreProducto}
                        </td>
                        <td style={{ color: '#94a3b8' }}>{it.categoria}</td>
                        <td>
                          <span
                            className={`badge-cuadrante ${
                              it.cuadrante === 'Estrella'
                                ? 'badge-estrella'
                                : it.cuadrante === 'CaballoBatalla'
                                ? 'badge-caballo'
                                : it.cuadrante === 'Puzzle'
                                ? 'badge-puzzle'
                                : 'badge-perro'
                            }`}
                          >
                            {it.cuadrante === 'Estrella' && '⭐ Estrella'}
                            {it.cuadrante === 'CaballoBatalla' && '🐎 Caballo'}
                            {it.cuadrante === 'Puzzle' && '🧩 Puzzle'}
                            {it.cuadrante === 'Perro' && '🐕 Perro'}
                          </span>
                        </td>
                        <td className="text-right" style={{ color: '#cbd5e1', fontWeight: 500 }}>
                          ${it.precioVentaPromedio.toFixed(2)}
                        </td>
                        <td className="text-right" style={{ color: '#fca5a5' }}>
                          ${it.costoReceta.toFixed(2)}
                        </td>
                        <td className="text-right" style={{ color: '#34d399', fontWeight: 700 }}>
                          ${it.margenContribucion.toFixed(2)}
                        </td>
                        <td
                          className="text-right"
                          style={{
                            color: it.foodCostPct > 38 ? '#f87171' : '#cbd5e1',
                            fontWeight: 600,
                          }}
                        >
                          {it.foodCostPct.toFixed(1)}%
                        </td>
                        <td className="text-right" style={{ color: '#f8fafc', fontWeight: 600 }}>
                          {it.unidadesVendidas} un.
                        </td>
                        <td className="text-right" style={{ color: '#fbbf24', fontWeight: 700 }}>
                          ${it.utilidadTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ maxWidth: '280px', fontSize: '0.75rem', lineHeight: 1.4, color: '#94a3b8' }}>
                          {it.recomendacionAccion}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Simulador What-If */}
      <WhatIfSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        items={items}
      />
    </Container>
  );
}
