// src/components/impresoras/PrinterDiagnosticModal.tsx
import React, { useEffect, useState } from "react";
import { Modal } from "../modal/Modal";
import { Button } from "../ui/button/Button";
import Icon from "../ui/icons/Icon";
import { useToast } from "../ui/toast";
import {
  useGetImpresorasBySucursalQuery,
  useDiagnosticarImpresoraMutation,
  useTestPrintImpresoraMutation,
  type ConfiguracionImpresora,
  type DiagnosticoImpresoraResponse,
} from "../../services/impresorasApi";

export interface PrinterDiagnosticModalProps {
  open: boolean;
  onClose: () => void;
  idSucursal: number;
  /** Se invoca luego de correr un diagnóstico, para refrescar el ícono agregado del topbar. */
  onDiagnosticoActualizado?: () => void;
}

const ESTADO_UI: Record<
  string,
  { emoji: string; color: string; label: string }
> = {
  Ok: { emoji: "🟢", color: "var(--color-success, #1E8E3E)", label: "En línea" },
  SinPapel: { emoji: "🟡", color: "var(--color-warning, #B9770E)", label: "Sin papel" },
  TapaAbierta: { emoji: "🟡", color: "var(--color-warning, #B9770E)", label: "Tapa abierta" },
  NoAlcanzable: { emoji: "🔴", color: "var(--color-danger, #D64545)", label: "No alcanzable" },
  ErrorHardware: { emoji: "🔴", color: "var(--color-danger, #D64545)", label: "Error de hardware" },
};

function GuiaNoAlcanzable() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        marginTop: 8,
        padding: "8px 10px",
        borderRadius: "var(--radius-sm, 6px)",
        background: "var(--color-danger-bg, #FBEAEA)",
        color: "var(--color-danger-text, #7A2222)",
        fontSize: 13,
      }}
    >
      <Icon name="Cable" size={16} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>
        Verifica que esté encendida y conectada al router. Revisa las luces del puerto de red.
      </span>
    </div>
  );
}

interface CardState {
  loading: boolean;
  testLoading: boolean;
  diagnostico?: DiagnosticoImpresoraResponse;
  error?: string;
  testResultado?: { exitoso: boolean; mensaje: string };
}

function PrinterCard({
  impresora,
  onDiagnosticoActualizado,
}: {
  impresora: ConfiguracionImpresora;
  onDiagnosticoActualizado?: () => void;
}) {
  const [diagnosticar] = useDiagnosticarImpresoraMutation();
  const [testPrint] = useTestPrintImpresoraMutation();
  const { addToast } = useToast();
  const [state, setState] = useState<CardState>({ loading: false, testLoading: false });

  const ejecutarDiagnostico = async () => {
    setState((s) => ({ ...s, loading: true, error: undefined }));
    try {
      const resultado = await diagnosticar(impresora.id).unwrap();
      setState((s) => ({ ...s, loading: false, diagnostico: resultado }));
      onDiagnosticoActualizado?.();
    } catch (err: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err?.data?.message || err?.message || "No fue posible ejecutar el diagnóstico.",
      }));
    }
  };

  useEffect(() => {
    ejecutarDiagnostico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impresora.id]);

  const ejecutarTestPrint = async () => {
    setState((s) => ({ ...s, testLoading: true, testResultado: undefined }));
    try {
      const resultado = await testPrint(impresora.id).unwrap();
      setState((s) => ({ ...s, testLoading: false, testResultado: resultado }));
      addToast({
        message: resultado.mensaje,
        variant: resultado.exitoso ? "success" : "error",
      });
    } catch (err: any) {
      const mensaje = err?.data?.message || err?.message || "No fue posible enviar el test de impresión.";
      setState((s) => ({
        ...s,
        testLoading: false,
        testResultado: { exitoso: false, mensaje },
      }));
      addToast({ message: mensaje, variant: "error" });
    }
  };

  const diag = state.diagnostico;
  const estadoUi = diag ? ESTADO_UI[diag.estado] ?? ESTADO_UI.NoAlcanzable : undefined;

  return (
    <div
      style={{
        border: "1px solid var(--color-border, rgba(0,0,0,0.08))",
        borderRadius: "var(--radius-md, 10px)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{impresora.nombre}</div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted, #666)" }}>
            {impresora.direccionIp ?? "—"}
            {impresora.puerto ? `:${impresora.puerto}` : ""}
          </div>
        </div>
        {estadoUi && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span aria-hidden="true">{estadoUi.emoji}</span>
            <span style={{ color: estadoUi.color, fontWeight: 600 }}>{estadoUi.label}</span>
          </div>
        )}
      </div>

      {state.loading && (
        <div style={{ fontSize: 13, color: "var(--color-text-muted, #666)" }}>
          Ejecutando diagnóstico…
        </div>
      )}

      {state.error && (
        <div style={{ fontSize: 13, color: "var(--color-danger, #D64545)" }}>{state.error}</div>
      )}

      {diag && !state.loading && (
        <>
          <div style={{ fontSize: 13 }}>
            Latencia: <strong>{diag.latenciaMs != null ? `${diag.latenciaMs} ms` : "—"}</strong>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted, #444)" }}>
            {diag.mensajeDiagnostico}
          </div>
          {diag.accionSugerida && (
            <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--color-text-muted, #444)" }}>
              Sugerencia: {diag.accionSugerida}
            </div>
          )}
          {diag.estado === "NoAlcanzable" && <GuiaNoAlcanzable />}
        </>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Button
          variant="primary"
          size="sm"
          isLoading={state.testLoading}
          leftIcon={<Icon name="Printer" size={16} />}
          onClick={ejecutarTestPrint}
        >
          Hacer Test de Impresión
        </Button>
        <Button
          variant="secondary"
          size="sm"
          isLoading={state.loading}
          leftIcon={<Icon name="RefreshCw" size={16} />}
          onClick={ejecutarDiagnostico}
        >
          Re-ejecutar diagnóstico
        </Button>
      </div>
    </div>
  );
}

export const PrinterDiagnosticModal: React.FC<PrinterDiagnosticModalProps> = ({
  open,
  onClose,
  idSucursal,
  onDiagnosticoActualizado,
}) => {
  const { data: impresorasResp, isLoading, isError } = useGetImpresorasBySucursalQuery(idSucursal, {
    skip: !open,
  });
  const impresoras = impresorasResp?.data ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Autodiagnóstico de Impresoras"
      description="Verifica en un clic el estado físico de tus impresoras térmicas configuradas en esta sucursal."
      size="lg"
    >
      {isLoading && <div>Cargando impresoras…</div>}
      {isError && (
        <div style={{ color: "var(--color-danger, #D64545)" }}>
          No fue posible cargar las impresoras de la sucursal.
        </div>
      )}
      {!isLoading && !isError && impresoras.length === 0 && (
        <div style={{ color: "var(--color-text-muted, #666)" }}>
          No hay impresoras configuradas en esta sucursal. Ve a Gestión &gt; Impresoras para agregar una.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {impresoras.map((imp) => (
          <PrinterCard
            key={imp.id}
            impresora={imp}
            onDiagnosticoActualizado={onDiagnosticoActualizado}
          />
        ))}
      </div>
    </Modal>
  );
};

export default PrinterDiagnosticModal;
