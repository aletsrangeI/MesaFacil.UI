import React from "react";
import { Trash2, AlertTriangle, Info } from "lucide-react";
import { generateUUID } from "../../../lib/uuid";
import "./confirm-dialog.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConfirmVariant = "warning" | "danger" | "info";

export interface ConfirmOptions {
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  /** Icono JSX opcional (ej. <Trash2 size={28} />) */
  icon?: React.ReactNode;
}

interface PendingConfirm extends ConfirmOptions {
  id: string;
  resolve: (value: boolean) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

type ConfirmContextValue = {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
};

const ConfirmCtx = React.createContext<ConfirmContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Devuelve `confirm(opts)` — una función que muestra el diálogo y retorna
 * `Promise<boolean>`: `true` si el usuario confirma, `false` si cancela.
 *
 * @example
 * const confirm = useConfirm();
 * const ok = await confirm({ title: '¿Eliminar?', variant: 'danger' });
 * if (ok) { ... }
 */
export function useConfirm(): (opts: ConfirmOptions) => Promise<boolean> {
  const ctx = React.useContext(ConfirmCtx);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx.confirm;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = React.useState<PendingConfirm[]>([]);

  const confirm = React.useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const id = generateUUID();
      setStack((prev) => [...prev, { ...opts, id, resolve }]);
    });
  }, []);

  const dismiss = React.useCallback((id: string, value: boolean) => {
    setStack((prev) => {
      const item = prev.find((p) => p.id === id);
      item?.resolve(value);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  return (
    <ConfirmCtx.Provider value={{ confirm }}>
      {children}
      {stack.map((item) => (
        <ConfirmDialogUI
          key={item.id}
          item={item}
          onConfirm={() => dismiss(item.id, true)}
          onCancel={() => dismiss(item.id, false)}
        />
      ))}
    </ConfirmCtx.Provider>
  );
}

// ─── UI ───────────────────────────────────────────────────────────────────────

const VARIANT_META: Record<
  ConfirmVariant,
  { iconBg: string; iconColor: string; confirmBg: string; confirmHover: string; defaultIcon: React.ReactNode }
> = {
  danger: {
    iconBg: "rgba(214, 69, 69, 0.1)",
    iconColor: "#D64545",
    confirmBg: "#D64545",
    confirmHover: "#b93c3c",
    defaultIcon: <Trash2 size={32} strokeWidth={2} />,
  },
  warning: {
    iconBg: "rgba(226, 167, 46, 0.12)",
    iconColor: "#c78b1a",
    confirmBg: "#E2A72E",
    confirmHover: "#c78b1a",
    defaultIcon: <AlertTriangle size={32} strokeWidth={2} />,
  },
  info: {
    iconBg: "rgba(59, 130, 246, 0.1)",
    iconColor: "#3b82f6",
    confirmBg: "#3b82f6",
    confirmHover: "#2563eb",
    defaultIcon: <Info size={32} strokeWidth={2} />,
  },
};

function ConfirmDialogUI({
  item,
  onConfirm,
  onCancel,
}: {
  item: PendingConfirm;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const {
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    variant = "warning",
    icon,
  } = item;

  const meta = VARIANT_META[variant];

  // Cerrar con Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="cd-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cd-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="cd-card">
        {/* Icono */}
        <div
          className="cd-icon-wrap"
          style={{ background: meta.iconBg, color: meta.iconColor }}
        >
          {icon ?? meta.defaultIcon}
        </div>

        {/* Contenido */}
        <h2 id="cd-title" className="cd-title">
          {title}
        </h2>
        {message && <p className="cd-message">{message}</p>}

        {/* Acciones */}
        <div className="cd-actions">
          <button className="cd-btn cd-btn--cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className="cd-btn cd-btn--confirm"
            style={
              {
                "--cd-confirm-bg": meta.confirmBg,
                "--cd-confirm-hover": meta.confirmHover,
              } as React.CSSProperties
            }
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
