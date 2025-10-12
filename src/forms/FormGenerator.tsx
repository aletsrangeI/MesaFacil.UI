// src/forms/FormGenerator.tsx
import React from "react";
import { Formik, Form, useField } from "formik";
import type { ApiFormField } from "./types";
import { normalizeFields, buildInitialValues } from "./normalize";
import { buildYupSchema } from "./schema";
import { DefaultFieldComponents, type FieldComponents } from "./FieldRenderer";

export interface FormGeneratorProps {
  fields: ApiFormField[];
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  components?: Partial<FieldComponents>;
  initialValuesOverride?: Record<string, any>;
  submitLabel?: string;

  // NUEVO:
  formId?: string; // id para <Form>
  showDefaultSubmit?: boolean; // ocultar/mostrar botón interno
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
  showDefaultSubmit = true, // por defecto igual que antes
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
    >
      {({ isSubmitting }) => (
        <Form id={formId} noValidate className="ui-form">
          {all.map((f) => (
            <DynamicField key={f.name} field={f} Cmp={Cmp} />
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
}: {
  field: ApiFormField;
  Cmp: FieldComponents;
}) {
  const [formikField, meta] = useField<string>(field.name);
  const hasError = meta.touched && !!meta.error;
  const errorId = hasError ? `${field.name}-error` : undefined;

  const commonProps = {
    name: field.name,
    value: formikField.value ?? "",
    placeholder: field.placeholder,
    onChange: formikField.onChange,
    onBlur: formikField.onBlur,
    "aria-invalid": hasError || undefined,
    "aria-describedby": errorId,

    // Si ya añadiste errorText en FieldProps, pásalo:
    errorText: hasError ? String(meta.error) : undefined,
  } as const;

  let control: React.ReactNode = null;
  switch (field.type) {
    case "text":
      control = <Cmp.TextInput {...commonProps} __field={field} />; // 👈
      break;
    case "password":
      control = <Cmp.PasswordInput {...commonProps} __field={field} />; // 👈
      break;
    case "date":
      control = <Cmp.DateInput {...commonProps} __field={field} />; // 👈
      break;
    case "select":
      control = (
        <Cmp.SelectInput
          {...commonProps}
          options={(field.options ?? []).map((o) => ({
            value: String(o.id),
            label: o.nombre,
          }))}
          __field={field} // ya lo tienes
        />
      );
      break;
    default:
      control = <Cmp.TextInput {...commonProps} __field={field} />; // 👈
      break;
  }

  return (
    <Cmp.FieldWrapper name={field.name} label={field.label}>
      {control}
      {hasError && <Cmp.ErrorText id={errorId}>{meta.error}</Cmp.ErrorText>}
    </Cmp.FieldWrapper>
  );
}
