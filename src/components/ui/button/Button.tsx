import React from "react";
import { cn } from "../../../lib/cn";
import "./button.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "link"
  | "confirm";
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
        {leftIcon && (
          <span className="ui-btn__icon ui-btn__icon--left" aria-hidden>
            {leftIcon}
          </span>
        )}
        <span className="ui-btn__label">{children}</span>
        {rightIcon && (
          <span className="ui-btn__icon ui-btn__icon--right" aria-hidden>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);
