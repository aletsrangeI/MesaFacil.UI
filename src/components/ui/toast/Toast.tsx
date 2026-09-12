import React from "react";
import { generateUUID } from "../../../lib/uuid";
import "./toast.css";

export type ToastVariant = "info" | "success" | "error";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type ToastItem = {
  id: string;
  message: string | React.ReactNode;
  variant?: ToastVariant;
  duration?: number; // ms (auto-dismiss). 0 o undefined => no autodescarta
  action?: { label: string; onClick: () => void; ariaLabel?: string };
};

type ToastContextValue = {
  addToast: (opts: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastCtx = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  max?: number; // máximo de toasts visibles simultáneamente
}

export function ToastProvider({
  children,
  position = "bottom-right",
  max = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = React.useCallback(
    (opts: Omit<ToastItem, "id">) => {
      const id = generateUUID();
      const next: ToastItem = {
        id,
        variant: "info",
        duration: 2500,
        ...opts,
      };
      setToasts((prev) => {
        const merged = [...prev, next];
        // aplica límite máximo (descarta el más antiguo)
        return merged.length > max ? merged.slice(merged.length - max) : merged;
      });
      return id;
    },
    [max]
  );

  return (
    <ToastCtx.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <ToastViewport
        toasts={toasts}
        onClose={removeToast}
        position={position}
      />
    </ToastCtx.Provider>
  );
}

/** Vista que renderiza la lista de toasts y maneja auto-dismiss + pausa al hover */
function ToastViewport({
  toasts,
  onClose,
  position,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
  position: ToastPosition;
}) {
  return (
    <div
      className={["ui-toast__viewport", `pos-${position}`].join(" ")}
      role="region"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: (id: string) => void;
}) {
  const { id, message, variant = "info", duration = 2500, action } = toast;
  const timerRef = React.useRef<number | null>(null);
  const [hovered, setHovered] = React.useState(false);

  // auto-dismiss con pausa al hover
  React.useEffect(() => {
    if (!duration || duration <= 0) return;
    if (hovered) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setTimeout(() => onClose(id), duration);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [duration, hovered, id, onClose]);

  return (
    <div
      className={["ui-toast", `ui-toast--${variant}`].join(" ")}
      role={variant === "error" ? "alert" : "status"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="ui-toast__content">{message}</div>

      {action && (
        <button
          className="ui-toast__action"
          onClick={() => {
            try {
              action.onClick();
            } finally {
              onClose(id);
            }
          }}
          aria-label={action.ariaLabel ?? action.label}
        >
          {action.label}
        </button>
      )}

      <button
        className="ui-toast__close"
        aria-label="Cerrar notificación"
        onClick={() => onClose(id)}
      >
        ×
      </button>
    </div>
  );
}
