// src/forms/FormGenerator.tsx
import React from "react";
import { Formik, Form, useField } from "formik";
import type { ApiFormField, SelectOptionApi } from "./types";
import { normalizeFields, buildInitialValues } from "./normalize";
import { buildYupSchema } from "./schema";
import { DefaultFieldComponents, type FieldComponents } from "./FieldRenderer";

export interface FormGeneratorProps {
  fields: ApiFormField[];
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  components?: Partial<FieldComponents>;
  initialValuesOverride?: Record<string, any>;
  submitLabel?: string;
  formId?: string; // id para <Form>
  showDefaultSubmit?: boolean; // ocultar/mostrar botón interno
  
  // NEW: Dynamic options dictionary
  dataSources?: Record<string, SelectOptionApi[]>;
}

export interface WithFieldMeta {
  __field?: ApiFormField;
}

export function FormGenerator({
  fields,
  onSubmit,
  components,
  initialValuesOverride,
  submitLabel = "Guardar",
  formId,
  showDefaultSubmit = true,
  dataSources,
}: FormGeneratorProps) {
  const all = normalizeFields(fields);
  const initial = {
    ...buildInitialValues(all),
    ...(initialValuesOverride ?? {}),
  };
  const validationSchema = buildYupSchema(all);
  const Cmp: FieldComponents = {
    ...DefaultFieldComponents,
    ...(components ?? {}),
  };

  return (
    <Formik
      initialValues={initial}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form id={formId} noValidate className="ui-form">
          {all.map((f) => (
            <DynamicField key={f.name} field={f} Cmp={Cmp} dataSources={dataSources} />
          ))}

          {showDefaultSubmit && (
            <button
              type="submit"
              className="ui-button ui-button--primary"
              disabled={isSubmitting}
            >
              {submitLabel}
            </button>
          )}
        </Form>
      )}
    </Formik>
  );
}

function DynamicField({
  field,
  Cmp,
  dataSources,
}: {
  field: ApiFormField;
  Cmp: FieldComponents;
  dataSources?: Record<string, SelectOptionApi[]>;
}) {
  // Para inputs tipo texto/select/fecha mantenemos string
  const [formikField, meta, helpers] = useField<string>(field.name);
  const hasError = meta.touched && !!meta.error;
  const errorId = hasError ? `${field.name}-error` : undefined; // ✅ corregido

  const commonProps = {
    name: field.name,
    value: formikField.value ?? "",
    placeholder: field.placeholder,
    onChange: formikField.onChange,
    onBlur: formikField.onBlur,
    "aria-invalid": hasError || undefined,
    "aria-describedby": errorId,
    errorText: hasError ? String(meta.error) : undefined,
  } as const;

  let control: React.ReactNode = null;

  switch (field.type) {
    case "checkbox": {
      const isChecked =
        typeof formikField.value === "boolean"
          ? formikField.value
          : String(
              formikField.value ?? field.value ?? "false"
            ).toLowerCase() === "true";

      // 👇 FieldWrapper SIN label (así evitas texto duplicado)
      return (
        <Cmp.FieldWrapper name={field.name} label={undefined} variant="switch">
          <Cmp.CheckboxInput
            name={field.name}
            checked={isChecked}
            onChange={(e) => helpers.setValue(String(e.target.checked))}
            onBlur={formikField.onBlur}
            label={field.label} // <- SOLO aquí va la etiqueta
            aria-invalid={hasError || undefined}
            aria-describedby={errorId}
          />
          {hasError && <Cmp.ErrorText id={errorId}>{meta.error}</Cmp.ErrorText>}
        </Cmp.FieldWrapper>
      );
    }

    case "select": {
      const rawOptions = (field.dataSource && dataSources && dataSources[field.dataSource])
        ? dataSources[field.dataSource]
        : (field.options ?? []);

      const options = rawOptions.map((o: any) => ({
        value: String(o.value ?? o.id ?? ""),
        label: String(o.label ?? o.nombre ?? o.value ?? o.id ?? ""),
      }));

      control = <Cmp.SelectInput {...commonProps} options={options} __field={field} />;
      break;
    }

    case "password":
      control = <Cmp.PasswordInput {...commonProps} __field={field} />;
      break;

    case "date":
      control = <Cmp.DateInput {...commonProps} __field={field} />;
      break;

    case "text":
    default:
      control = <Cmp.TextInput {...commonProps} __field={field} />;
      break;
  }

  return (
    <Cmp.FieldWrapper name={field.name} label={field.label}>
      {control}
      {hasError && <Cmp.ErrorText id={errorId}>{meta.error}</Cmp.ErrorText>}
    </Cmp.FieldWrapper>
  );
}
