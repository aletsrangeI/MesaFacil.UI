import React from "react";
import "./toggle.css";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Toggle({
  label,
  id,
  checked,
  onChange,
  disabled,
  ...rest
}: ToggleProps) {
  const toggleId = id ?? React.useId();

  return (
    <label
      className={["ui-toggle", disabled ? "is-disabled" : ""].join(" ")}
      htmlFor={toggleId}
    >
      <input
        id={toggleId}
        type="checkbox"
        className="ui-toggle__input"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
      <span className="ui-toggle__track">
        <span className="ui-toggle__thumb" />
      </span>
      {label && <span className="ui-toggle__label">{label}</span>}
    </label>
  );
}
