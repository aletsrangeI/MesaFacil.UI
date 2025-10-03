// Input.tsx
import React from "react";
import "./input.css";

export type InputVisualSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputVisualSize; // visual
  inputSize?: number; // nativo (opcional), si lo necesitas
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      errorText,
      size = "md",
      inputSize, // <- si te hace falta el 'size' nativo
      leftIcon,
      rightIcon,
      required,
      className,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = errorText ? `${inputId}-error` : undefined;
    const describedBy =
      [helperId, errorId].filter(Boolean).join(" ") || undefined;
    const hasError = Boolean(errorText);

    return (
      <div className={`ui-input ${className ?? ""}`}>
        {label && (
          <label className="ui-input__label" htmlFor={inputId}>
            {label}{" "}
            {required && (
              <span className="ui-input__req" aria-hidden>
                *
              </span>
            )}
          </label>
        )}

        <div
          className={[
            "ui-input__field",
            `ui-input__field--${size}`, // usa el size visual
            hasError ? "is-error" : "is-ok",
            leftIcon ? "has-left" : "",
            rightIcon ? "has-right" : "",
          ].join(" ")}
        >
          {leftIcon && (
            <span className="ui-input__icon ui-input__icon--left" aria-hidden>
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            required={required}
            // si quieres aplicar el size nativo:
            size={inputSize}
            className="ui-input__control"
            {...rest}
          />

          {rightIcon && (
            <span className="ui-input__icon ui-input__icon--right" aria-hidden>
              {rightIcon}
            </span>
          )}
        </div>

        {helperText && !hasError && (
          <div id={helperId} className="ui-input__helper">
            {helperText}
          </div>
        )}
        {hasError && (
          <div id={errorId} className="ui-input__error" role="alert">
            {errorText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
