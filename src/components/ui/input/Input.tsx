// Input.tsx
import React from "react";
import "./input.css";
import Icon from "./../icons/Icon";

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
>;

export type InputVisualSize = "sm" | "md" | "lg";

export interface InputProps extends NativeInputProps {
  // Visual / layout
  size?: InputVisualSize; // tamaño visual (clases)
  inputSize?: number; // atributo nativo size (opcional)
  className?: string;

  // Texto auxiliar / estado
  label?: string;
  helperText?: string;
  errorText?: string;
  description?: string;
  state?: "default" | "error" | "success" | "warning";

  // Slots / adornos
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: React.ReactNode; // no interactivo
  suffix?: React.ReactNode; // no interactivo

  // UX extras
  clearable?: boolean;
  onClear?: () => void;
  passwordToggle?: boolean; // solo si type='password'
  showCounter?: boolean; // requiere maxLength
  selectOnFocus?: boolean;

  // Declaradas pero NO usadas aquí (para no filtrarlas al DOM)
  debounceMs?: number;
  formatter?: (raw: string) => string;
  parser?: (fmt: string) => string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      // ===== Props de UI / no nativas (NO deben ir al <input>) =====
      size = "md",
      inputSize,
      className,
      label,
      helperText,
      errorText,
      description,
      state,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      clearable,
      onClear,
      passwordToggle = false,
      showCounter = false,
      selectOnFocus = false,
      // (debounceMs, formatter, parser) — no se usan aquí a propósito

      // ===== Props nativas (sí van al <input>) =====
      id,
      required,
      disabled,
      readOnly,
      maxLength,
      onFocus,
      onChange,
      type,
      value,
      defaultValue,

      ...nativeProps
    } = props;

    const inputId = id ?? React.useId();
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = errorText ? `${inputId}-error` : undefined;
    const describedBy =
      [helperId, errorId].filter(Boolean).join(" ") || undefined;
    const hasError = Boolean(errorText) || state === "error";

    // Ref interno para utilidades (clear/select/toggle)
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    // toggle de password (solo si el type nativo es "password")
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = (type ?? "text") === "password" && passwordToggle;
    const resolvedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    // onFocus combinado (selectOnFocus)
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (selectOnFocus) {
        requestAnimationFrame(() => e.currentTarget.select());
      }
      onFocus?.(e);
    };

    // clearable
    const canClear =
      !!clearable &&
      !disabled &&
      !readOnly &&
      ((value != null && String(value).length > 0) ||
        (defaultValue != null && String(defaultValue).length > 0));

    const handleClear = () => {
      onClear?.();
      if (!onClear && onChange) {
        const target = innerRef.current;
        if (target) {
          const proto = Object.getPrototypeOf(target);
          const valueSetter = Object.getOwnPropertyDescriptor(
            proto,
            "value"
          )?.set;
          valueSetter?.call(target, "");
          const ev = new Event("input", { bubbles: true });
          target.dispatchEvent(ev);
        }
      }
      innerRef.current?.focus();
    };

    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;

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
            `ui-input__field--${size}`,
            hasError ? "is-error" : "is-ok",
            leftIcon ? "has-left" : "",
            rightIcon || isPassword || canClear || suffix ? "has-right" : "",
          ].join(" ")}
        >
          {/* Prefix fijo */}
          {prefix && (
            <span className="ui-input__prefix" aria-hidden>
              {prefix}
            </span>
          )}

          {/* Icono izquierdo */}
          {leftIcon && (
            <span className="ui-input__icon ui-input__icon--left" aria-hidden>
              {leftIcon}
            </span>
          )}

          {/* Control nativo */}
          <input
            id={inputId}
            ref={innerRef}
            className="ui-input__control"
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            size={inputSize}
            type={resolvedType}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onChange={onChange}
            {...nativeProps}
          />

          {/* Toggle password */}
          {isPassword && (
            <button
              type="button"
              className="ui-input__action ui-input__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              tabIndex={-1}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} />
            </button>
          )}

          {/* Clear */}
          {canClear && (
            <button
              type="button"
              className="ui-input__action ui-input__clear"
              onClick={handleClear}
              aria-label="Limpiar"
              tabIndex={-1}
            >
              <Icon name="X" />
            </button>
          )}

          {/* Icono derecho */}
          {rightIcon && (
            <span className="ui-input__icon ui-input__icon--right" aria-hidden>
              {rightIcon}
            </span>
          )}

          {/* Suffix fijo */}
          {suffix && (
            <span className="ui-input__suffix" aria-hidden>
              {suffix}
            </span>
          )}
        </div>

        {/* Helper / Error / Counter */}
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

        {showCounter && typeof maxLength === "number" && (
          <div className="ui-input__counter" aria-live="polite">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
