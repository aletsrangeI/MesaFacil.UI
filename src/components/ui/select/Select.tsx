import React from "react";
import "./select.css";

export type SelectVisualSize = "sm" | "md" | "lg";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  /** Tamaño visual del control */
  size?: SelectVisualSize;
  /** Tamaño nativo del select (muestra N filas en select de lista) */
  selectSize?: number;
  /** Ícono opcional a la izquierda (no interactivo) */
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      helperText,
      errorText,
      size = "md",
      selectSize,
      leftIcon,
      required,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const selectId = id ?? React.useId();
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const errorId = errorText ? `${selectId}-error` : undefined;
    const describedBy =
      [helperId, errorId].filter(Boolean).join(" ") || undefined;
    const hasError = Boolean(errorText);

    return (
      <div className={`ui-select ${className ?? ""}`}>
        {label && (
          <label className="ui-select__label" htmlFor={selectId}>
            {label}{" "}
            {required && (
              <span className="ui-select__req" aria-hidden>
                *
              </span>
            )}
          </label>
        )}

        <div
          className={[
            "ui-select__field",
            `ui-select__field--${size}`,
            hasError ? "is-error" : "is-ok",
            leftIcon ? "has-left" : "",
          ].join(" ")}
        >
          {leftIcon && (
            <span className="ui-select__icon ui-select__icon--left" aria-hidden>
              {leftIcon}
            </span>
          )}

          <select
            id={selectId}
            ref={ref}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            required={required}
            size={selectSize}
            className="ui-select__control"
            {...rest}
          >
            {children}
          </select>

          {/* Chevron decorativo */}
          <span className="ui-select__chevron" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        {helperText && !hasError && (
          <div id={helperId} className="ui-select__helper">
            {helperText}
          </div>
        )}
        {hasError && (
          <div id={errorId} className="ui-select__error" role="alert">
            {errorText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
