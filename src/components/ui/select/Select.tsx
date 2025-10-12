import React from "react";
import "./select.css";

// 👉 Si tienes el Icon en otra ruta, ajusta este import:
import Icon from "../../ui/icons/Icon"; // o "@/components/Icon"
import type { IconName } from "../../ui/icons/Icon";

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
  /** Nombre de ícono lucide (opción ergonómica). Tiene prioridad sobre `leftIcon`. */
  leftIconName?: IconName;
  /** Grosor del ícono (lucide) */
  iconStrokeWidth?: number;
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
      leftIconName,
      iconStrokeWidth = 2,
      required,
      className,
      children,
      disabled,
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
            leftIcon || leftIconName ? "has-left" : "",
            disabled ? "is-disabled" : "",
          ].join(" ")}
        >
          {(leftIconName || leftIcon) && (
            <span className="ui-select__icon ui-select__icon--left" aria-hidden>
              {leftIconName ? (
                <Icon
                  name={leftIconName}
                  size={18}
                  strokeWidth={iconStrokeWidth}
                  aria-hidden
                />
              ) : (
                leftIcon
              )}
            </span>
          )}

          <select
            id={selectId}
            ref={ref}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            required={required}
            size={selectSize}
            className="ui-select__control"
            disabled={disabled}
            {...rest}
          >
            {children}
          </select>

          {/* Chevron consistente con el set de iconos */}
          <span className="ui-select__chevron" aria-hidden>
            <Icon name="ChevronDown" size={18} strokeWidth={iconStrokeWidth} />
          </span>
        </div>

        {helperText && !hasError && (
          <div id={helperId} className="ui-select__helper">
            {helperText}
          </div>
        )}
        {hasError && (
          <div
            id={errorId}
            className="ui-select__error"
            role="alert"
            aria-live="polite"
          >
            {errorText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
