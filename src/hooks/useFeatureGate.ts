// src/hooks/useFeatureGate.ts
import {
  useGetMiSuscripcionQuery,
  useGetPlanesSuscripcionQuery,
} from "../services/suscripcionApi";
import type {
  CatPlanSuscripcion,
  EmpresaSuscripcion,
} from "../services/suscripcionApi";

/**
 * Nombres de features controlables por el feature gating de planes.
 * "kds" se evalúa contra el límite numérico (maxKdsBase + kdsAddonsContratados)
 * en vez de un flag booleano, ya que el backend expone KDS como base + add-ons.
 */
export type FeatureName =
  | "mesas"
  | "splitBill"
  | "recetas"
  | "cfdiXml"
  | "cxp"
  | "kds";

export interface UseFeatureGateResult {
  /** true si la feature está permitida en el plan actual (fail-open por defecto) */
  permitido: boolean;
  /** true mientras se resuelve alguna de las consultas necesarias */
  cargando: boolean;
  /** plan del catálogo que corresponde a la suscripción actual, si se pudo resolver */
  plan?: CatPlanSuscripcion;
  /** suscripción actual de la empresa, si se pudo cargar */
  suscripcion?: EmpresaSuscripcion | null;
}

function evaluarFeature(
  feature: FeatureName,
  plan: CatPlanSuscripcion,
  suscripcion: EmpresaSuscripcion
): boolean {
  switch (feature) {
    case "mesas":
      return plan.permiteMesas;
    case "splitBill":
      return plan.permiteSplitBill;
    case "recetas":
      return plan.permiteRecetas;
    case "cfdiXml":
      return plan.permiteCfdiXml;
    case "cxp":
      return plan.permiteCxP;
    case "kds": {
      const totalKds = (plan.maxKdsBase ?? 0) + (suscripcion.kdsAddonsContratados ?? 0);
      return totalKds > 0;
    }
    default:
      return true;
  }
}

/**
 * Hook de feature gating para SaaS packaging tiers.
 *
 * IMPORTANTE — Fail-open: el feature gating está desactivado por defecto en el
 * backend (`FeatureGating:Enabled=false`) para no bloquear demos/pilotos. Este
 * hook NUNCA debe bloquear la UI por errores de red, datos aún cargando,
 * ausencia de suscripción, o si el plan correspondiente no se pudo resolver
 * en el catálogo — en todos esos casos retorna `permitido: true`. Solo
 * bloquea cuando se pudo resolver tanto la suscripción de la empresa como el
 * plan del catálogo y este último indica explícitamente que la feature no
 * está incluida.
 */
export function useFeatureGate(feature: FeatureName): UseFeatureGateResult {
  const {
    data: suscripcion,
    isLoading: cargandoSuscripcion,
    isFetching: fetchingSuscripcion,
    isError: errorSuscripcion,
  } = useGetMiSuscripcionQuery();

  const {
    data: planes,
    isLoading: cargandoPlanes,
    isFetching: fetchingPlanes,
    isError: errorPlanes,
  } = useGetPlanesSuscripcionQuery();

  const cargando =
    cargandoSuscripcion || fetchingSuscripcion || cargandoPlanes || fetchingPlanes;

  const plan = planes?.find((p) => p.id === suscripcion?.idPlan);

  // Fail-open: mientras carga, si hay error, o si faltan datos (suscripción,
  // catálogo de planes, o el plan específico), se permite.
  if (cargando || errorSuscripcion || errorPlanes || !suscripcion || !plan) {
    return { permitido: true, cargando, suscripcion, plan };
  }

  return {
    permitido: evaluarFeature(feature, plan, suscripcion),
    cargando,
    suscripcion,
    plan,
  };
}
