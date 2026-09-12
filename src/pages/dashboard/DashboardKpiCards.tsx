// src/pages/dashboard/DashboardKpiCards.tsx
import React from 'react';
import Icon from '../../components/ui/icons/Icon';

interface DashboardKpiCardsProps {
  totalVentas: number;
  totalCuentasCobradas: number;
  mesasOcupadas: number;
  totalMesas: number;
  ticketPromedio: number;
  ticketsKdsActivos: number;
  tiempoPromedioKdsMin: number;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({
  totalVentas,
  totalCuentasCobradas,
  mesasOcupadas,
  totalMesas,
  ticketPromedio,
  ticketsKdsActivos,
  tiempoPromedioKdsMin
}) => {
  const ocupacionPct = totalMesas > 0 ? Math.round((mesasOcupadas / totalMesas) * 100) : 0;

  // Color de ocupación
  let colorOcupacion = "var(--color-success, #3c8d40)";
  if (ocupacionPct > 70) colorOcupacion = "var(--color-warning, #e2a72e)";
  if (ocupacionPct > 85) colorOcupacion = "var(--color-danger, #d64545)";

  // Color de tiempo KDS
  let colorKds = "var(--color-success, #3c8d40)";
  if (tiempoPromedioKdsMin > 10) colorKds = "var(--color-warning, #e2a72e)";
  if (tiempoPromedioKdsMin > 15) colorKds = "var(--color-danger, #d64545)";

  return (
    <div className="dash-kpi-grid">
      {/* 1. Ventas del Turno */}
      <div className="dash-kpi-card">
        <div className="dash-kpi-header">
          <span className="dash-kpi-title">Ventas del Turno</span>
          <div className="dash-kpi-icon" style={{ background: 'var(--color-success-bg, rgba(60,141,64,0.12))', color: 'var(--color-success, #3c8d40)' }}>
            <Icon name="DollarSign" />
          </div>
        </div>
        <div className="dash-kpi-value">${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div className="dash-kpi-footer">
          <span>{totalCuentasCobradas} {totalCuentasCobradas === 1 ? 'cuenta cobrada' : 'cuentas cobradas'}</span>
          <span style={{ color: 'var(--color-success, #3c8d40)', fontWeight: 700 }}>Activo hoy</span>
        </div>
      </div>

      {/* 2. Ocupación de Sala */}
      <div className="dash-kpi-card">
        <div className="dash-kpi-header">
          <span className="dash-kpi-title">Ocupación de Sala</span>
          <div className="dash-kpi-icon" style={{ background: 'var(--color-info-bg, rgba(59,130,246,0.12))', color: 'var(--color-info, #3b82f6)' }}>
            <Icon name="Users" />
          </div>
        </div>
        <div className="dash-kpi-value">{ocupacionPct}%</div>
        <div className="dash-kpi-footer">
          <span>{mesasOcupadas} de {totalMesas} mesas ocupadas</span>
          <span style={{ color: colorOcupacion, fontWeight: 700 }}>
            {ocupacionPct > 80 ? 'Alta demanda' : ocupacionPct > 40 ? 'Flujo moderado' : 'Capacidad libre'}
          </span>
        </div>
        <div className="dash-progress-bar">
          <div 
            className="dash-progress-fill" 
            style={{ width: `${ocupacionPct}%`, background: colorOcupacion }}
          />
        </div>
      </div>

      {/* 3. Ticket Promedio */}
      <div className="dash-kpi-card">
        <div className="dash-kpi-header">
          <span className="dash-kpi-title">Ticket Promedio</span>
          <div className="dash-kpi-icon" style={{ background: 'var(--color-warning-bg, rgba(226,167,46,0.14))', color: '#b45309' }}>
            <Icon name="TrendingUp" />
          </div>
        </div>
        <div className="dash-kpi-value">${ticketPromedio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div className="dash-kpi-footer">
          <span>Por mesa servida</span>
          <span style={{ color: '#b45309', fontWeight: 700 }}>Promedio del día</span>
        </div>
      </div>

      {/* 4. Ritmo KDS Cocina */}
      <div className="dash-kpi-card">
        <div className="dash-kpi-header">
          <span className="dash-kpi-title">Cocina en Vivo (KDS)</span>
          <div className="dash-kpi-icon" style={{ background: 'var(--color-danger-bg, rgba(214,69,69,0.12))', color: 'var(--color-primary, #d64545)' }}>
            <Icon name="Flame" />
          </div>
        </div>
        <div className="dash-kpi-value" style={{ color: colorKds }}>
          {tiempoPromedioKdsMin > 0 ? `${tiempoPromedioKdsMin} min` : `${ticketsKdsActivos} tickets`}
        </div>
        <div className="dash-kpi-footer">
          <span>{ticketsKdsActivos} {ticketsKdsActivos === 1 ? 'comanda en proceso' : 'comandas en proceso'}</span>
          <span style={{ color: colorKds, fontWeight: 700 }}>
            {tiempoPromedioKdsMin > 15 ? 'Demora alta' : tiempoPromedioKdsMin > 10 ? 'Tiempo estándar' : 'Cocina ágil'}
          </span>
        </div>
      </div>
    </div>
  );
};
