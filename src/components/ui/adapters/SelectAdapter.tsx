import type { FieldComponents, FieldProps } from "../../../forms/FieldRenderer";
import { Select } from "../select";
import type { ApiFormField } from "../../../forms/types";

const SelectInputAdapter: FieldComponents["SelectInput"] = (
  props: FieldProps & {
    options: { value: string; label: string }[];
    // Pasamos el campo completo si quieres leer más props:
    __field?: ApiFormField;
  }
) => {
  const { options, __field, ...p } = props;
  const hasError = Boolean(p["aria-invalid"]);

  // Preferencias: visualLabel > label > placeholder
  const visualLabel = __field?.visualLabel ?? __field?.label;
  const aria = __field?.ariaLabel ?? __field?.placeholder ?? p.name;
  const helper = !hasError ? __field?.helperText : undefined;

  return (
    <Select
      id={p.name}
      name={p.name}
      value={p.value}
      onChange={p.onChange}
      onBlur={p.onBlur}
      aria-label={aria}
      aria-invalid={p["aria-invalid"]}
      aria-describedby={p["aria-describedby"]}
      // Props visuales desde backend:
      size={__field?.size ?? "md"}
      leftIconName={__field?.leftIconName as any}
      iconStrokeWidth={__field?.iconStrokeWidth ?? 2}
      selectSize={__field?.selectSize}
    >
      <option value="">{__field?.placeholder ?? "Selecciona…"}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  );
};

// Wrapper que NO duplica label (el Select ya pinta su label)
const FieldWrapper: FieldComponents["FieldWrapper"] = ({ children }) => (
  <div className="ui-field">{children}</div>
);

// Si prefieres que el error solo se pinte dentro del Select:
const ErrorText: FieldComponents["ErrorText"] = () => null;

export const SelectAdapter: Partial<FieldComponents> = {
  SelectInput: SelectInputAdapter,
};
