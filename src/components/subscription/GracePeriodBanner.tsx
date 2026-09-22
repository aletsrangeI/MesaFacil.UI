import React from "react";
import { Clock, ExternalLink } from "lucide-react";
import { useGetMiSuscripcionQuery } from "../../services/suscripcionApi";
import { Link } from "react-router-dom";
import "./GracePeriodBanner.css";

export const GracePeriodBanner: React.FC = () => {
  const { data: suscripcion } = useGetMiSuscripcionQuery();

  if (!suscripcion || !suscripcion.enPeriodoGracia) {
    return null;
  }

  const fechaVencimiento = new Date(suscripcion.fechaFinVigencia);
  const ahora = new Date();
  const diffTime = fechaVencimiento.getTime() - ahora.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diasRestantes = diffDays > 0 ? diffDays : 0;

  return (
    <aside
      className="mf-grace-banner"
      role="alert"
      aria-label="Aviso de periodo de gracia en facturación"
    >
      <div className="mf-grace-banner__content">
        <Clock size={18} className="mf-grace-banner__icon" />
        <span className="mf-grace-banner__text">
          <strong>Periodo de Gracia Activo:</strong> Tu suscripción mensual ha
          vencido. Cuentas con{" "}
          <strong>{diasRestantes} días de cortesía</strong> para regularizar tu
          pago antes de la suspensión del servicio.
        </span>
      </div>

      <div className="mf-grace-banner__actions">
        <Link to="/planes" className="mf-grace-banner__link">
          <span>Ver Planes & Facturación</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </aside>
  );
};
