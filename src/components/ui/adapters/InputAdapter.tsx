import { Input } from "../input";
import type { FieldComponents, FieldProps } from "../../../forms/FieldRenderer";
import Icon from "../icons/Icon";
import type { ApiFormField } from "../../../forms/types";
import { Toggle } from "../toggle";

// Text
const TextInputAdapter: FieldComponents["TextInput"] = (
  p: FieldProps & { __field?: ApiFormField }
) => {
  const hasError = Boolean(p["aria-invalid"]);
  const leftIconNode = p.__field?.leftIconName ? (
    <Icon name={p.__field.leftIconName as any} />
  ) : undefined;

  return (
    <Input
      id={p.name}
      type="text"
      name={p.name}
      value={p.value}
      onChange={p.onChange}
      onBlur={p.onBlur}
      placeholder={p.placeholder}
      aria-label={p.placeholder || p.name} // ← accesibilidad
      aria-invalid={p["aria-invalid"]}
      aria-describedby={p["aria-describedby"]}
      state={hasError ? "error" : "default"}
      size="md"
      clearable
      className={hasError ? "has-error" : undefined}
      leftIcon={leftIconNode}
      // label / helper / errorText los deja pintar el wrapper externo
    />
  );
};

// Password
const PasswordInputAdapter: FieldComponents["PasswordInput"] = (
  p: FieldProps
) => {
  const hasError = Boolean(p["aria-invalid"]);
  return (
    <Input
      id={p.name}
      type="password"
      name={p.name}
      value={p.value}
      onChange={p.onChange}
      onBlur={p.onBlur}
      placeholder={p.placeholder}
      aria-label={p.placeholder || p.name}
      aria-invalid={p["aria-invalid"]}
      aria-describedby={p["aria-describedby"]}
      state={hasError ? "error" : "default"}
      size="md"
      passwordToggle // ← tu toggle nativo
    />
  );
};

// Date
const DateInputAdapter: FieldComponents["DateInput"] = (p: FieldProps) => {
  const hasError = Boolean(p["aria-invalid"]);
  return (
    <Input
      id={p.name}
      type="date"
      name={p.name}
      value={p.value}
      onChange={p.onChange}
      onBlur={p.onBlur}
      placeholder={p.placeholder}
      aria-label={p.placeholder || p.name}
      aria-invalid={p["aria-invalid"]}
      aria-describedby={p["aria-describedby"]}
      state={hasError ? "error" : "default"}
      size="md"
    />
  );
};

const CheckboxInputAdapter: FieldComponents["CheckboxInput"] = (p) => {
  // p.checked, p.onChange, p.onBlur, p.name ya vienen del FormGenerator
  return (
    <Toggle
      id={p.name}
      checked={p.checked}
      onChange={p.onChange}
      onBlur={p.onBlur as any}
      aria-invalid={p["aria-invalid"]}
      aria-describedby={p["aria-describedby"]}
      label={p.label}
    />
  );
};

// Wrapper y ErrorText: dejamos los que ya usa tu CSS (coinciden con tu Input.css)
const FieldWrapper: FieldComponents["FieldWrapper"] = ({
  children,
  label,
  name,
  className,
  variant,
}) => (
  <div
    className={[
      "ui-field",
      variant ? `ui-field--${variant}` : "",
      className ?? "",
    ]
      .join(" ")
      .trim()}
  >
    {label && (
      <label htmlFor={name} className="ui-label">
        {label}
      </label>
    )}
    {children}
  </div>
);

const ErrorText: FieldComponents["ErrorText"] = ({ id, children }) => (
  <div id={id} className="ui-input__error" role="alert">
    {children}
  </div>
);

export const InputAdapter: Partial<FieldComponents> = {
  TextInput: TextInputAdapter,
  PasswordInput: PasswordInputAdapter,
  DateInput: DateInputAdapter,
  CheckboxInput: CheckboxInputAdapter,
  FieldWrapper,
  ErrorText,
};
