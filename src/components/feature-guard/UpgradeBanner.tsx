// src/components/feature-guard/UpgradeBanner.tsx
import { useState } from "react";
import { Lock, Mail, Phone, Sparkles } from "lucide-react";
import { Button } from "../ui/button/Button";
import { Modal } from "../modal/Modal";
import type { FeatureName } from "../../hooks/useFeatureGate";
import "./upgrade-banner.css";

const FEATURE_LABELS: Record<FeatureName, string> = {
  mesas: "Gestión de Mesas",
  splitBill: "División de Cuenta (Split Bill)",
  recetas: "Recetas e Ingeniería de Menú",
  cfdiXml: "Facturación CFDI XML",
  cxp: "Cuentas por Pagar (CxP)",
  kds: "KDS de Cocina en Tiempo Real",
};

export interface UpgradeBannerProps {
  /** Feature bloqueada; si se omite, se usa un mensaje genérico */
  feature?: FeatureName;
  /** Nombre del plan sugerido para desbloquear la feature (ej. "Restaurante Pro") */
  planSugerido?: string;
  /** Mensaje personalizado; si se omite, se arma uno a partir de `feature`/`planSugerido` */
  mensaje?: string;
}

const CONTACTO_VENTAS = {
  email: "ventas@mesafacil.com",
  telefono: "+52 55 1234 5678",
};

export function UpgradeBanner({
  feature,
  planSugerido,
  mensaje,
}: UpgradeBannerProps) {
  const [contactoAbierto, setContactoAbierto] = useState(false);

  const etiquetaFeature = feature ? FEATURE_LABELS[feature] : "esta función";
  const textoMensaje =
    mensaje ??
    (planSugerido
      ? `Desbloquea ${etiquetaFeature} actualizando a ${planSugerido}.`
      : `Desbloquea ${etiquetaFeature} actualizando tu plan.`);

  return (
    <>
      <div className="upgrade-banner">
        <div className="upgrade-banner__icon">
          <Lock size={20} />
        </div>
        <div className="upgrade-banner__content">
          <div className="upgrade-banner__title">
            <Sparkles size={16} />
            <span>Función disponible en un plan superior</span>
          </div>
          <p className="upgrade-banner__message">{textoMensaje}</p>
          {planSugerido && (
            <span className="upgrade-banner__plan-badge">
              Plan requerido: {planSugerido}
            </span>
          )}
        </div>
        <div className="upgrade-banner__actions">
          <Button variant="primary" size="sm" onClick={() => setContactoAbierto(true)}>
            Contactar a Ventas
          </Button>
        </div>
      </div>

      <Modal
        open={contactoAbierto}
        onClose={() => setContactoAbierto(false)}
        title="Contactar a Ventas"
        description="Escríbenos para ampliar tu plan de MesaFácil y desbloquear más funciones."
        size="sm"
      >
        <div className="upgrade-banner__contact">
          <a
            className="upgrade-banner__contact-item"
            href={`mailto:${CONTACTO_VENTAS.email}?subject=${encodeURIComponent(
              "Quiero actualizar mi plan de MesaFácil"
            )}`}
          >
            <Mail size={16} />
            {CONTACTO_VENTAS.email}
          </a>
          <a
            className="upgrade-banner__contact-item"
            href={`tel:${CONTACTO_VENTAS.telefono.replace(/\s/g, "")}`}
          >
            <Phone size={16} />
            {CONTACTO_VENTAS.telefono}
          </a>
        </div>
      </Modal>
    </>
  );
}

export default UpgradeBanner;
