import React from "react";
import type { ApiFormField } from "./types";
import type { WithFieldMeta } from "./FormGenerator";

export interface FieldComponents {
  TextInput: React.FC<FieldProps & WithFieldMeta>;
  PasswordInput: React.FC<FieldProps & WithFieldMeta>;
  DateInput: React.FC<FieldProps & WithFieldMeta>;
  SelectInput: React.FC<
    FieldProps &
      WithFieldMeta & {
        options: { value: string; label: string }[];
      }
  >;
  CheckboxInput: React.FC<
    Omit<FieldProps, "value" | "placeholder"> & {
      checked: boolean;
      disabled?: boolean;
      label?: string;
    }
  >;
  ErrorText: React.FC<{ id?: string; children?: React.ReactNode }>;
  FieldWrapper: React.FC<{
    children: React.ReactNode;
    label?: string;
    name: string;
    className?: string;
    variant?: "default" | "switch" | "compact";
  }>;
}

export interface FieldProps {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  errorText?: string;
}

export interface SelectRenderProps {
  options: { value: string; label: string }[];
  __field?: ApiFormField; // ← aquí registramos la prop extra
}

export const DefaultFieldComponents: FieldComponents = {
  TextInput: (p) => <input type="text" className="ui-input" {...p} />,
  PasswordInput: (p) => <input type="password" className="ui-input" {...p} />,
  DateInput: (p) => <input type="date" className="ui-input" {...p} />,
  CheckboxInput: (p) => (
    <label>
      <input
        type="checkbox"
        name={p.name}
        checked={p.checked}
        onChange={p.onChange}
        onBlur={p.onBlur}
        aria-invalid={p["aria-invalid"]}
        aria-describedby={p["aria-describedby"]}
      />
      {p.label}
    </label>
  ),
  SelectInput: ({ options, ...p }) => (
    <select className="ui-select" {...p}>
      <option value="">Selecciona...</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
  ErrorText: ({ id, children }) => (
    <div id={id} role="alert" className="ui-input__error">
      {children}
    </div>
  ),
  FieldWrapper: ({ children, label, name }) => (
    <div className="ui-field">
      {label && (
        <label htmlFor={name} className="ui-label">
          {label}
        </label>
      )}
      {children}
    </div>
  ),
};

export function mapSelectOptions(
  opts: { id: number | string; nombre: string }[] | undefined
) {
  return (opts ?? []).map((o) => ({ value: String(o.id), label: o.nombre }));
}
