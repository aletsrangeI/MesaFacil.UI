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
    <Container maxWidth="full" className="py-6 px-4 md:px-8">
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="text-amber-400" size={24} />
              Inteligencia Gastronómica & Matriz BCG
            </h1>
            <span className="bg-sky-500/10 text-sky-400 text-xs px-2.5 py-0.5 rounded-full border border-sky-500/20 font-medium">
              Kasavana & Smith
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Optimización estratégica de rentabilidad, Food Cost % y recomendaciones prescriptivas de carta.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsSimulatorOpen(true)}
            disabled={!items.length}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} />
            Simulador What-If
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!items.length}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
          >
            <Download size={16} />
            Exportar Excel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Imprimir informe ejecutivo"
          >
            <Printer size={16} />
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
            title="Actualizar datos"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Presets de Fecha */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-300 mr-1">Período:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
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
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  presetFecha === p.id
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {presetFecha === 'custom' && (
            <div className="flex items-center gap-2 ml-2">
              <input
                type="date"
                value={customInicio}
                onChange={(e) => setCustomInicio(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
              />
              <span className="text-slate-500 text-xs">a</span>
              <input
                type="date"
                value={customFin}
                onChange={(e) => setCustomFin(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
              />
            </div>
          )}
        </div>

        {/* Selector de Sucursal */}
        {sucursales.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Sucursal:</span>
            <select
              value={selectedSucursal || ''}
              onChange={(e) =>
                setSelectedSucursal(e.target.value ? Number(e.target.value) : undefined)
              }
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* KPI 1: Food Cost General */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Food Cost General</span>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                {kpis.foodCostPromedioGeneral.toFixed(1)}%
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                  kpis.foodCostPromedioGeneral < 30
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : kpis.foodCostPromedioGeneral <= 38
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {kpis.foodCostPromedioGeneral < 30
                  ? 'Saludable (<30%)'
                  : kpis.foodCostPromedioGeneral <= 38
                  ? 'Ajustado (30-38%)'
                  : 'Crítico (>38%)'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <PieChart size={20} />
            </div>
          </div>

          {/* KPI 2: Margen Promedio */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Margen Promedio Unitario</span>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                ${kpis.margenPromedio.toFixed(2)} MXN
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Umbral de corte de la matriz
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>

          {/* KPI 3: Platillo Más Rentable */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-xs text-slate-400 font-medium">Mayor Margen Unitario</span>
              <div className="text-base font-bold text-slate-100 mt-1 truncate" title={kpis.platilloMasRentable}>
                {kpis.platilloMasRentable}
              </div>
              <span className="text-xs text-emerald-400 font-semibold mt-0.5 block">
                +${kpis.margenPlatilloMasRentable.toFixed(2)} MXN / plato
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <TrendingUp size={20} />
            </div>
          </div>

          {/* KPI 4: Platillo Más Vendido */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-xs text-slate-400 font-medium">Líder en Volumen</span>
              <div className="text-base font-bold text-slate-100 mt-1 truncate" title={kpis.platilloMasVendido}>
                {kpis.platilloMasVendido}
              </div>
              <span className="text-xs text-sky-400 font-semibold mt-0.5 block">
                {kpis.unidadesPlatilloMasVendido} unidades vendidas
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ChefHat size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Banner de Platillos Sin Costear */}
      {pendientes.length > 0 && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-200">
                {pendientes.length} platillo(s) vendido(s) no tienen escandallo de receta
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Para clasificarse en los cuadrantes BCG, cada platillo requiere su costo calculado en Recipe Studio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/inventario?tab=recetas')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/30 transition shrink-0"
          >
            Costear en Recipe Studio
            <ExternalLink size={14} />
          </button>
        </div>
      )}

      {/* Matriz Visual BCG (Scatter Plot) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Matriz de Cuadrantes BCG
            </h2>
            <p className="text-xs text-slate-400">
              El tamaño de cada burbuja representa los ingresos totales generados. Pasa el cursor o haz clic para detalles.
            </p>
          </div>

          {/* Filtros de Cuadrante para la Tabla */}
          {kpis && (
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveQuadrantTab('Todos')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  activeQuadrantTab === 'Todos' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveQuadrantTab('Estrella')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                  activeQuadrantTab === 'Estrella' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                ⭐ Estrellas ({kpis.cantidadEstrellas})
              </button>
              <button
                type="button"
                onClick={() => setActiveQuadrantTab('CaballoBatalla')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                  activeQuadrantTab === 'CaballoBatalla' ? 'bg-sky-600 text-white' : 'text-sky-400 hover:bg-sky-500/10'
                }`}
              >
                🐎 Caballos ({kpis.cantidadCaballos})
              </button>
              <button
                type="button"
                onClick={() => setActiveQuadrantTab('Puzzle')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                  activeQuadrantTab === 'Puzzle' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-purple-500/10'
                }`}
              >
                🧩 Puzzles ({kpis.cantidadPuzzles})
              </button>
              <button
                type="button"
                onClick={() => setActiveQuadrantTab('Perro')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                  activeQuadrantTab === 'Perro' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                🐕 Perros ({kpis.cantidadPerros})
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
            <RefreshCw className="animate-spin text-sky-400" size={28} />
            <span className="text-xs">Calculando matriz de ingeniería de menú...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-800 rounded-lg">
            <ChefHat size={32} className="text-slate-600" />
            <span className="text-sm font-medium">No se registraron ventas en el período seleccionado.</span>
            <span className="text-xs text-slate-500">Prueba ajustando el rango de fechas o cambiando de sucursal.</span>
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Filter size={16} className="text-sky-400" />
              Desglose y Acciones Prescriptivas ({filteredItems.length})
            </h3>
            {selectedItem && (
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-xs text-sky-400 hover:underline"
              >
                Limpiar selección activa ({selectedItem.nombreProducto})
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Platillo</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Cuadrante</th>
                  <th className="px-4 py-3 text-right">PVP Promedio</th>
                  <th className="px-4 py-3 text-right">Costo Receta</th>
                  <th className="px-4 py-3 text-right">Margen ($)</th>
                  <th className="px-4 py-3 text-right">Food Cost %</th>
                  <th className="px-4 py-3 text-right">Vendidos</th>
                  <th className="px-4 py-3 text-right">Utilidad Total</th>
                  <th className="px-4 py-3">Acción Recomendada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((it) => {
                  const isSelected = selectedItem?.idProducto === it.idProducto;
                  return (
                    <tr
                      key={it.idProducto}
                      onClick={() => setSelectedItem(isSelected ? null : it)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition ${
                        isSelected ? 'bg-sky-900/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-200">
                        {it.nombreProducto}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{it.categoria}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            it.cuadrante === 'Estrella'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : it.cuadrante === 'CaballoBatalla'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : it.cuadrante === 'Puzzle'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {it.cuadrante === 'Estrella' && '⭐ Estrella'}
                          {it.cuadrante === 'CaballoBatalla' && '🐎 Caballo'}
                          {it.cuadrante === 'Puzzle' && '🧩 Puzzle'}
                          {it.cuadrante === 'Perro' && '🐕 Perro'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300 font-medium">
                        ${it.precioVentaPromedio.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-rose-300">
                        ${it.costoReceta.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-bold">
                        ${it.margenContribucion.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-medium ${
                          it.foodCostPct > 38 ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {it.foodCostPct.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right text-slate-200 font-semibold">
                        {it.unidadesVendidas} un.
                      </td>
                      <td className="px-4 py-3 text-right text-amber-300 font-bold">
                        ${it.utilidadTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-xs text-[11px] leading-relaxed">
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

      {/* Modal Simulador What-If */}
      <WhatIfSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        items={items}
      />
    </Container>
  );
}
