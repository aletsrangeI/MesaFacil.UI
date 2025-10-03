import React from "react";
import { cn } from '../../../lib/cn';
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: false; // reservado si luego quieres polimorfismo
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
          isLoading && "is-loading",
          className
        )}
        disabled={isDisabled}
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

Button.displayName = "Button";
