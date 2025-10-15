import { Input } from "../input";
import type { FieldComponents, FieldProps } from "../../../forms/FieldRenderer";
import Icon from "../icons/Icon";
import type { ApiFormField } from "../../../forms/types";

/**
 * Regla: no pasamos `label` ni `errorText` al <Input/> para
 * evitar duplicados, porque el FormGenerator ya los pinta
 * con FieldWrapper (label) y ErrorText (mensaje).
 *
 * Si más adelante prefieres que el <Input/> muestre SU
 * propio label/errorText internos, te paso una variante opcional.
 *
 *
 */

function buildPrefix(field?: ApiFormField) {
  if (!field) return undefined;
  if (field.prefixIconName) return <Icon name={field.prefixIconName as any} />;
  if (field.prefixText) return <span aria-hidden>{field.prefixText}</span>;
  return undefined;
}

function buildSuffix(field?: ApiFormField) {
  if (!field) return undefined;
  if (field.suffixIconName) return <Icon name={field.suffixIconName as any} />;
  if (field.suffixText) return <span aria-hidden>{field.suffixText}</span>;
  return undefined;
}

function buildLeftIcon(field?: ApiFormField) {
  return field?.leftIconName ? (
    <Icon name={field.leftIconName as any} />
  ) : undefined;
}

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

// Wrapper y ErrorText: dejamos los que ya usa tu CSS (coinciden con tu Input.css)
const FieldWrapper: FieldComponents["FieldWrapper"] = ({
  children,
  label,
  name,
}) => (
  <div className="ui-field">
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
  FieldWrapper,
  ErrorText,
  // Tip: puedes dejar SelectInput sin implementar y el FormGenerator usará el <select> por defecto.
};
