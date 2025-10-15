import React from "react";
import "./checkbox.css";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  size?: CheckboxSize; // ← tamaño visual
  indeterminate?: boolean;
}
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      helperText,
      errorText,
      size = "md",
      indeterminate = false,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate =
          indeterminate && !internalRef.current.checked;
      }
    }, [indeterminate, rest.checked]);

    const checkboxId = id ?? React.useId();
    const helperId = helperText ? `${checkboxId}-helper` : undefined;
    const errorId = errorText ? `${checkboxId}-error` : undefined;
    const describedBy =
      [errorId || null, !errorText ? helperId : null]
        .filter(Boolean)
        .join(" ") || undefined;
    const hasError = Boolean(errorText);

    return (
      <div
        className={[
          "ui-cb",
          `ui-cb--${size}`,
          disabled ? "is-disabled" : "",
          className ?? "",
        ].join(" ")}
      >
        <label className="ui-cb__labelwrap" htmlFor={checkboxId}>
          <span
            className={["ui-cb__box", hasError ? "is-error" : ""].join(" ")}
            aria-hidden
          >
            <input
              id={checkboxId}
              ref={setRefs}
              type="checkbox"
              className="ui-cb__input"
              aria-describedby={describedBy}
              aria-invalid={hasError || undefined}
              disabled={disabled}
              {...rest}
            />
            <span className="ui-cb__mark" />
          </span>

          {label && <span className="ui-cb__labeltext">{label}</span>}
        </label>

        {!hasError && helperText && (
          <div id={helperId} className="ui-cb__helper">
            {helperText}
          </div>
        )}
        {hasError && (
          <div id={errorId} className="ui-cb__error" role="alert">
            {errorText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
