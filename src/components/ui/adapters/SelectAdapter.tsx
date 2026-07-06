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

  const aria = __field?.ariaLabel ?? __field?.placeholder ?? p.name;

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
      // Props visuales desde backend:Toast.stories
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



export const SelectAdapter: Partial<FieldComponents> = {
  SelectInput: SelectInputAdapter,
};
