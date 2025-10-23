// src/components/modal/Modal.tsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../ui/icons/Icon";
import "./modal.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnOverlay?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="mf-modal__overlay"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`mf-modal mf-modal--${size}`}
        role="dialog"
        aria-modal="true"
      >
        <header className="mf-modal__header">
          <div>
            {title && <h2 className="mf-modal__title">{title}</h2>}
            {description && <p className="mf-modal__desc">{description}</p>}
          </div>
          <button
            className="mf-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <Icon name="X" size={18} />
          </button>
        </header>

        <div className="mf-modal__body">{children}</div>

        {footer && <footer className="mf-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
};
