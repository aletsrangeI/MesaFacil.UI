// src/forms/types.ts
export type ValidationType =
  | "required"
  | "email"
  | "confirmPassword"
  | "phone"
  | "date";

export interface ValidationRule {
  type: ValidationType;
  value: number;
}

export interface SelectOptionApi {
  id: number | string;
  nombre: string;
}

export type VisualSize = "sm" | "md" | "lg";

export interface ApiFormField {
  type: "text" | "password" | "select" | "date";
  name: string;
  placeholder?: string;
  label?: string;
  value?: string;
  validations?: ValidationRule[];
  options?: SelectOptionApi[];
  catalogoId?: number | null;
  order?: number;

  // NUEVOS (presentación / a11y / UX)
  ariaLabel?: string;
  helperText?: string;
  visualLabel?: string;
  size?: VisualSize;
  leftIconName?: string;
  iconStrokeWidth?: number;
  passwordToggle?: boolean;
  clearable?: boolean;
  prefix?: string;
  selectSize?: number;
  prefixText?: string;
  suffixText?: string;
  prefixIconName?: string;
  suffixIconName?: string;
}

export interface ApiFormResponse {
  data: ApiFormField[];
  isSuccess: boolean;
  message: string;
  errors: unknown;
}
