// src/components/impresoras/PrinterStatusBadge.tsx
import React, { useCallback, useEffect, useState } from "react";
import Icon from "../ui/icons/Icon";
import {
  useGetImpresorasBySucursalQuery,
  useDiagnosticarImpresoraMutation,
  type EstadoImpresora,
} from "../../services/impresorasApi";
import { PrinterDiagnosticModal } from "./PrinterDiagnosticModal";

type Severidad = "ok" | "warn" | "error";

/** Cada tanto se refresca el diagnóstico agregado sin necesidad de polling agresivo. */
const REFRESH_INTERVAL_MS = 45_000;

/** Mapea el estado semafórico del backend a una severidad visual del badge. */
function severidadDeEstado(estado: EstadoImpresora | string): Severidad {
  if (estado === "Ok") return "ok";
  if (estado === "SinPapel" || estado === "TapaAbierta") return "warn";
  return "error"; // NoAlcanzable, ErrorHardware
}

const SEVERIDAD_UI: Record<Severidad, { emoji: string; label: string; color: string }> = {
  ok: { emoji: "🟢", label: "Impresoras listas", color: "var(--color-success, #1E8E3E)" },
  warn: { emoji: "🟡", label: "Impresoras requieren atención", color: "var(--color-warning, #B9770E)" },
  error: { emoji: "🔴", label: "Impresora desconectada o sin papel", color: "var(--color-danger, #D64545)" },
};

export interface PrinterStatusBadgeProps {
  /** Sucursal actual. Por convención en la app (ver HomePage) se usa 1 por defecto. */
  idSucursal?: number;
}

export const PrinterStatusBadge: React.FC<PrinterStatusBadgeProps> = ({ idSucursal = 1 }) => {
  const { data: impresorasResp } = useGetImpresorasBySucursalQuery(idSucursal, {
    pollingInterval: REFRESH_INTERVAL_MS,
  });
  const [diagnosticar] = useDiagnosticarImpresoraMutation();

  const impresoras = impresorasResp?.data ?? [];
  const [severidad, setSeveridad] = useState<Severidad>("ok");
  const [modalOpen, setModalOpen] = useState(false);

  const refrescarEstadoAgregado = useCallback(async () => {
    if (impresoras.length === 0) {
      setSeveridad("ok");
      return;
    }
    try {
      const resultados = await Promise.all(
        impresoras.map((imp) =>
          diagnosticar(imp.id)
            .unwrap()
            .then((r) => severidadDeEstado(r.estado))
            .catch(() => "error" as Severidad)
        )
      );
      if (resultados.includes("error")) setSeveridad("error");
      else if (resultados.includes("warn")) setSeveridad("warn");
      else setSeveridad("ok");
    } catch {
      // Falla silenciosa: nunca debe tumbar la UI del POS por un problema de impresoras.
    }
  }, [impresoras, diagnosticar]);

  useEffect(() => {
    refrescarEstadoAgregado();
    const interval = setInterval(refrescarEstadoAgregado, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impresoras.length]);

  const ui = SEVERIDAD_UI[severidad];

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        title={ui.label}
        aria-label={`Estado de impresoras: ${ui.label}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: "var(--radius-md, 8px)",
        }}
      >
        <Icon name="Printer" size={18} color={ui.color} />
        <span aria-hidden="true" style={{ fontSize: 12, lineHeight: 1 }}>
          {ui.emoji}
        </span>
      </button>

      <PrinterDiagnosticModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        idSucursal={idSucursal}
        onDiagnosticoActualizado={refrescarEstadoAgregado}
      />
    </>
  );
};

export default PrinterStatusBadge;
