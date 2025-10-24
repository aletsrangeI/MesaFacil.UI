import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Icon from "../../../ui/icons/Icon";
import { Button } from "../../../ui/button/Button";
import "./alert-dialog.css";

export type AlertVariant = "confirm" | "success" | "error" | "info";

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  variant?: AlertVariant;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  iconName?: string; // opcional, override manual del ícono Lucide
  lockClose?: boolean;
  showButtons?: boolean;
}

const DEFAULT_ICONS: Record<AlertVariant, string> = {
  confirm: "HelpCircle",
  success: "CheckCircle2",
  error: "AlertTriangle",
  info: "Info",
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
  variant = "confirm",
  title = "¿Confirmar acción?",
  description,
  confirmLabel,
  cancelLabel,
  destructive = variant === "error" || variant === "confirm",
  iconName,
  lockClose = false,
  showButtons = true,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const labels = useMemo(() => {
    switch (variant) {
      case "success":
        return {
          confirm: confirmLabel ?? "Entendido",
          cancel: cancelLabel ?? "Cerrar",
        };
      case "error":
        return {
          confirm: confirmLabel ?? "Entendido",
          cancel: cancelLabel ?? "Cerrar",
        };
      case "info":
        return {
          confirm: confirmLabel ?? "Aceptar",
          cancel: cancelLabel ?? "Cerrar",
        };
      default:
        return {
          confirm: confirmLabel ?? "Confirmar",
          cancel: cancelLabel ?? "Cancelar",
        };
    }
  }, [variant, confirmLabel, cancelLabel]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lockClose) onClose?.();
    },
    [lockClose, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    if (!lockClose) window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, lockClose, handleKey]);

  const handleOverlay = useCallback(() => {
    if (!lockClose) onClose?.();
  }, [lockClose, onClose]);

  const handleConfirm = useCallback(async () => {
    if (!onConfirm) return onClose?.();
    try {
      setIsConfirming(true);
      await onConfirm();
      onClose?.();
    } finally {
      setIsConfirming(false);
    }
  }, [onConfirm, onClose]);

  if (!open) return null;

  const iconToRender = iconName ?? DEFAULT_ICONS[variant];

  return createPortal(
    <div
      className="ui-alert__root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ui-alert-title"
    >
      <div className="ui-alert__overlay" onClick={handleOverlay} />
      <div className={`ui-alert__panel ui-alert--${variant}`} ref={dialogRef}>
        <button
          className="ui-alert__close"
          aria-label="Cerrar"
          onClick={() => !lockClose && onClose?.()}
        >
          <Icon name="X" size={20} className="ui-alert__close-icon" />
        </button>

        <div className="ui-alert__header">
          <div className={`ui-alert__icon ui-alert__icon--${variant}`}>
            <Icon name={iconToRender as any} size={26} strokeWidth={2.2} />
          </div>
          <h3 id="ui-alert-title" className="ui-alert__title">
            {title}
          </h3>
          {description && <div className="ui-alert__desc">{description}</div>}
        </div>

        {!showButtons ? (
          <div className="ui-alert__footer">
            <Button variant="ghost" size="md" onClick={() => onClose?.()}>
              {labels.cancel}
            </Button>
            <Button
              variant={destructive ? "primary" : "secondary"}
              size="md"
              onClick={handleConfirm}
              isLoading={isConfirming}
            >
              {labels.confirm}
            </Button>
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
};

/* ========== ConfirmProvider / useConfirm (imperativo) ========== */
type ConfirmOptions = Omit<
  AlertDialogProps,
  "open" | "onClose" | "onConfirm" | "iconName"
> & { iconName?: string };

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = React.createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const ctx = React.useContext(ConfirmCtx);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<
    (ConfirmOptions & { open: boolean }) | null
  >(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    return new Promise<boolean>((resolve) => {
      const close = (ok: boolean) => {
        setState((prev) => (prev ? { ...prev, open: false } : prev));
        resolve(ok);
      };
      setState({ ...opts, open: true });
      (confirm as any).__handlers = {
        onClose: () => close(false),
        onConfirm: () => close(true),
      };
    });
  }, []);

  const handlers = (confirm as any).__handlers as
    | { onClose: () => void; onConfirm: () => void }
    | undefined;

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state && (
        <AlertDialog
          open={state.open}
          onClose={handlers?.onClose ?? (() => setState(null))}
          onConfirm={handlers?.onConfirm}
          variant={state.variant}
          title={state.title}
          description={state.description}
          confirmLabel={state.confirmLabel}
          cancelLabel={state.cancelLabel}
          destructive={state.destructive}
          iconName={state.iconName}
          lockClose={state.lockClose}
          showButtons={state.showButtons}
        />
      )}
    </ConfirmCtx.Provider>
  );
};
