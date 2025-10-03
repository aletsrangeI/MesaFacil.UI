import React from "react";
import "./number-field.css";

export type NumberFieldSize = "sm" | "md" | "lg";

export interface NumberFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange" | "defaultValue"
  > {
  value?: number; // controlado
  defaultValue?: number; // no controlado
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: NumberFieldSize;
}

export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      min = 0,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      size = "md",
      disabled,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<number>(
      defaultValue ?? Math.max(0, min)
    );
    const current = isControlled ? (value as number) : internal;

    const clamp = (n: number) => Math.min(max, Math.max(min, n));

    const emit = (n: number) => {
      const v = clamp(n);
      if (!isControlled) setInternal(v);
      onChange?.(v);
    };

    const inc = () => !disabled && emit(current + step);
    const dec = () => !disabled && emit(current - step);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const parsed = raw === "" ? NaN : Number(raw);
      if (Number.isNaN(parsed)) {
        // Si el usuario borra, no emitas NaN: deja el campo vacío visualmente
        if (!isControlled) e.target.value = "";
        return;
      }
      emit(parsed);
    };

    const canDec = current > min;
    const canInc = current < max;

    return (
      <div
        className={[
          "ui-nf",
          `ui-nf--${size}`,
          disabled ? "is-disabled" : "",
          className ?? "",
        ].join(" ")}
      >
        <button
          type="button"
          className="ui-nf__btn"
          onClick={dec}
          aria-label="Disminuir"
          disabled={disabled || !canDec}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <input
          id={id}
          ref={ref}
          className="ui-nf__input"
          type="number"
          inputMode="numeric"
          value={isControlled ? current : internal}
          min={min}
          max={max}
          step={step}
          aria-label="Cantidad"
          onChange={onInputChange}
          disabled={disabled}
          {...rest}
        />

        <button
          type="button"
          className="ui-nf__btn"
          onClick={inc}
          aria-label="Aumentar"
          disabled={disabled || !canInc}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }
);

NumberField.displayName = "NumberField";
