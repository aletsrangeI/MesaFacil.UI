import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { clearSubscriptionSuspended } from "../../state/subscriptionSlice";
import { logout } from "../../state/authSlice";
import { ShieldAlert, PhoneCall, RefreshCw, LogOut } from "lucide-react";
import "./SuspendedScreenModal.css";

export const SuspendedScreenModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isSuspended, suspensionDetails } = useSelector(
    (state: RootState) => state.subscription
  );

  if (!isSuspended) return null;

  const whatsappNumber =
    suspensionDetails?.contactoWhatsApp || "+52 33 0000 0000";
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola OrionSys, requiero soporte para reactivar la cuenta de mi restaurante en MesaFácil. (Motivo: ${
      suspensionDetails?.motivo || "Regularización de pago"
    })`
  )}`;

  const handleReintentar = () => {
    dispatch(clearSubscriptionSuspended());
    window.location.reload();
  };

  const handleLogout = () => {
    dispatch(clearSubscriptionSuspended());
    dispatch(logout());
  };

  return (
    <div className="mf-suspended-modal__backdrop" role="alertdialog" aria-modal="true">
      <div className="mf-suspended-modal__card">
        <div className="mf-suspended-modal__header">
          <div className="mf-suspended-modal__icon-wrapper">
            <ShieldAlert size={36} className="mf-suspended-modal__icon" />
          </div>
          <span className="mf-suspended-modal__tag">AVISO OPERATIVO ORIONSYS</span>
          <h2 className="mf-suspended-modal__title">
            Servicio Suspendido por Falta de Pago
          </h2>
          <p className="mf-suspended-modal__subtitle">
            {suspensionDetails?.message ||
              "El acceso a las operaciones y cobro de MesaFácil se encuentra temporalmente restringido."}
          </p>
        </div>

        <div className="mf-suspended-modal__body">
          {suspensionDetails?.motivo && (
            <div className="mf-suspended-modal__detail-item">
              <span className="mf-suspended-modal__detail-label">Detalle:</span>
              <span className="mf-suspended-modal__detail-value">
                {suspensionDetails.motivo}
              </span>
            </div>
          )}

          {suspensionDetails?.fechaFinVigencia && (
            <div className="mf-suspended-modal__detail-item">
              <span className="mf-suspended-modal__detail-label">Fecha de corte:</span>
              <span className="mf-suspended-modal__detail-value">
                {new Date(suspensionDetails.fechaFinVigencia).toLocaleDateString(
                  "es-MX",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          )}

          <div className="mf-suspended-modal__help-box">
            <p>
              Tus datos, catálogos, recetas y comandas están completamente a salvo.
              Para reactivar tu restaurante de inmediato, comunícate con el equipo
              de cobranza de OrionSys.
            </p>
          </div>
        </div>

        <div className="mf-suspended-modal__actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mf-suspended-modal__btn mf-suspended-modal__btn--primary"
          >
            <PhoneCall size={18} />
            <span>Contactar a Soporte OrionSys</span>
          </a>

          <div className="mf-suspended-modal__secondary-actions">
            <button
              onClick={handleReintentar}
              className="mf-suspended-modal__btn mf-suspended-modal__btn--outline"
              type="button"
            >
              <RefreshCw size={16} />
              <span>Verificar Reactivación</span>
            </button>

            <button
              onClick={handleLogout}
              className="mf-suspended-modal__btn mf-suspended-modal__btn--ghost"
              type="button"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
