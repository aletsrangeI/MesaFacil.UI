// src/components/feedback/AlertDialog.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useRef, useState } from "react";
import { AlertDialog, ConfirmProvider, useConfirm } from "./AlertDialog";

// Opción A (si estás en src/components/ui/button/Button.tsx y src/components/ui/icons/Icon.tsx)
import { Button } from "../../../ui/button/Button";
import Icon from "../../../ui/icons/Icon";

// Opción B (si tienes barrel files o rutas distintas)
// import { Button } from "@/components/ui/button";
// import Icon from "@/components/ui/icons/Icon";

const meta: Meta = {
  title: "UI/Feedback/AlertDialog",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

/* ============ Mosaico de variantes abiertas (vista rápida) ============ */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 520 }}>
      <Row title="Success">
        <AlertDialog
          open
          onClose={() => {}}
          variant="success"
          title="Acción completada"
          description="El registro fue guardado correctamente."
          confirmLabel="Entendido"
          cancelLabel="Cerrar"
          destructive={false}
          iconName="CheckCircle2"
        />
      </Row>

      <Row title="Error">
        <AlertDialog
          open
          onClose={() => {}}
          variant="error"
          title="No fue posible completar la acción"
          description="Ocurrió un error al conectar con el servidor. Inténtalo de nuevo."
          confirmLabel="Entendido"
          cancelLabel="Cerrar"
          destructive
          iconName="AlertTriangle"
        />
      </Row>

      <Row title="Info">
        <AlertDialog
          open
          onClose={() => {}}
          variant="info"
          title="Cambios sin guardar"
          description="Tienes cambios sin guardar. Asegúrate de guardarlos antes de salir."
          confirmLabel="Aceptar"
          cancelLabel="Cerrar"
          iconName="Info"
          showButtons
        />
      </Row>

      <Row title="Confirm (destructivo)">
        <AlertDialog
          open
          onClose={() => {}}
          onConfirm={() => {}}
          variant="confirm"
          title="¿Eliminar registro?"
          description="Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          destructive
          iconName="HelpCircle"
        />
      </Row>
    </div>
  ),
};

/* ================== Error controlado (usa Button del sistema) ================= */
export const ErrorControlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <CanvasCard title="Error controlado">
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Icon name="Bug" style={{ marginRight: 6 }} />
            Simular error
          </Button>
        </div>

        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          variant="error"
          title="No fue posible completar la acción"
          description="Se produjo un error inesperado. Inténtalo nuevamente."
          confirmLabel="Entendido"
          cancelLabel="Cerrar"
          destructive
          iconName="AlertTriangle"
        />
      </CanvasCard>
    );
  },
};

/* ======= Info con autocierre (3 s) – trigger con Button e Icon ======= */
export const InfoAutoClose: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }, []);

    const handleOpen = () => {
      setOpen(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setOpen(false), 3000);
    };

    return (
      <CanvasCard title="Info con autocierre (3 s)">
        <div style={{ display: "grid", gap: 8 }}>
          <Button variant="secondary" onClick={handleOpen}>
            <Icon name="Info" style={{ marginRight: 6 }} />
            Mostrar aviso informativo
          </Button>
          <small style={{ opacity: 0.7 }}>
            El diálogo se cerrará automáticamente sin interacción.
          </small>
        </div>

        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          variant="info"
          title="Actualización aplicada"
          description="Se actualizaron las configuraciones. Este mensaje se cerrará solo."
          confirmLabel="Aceptar"
          cancelLabel="Cerrar"
          destructive={false}
          lockClose={false}
          iconName="Info"
        />
      </CanvasCard>
    );
  },
};

/* ===================== Success (mensaje) – usando Button ===================== */
export const SuccessMessage: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <CanvasCard title="Success (mensaje)">
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            <Icon name="CheckCircle2" style={{ marginRight: 6 }} />
            Mostrar éxito
          </Button>
        </div>

        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          variant="success"
          title="Operación exitosa"
          description="Los cambios se guardaron correctamente."
          confirmLabel="Entendido"
          cancelLabel="Cerrar"
          destructive={false}
          iconName="CheckCircle2"
        />
      </CanvasCard>
    );
  },
};

/* ============== Imperativo con ConfirmProvider / useConfirm() ============== */
export const WithProvider: Story = {
  render: () => (
    <ConfirmProvider>
      <DemoConfirm />
    </ConfirmProvider>
  ),
};

function DemoConfirm() {
  const confirm = useConfirm();
  const [result, setResult] = useState<string>("");

  async function handleDelete() {
    const ok = await confirm({
      variant: "confirm",
      title: "¿Eliminar rol?",
      description: "Esta acción es permanente.",
      confirmLabel: "Sí, eliminar",
      cancelLabel: "Cancelar",
      destructive: true,
      iconName: "Trash2",
    });
    setResult(ok ? "Eliminado" : "Cancelado");
  }

  async function handleInfo() {
    await confirm({
      variant: "info",
      title: "Atención",
      description: "Se actualizaron algunos permisos. Revisa los cambios.",
      confirmLabel: "Aceptar",
      iconName: "Bell",
    });
    setResult("Cerrado");
  }

  return (
    <CanvasCard title="Provider / useConfirm()">
      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="primary" onClick={handleDelete}>
          <Icon name="Trash2" style={{ marginRight: 6 }} />
          Eliminar (confirm)
        </Button>
        <Button variant="ghost" onClick={handleInfo}>
          <Icon name="Bell" style={{ marginRight: 6 }} />
          Mensaje (info)
        </Button>
      </div>
      <div style={{ fontSize: 14, opacity: 0.8 }}>Resultado: {result}</div>
    </CanvasCard>
  );
}

/* ====================== Helpers de layout para el Story ===================== */

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "#f7f7f7",
        border: "1px solid rgba(0,0,0,0.06)",
        display: "grid",
        gap: 12,
      }}
    >
      <strong style={{ fontFamily: "Inter, sans-serif" }}>{title}</strong>
      <div style={{ position: "relative", height: 0 }} />
      <div style={{ position: "relative", minHeight: 0 }}>{children}</div>
    </div>
  );
}

function CanvasCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        background: "#f5f5f5",
        padding: 20,
        borderRadius: 12,
        width: 520,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <strong style={{ fontFamily: "Inter, sans-serif" }}>{title}</strong>
      <div>{children}</div>
    </div>
  );
}
