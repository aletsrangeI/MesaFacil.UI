import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "./Toast";

const meta: Meta = {
  title: "UI/Feedback/Toast",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

/**
 * Muestra los tres tipos de Toast y un ejemplo con acción interactiva.
 */
function Demo() {
  const { addToast } = useToast();

  const buttons = [
    {
      label: "Mostrar Info",
      color: "#1f1f1f",
      action: () =>
        addToast({ message: "Nuevo pedido recibido", variant: "info" }),
    },
    {
      label: "Mostrar Success",
      color: "#3C8D40",
      action: () =>
        addToast({
          message: "Pedido guardado correctamente",
          variant: "success",
        }),
    },
    {
      label: "Mostrar Error",
      color: "#D64545",
      action: () =>
        addToast({
          message: "Error al conectar con el servidor",
          variant: "error",
          duration: 4000,
        }),
    },
    {
      label: "Con Acción",
      color: "#E9B949",
      action: () =>
        addToast({
          message: "Platillo agregado al carrito",
          variant: "info",
          action: {
            label: "Deshacer",
            onClick: () => alert("Deshacer clicado"),
          },
        }),
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        alignItems: "center",
        justifyItems: "center",
        background: "#f5f5f5",
        padding: "32px",
        borderRadius: "16px",
        width: "100%",
        maxWidth: 600,
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "Inter, sans-serif" }}>
        Ejemplos de Toast
      </h3>
      <p style={{ opacity: 0.7, fontSize: 14, textAlign: "center" }}>
        Usa los botones para disparar cada tipo de notificación.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {buttons.map((b) => (
          <button
            key={b.label}
            onClick={b.action}
            style={{
              background: b.color,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <ToastProvider position="bottom-right">
      <Demo />
    </ToastProvider>
  ),
};
