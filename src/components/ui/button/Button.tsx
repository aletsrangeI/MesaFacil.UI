import React from "react";
import { cn } from "../../../lib/cn";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  block?: boolean;
  iconOnly?: boolean; // si solo hay icono + aria-label
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      fullWidth = false,
      block = false,
      iconOnly = false,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const iconContent = leftIcon || (iconOnly ? children : null);

    return (
      <button
        ref={ref}
        className={cn(
          "ui-btn",
          `ui-btn--${variant}`,
          `ui-btn--${size}`,
          iconOnly && "ui-btn--icon",
          (fullWidth || block) && "ui-btn--block",
          isLoading && "is-loading",
          fullWidth && "w-100", // si usas css utilitario; si no, crea una clase .ui-btn--block{width:100%}
          className
        )}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        {...rest}
      >
        {iconContent && (
          <span
            className={cn(
              "ui-btn__icon",
              !iconOnly && Boolean(leftIcon) && "ui-btn__icon--left"
            )}
            aria-hidden
          >
            {iconContent}
          </span>
        )}
        {!iconOnly && <span className="ui-btn__label">{children}</span>}
        {!iconOnly && rightIcon && (
          <span className="ui-btn__icon ui-btn__icon--right" aria-hidden>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);
