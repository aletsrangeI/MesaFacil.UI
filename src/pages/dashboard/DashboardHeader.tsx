// src/pages/dashboard/DashboardHeader.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/icons/Icon';

interface DashboardHeaderProps {
  userName?: string;
  resumenTurno?: any;
  onOpenApertura: () => void;
  onOpenCorteX: () => void;
  onOpenMovimiento: () => void;
  onOpenCorteCaja: () => void;
  onSeedDemo: () => void;
  isSeedingDemo?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "Operador",
  resumenTurno,
  onOpenApertura,
  onOpenCorteX,
  onOpenMovimiento,
  onOpenCorteCaja,
  onSeedDemo,
  isSeedingDemo = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const tieneTurnoActivo = !!resumenTurno?.idTurno;
  const nombreCajero = resumenTurno?.nombreUsuario || userName;
  const fondoInicial = Number(resumenTurno?.cajaInicial || 0);

  return (
    <header className="dash-header">
      <div className="dash-header-title">
        <h1>{getGreeting()}, {userName.split(' ')[0]}</h1>
        <div className="dash-header-subtitle">
          <span>{currentTime}</span>
          <span>•</span>
          {tieneTurnoActivo ? (
            <div className="dash-badge-pulse active">
              <span className="dash-pulse-dot" />
              <span>Turno #{resumenTurno.idTurno} activo • {nombreCajero} (${fondoInicial.toFixed(2)})</span>
            </div>
          ) : (
            <div className="dash-badge-pulse warning">
              <span className="dash-pulse-dot" />
              <span>Sin Turno Abierto</span>
            </div>
          )}
        </div>
      </div>

      <div className="dash-actions-toolbar">
        {!tieneTurnoActivo ? (
          <button 
            className="dash-btn-action primary"
            onClick={onOpenApertura}
          >
            <Icon name="DoorOpen" />
            <span>Abrir Turno</span>
          </button>
        ) : (
          <>
            <button 
              className="dash-btn-action"
              onClick={onOpenMovimiento}
              title="Registrar entrada o retiro de efectivo"
            >
              <Icon name="ArrowDownUp" />
              <span>Movimiento</span>
            </button>
            <button 
              className="dash-btn-action"
              onClick={onOpenCorteX}
              title="Auditoría de caja en vivo sin cerrar turno"
            >
              <Icon name="Activity" />
              <span>Corte X</span>
            </button>
            <button 
              className="dash-btn-action"
              onClick={onOpenCorteCaja}
              title="Cierre definitivo de turno y arqueo"
            >
              <Icon name="Coins" />
              <span>Corte Turno</span>
            </button>
          </>
        )}

        <Link to="/ventas/kds" className="dash-btn-action" title="Pantalla de cocina KDS en vivo">
          <Icon name="Tv" />
          <span>Monitor KDS</span>
        </Link>

        <Link to="/ventas/pos" className="dash-btn-action primary" title="Punto de venta y toma de comandas">
          <Icon name="PlusCircle" />
          <span>Nueva Orden POS</span>
        </Link>

        <button 
          className="dash-btn-action demo" 
          onClick={onSeedDemo}
          disabled={isSeedingDemo}
          title="Restablece un escenario de restaurante demo en hora pico"
        >
          <Icon name="Sparkles" />
          <span>{isSeedingDemo ? "Cargando Demo..." : "Cargar Demo"}</span>
        </button>
      </div>
    </header>
  );
};
