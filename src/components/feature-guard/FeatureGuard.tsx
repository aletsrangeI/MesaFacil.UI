// src/components/feature-guard/FeatureGuard.tsx
import type { ReactNode } from "react";
import { useFeatureGate, type FeatureName } from "../../hooks/useFeatureGate";
import { UpgradeBanner } from "./UpgradeBanner";

export interface FeatureGuardProps {
  /** Feature a evaluar contra el plan de suscripción de la empresa */
  feature: FeatureName;
  /** Contenido a mostrar cuando la feature está permitida */
  children: ReactNode;
  /**
   * Contenido a mostrar cuando la feature NO está permitida.
   * Si se omite, se renderiza un <UpgradeBanner /> genérico para la feature.
   */
  fallback?: ReactNode;
  /** Nombre del plan sugerido, se usa solo si no se pasa `fallback` custom */
  planSugerido?: string;
}

/**
 * Envuelve una sección de la UI y solo la muestra si el plan actual de la
 * empresa incluye la feature indicada. Fail-open: mientras el estado de
 * suscripción no esté resuelto (cargando, error, sin datos), se muestran los
 * `children` con normalidad — nunca se bloquea por falta de información,
 * coherente con que el feature gating está desactivado por defecto en el
 * backend durante demos/pilotos.
 */
export function FeatureGuard({
  feature,
  children,
  fallback,
  planSugerido,
}: FeatureGuardProps) {
  const { permitido } = useFeatureGate(feature);

  if (permitido) return <>{children}</>;

  return (
    <>{fallback ?? <UpgradeBanner feature={feature} planSugerido={planSugerido} />}</>
  );
}

export default FeatureGuard;
