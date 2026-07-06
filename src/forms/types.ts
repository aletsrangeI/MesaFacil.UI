// src/forms/types.ts
export type ValidationType =
  | "required"
  | "email"
  | "confirmPassword"
  | "phone"
  | "date"
  | "minLength";

export const FORM_CATEGORY_IDS = {
  LOGIN: 0,
  REGISTRO_USUARIO: 1,
  GESTION_USUARIOS: 2,
} as const;

export type FormCategoryId = typeof FORM_CATEGORY_IDS[keyof typeof FORM_CATEGORY_IDS];

export type FieldType = "text" | "password" | "select" | "date" | "checkbox";

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
  type: FieldType;
  name: string;
  placeholder?: string;
  label?: string;
  value?: string;
  validations?: ValidationRule[];
  options?: SelectOptionApi[];
  catalogoId?: number | null;
  order?: number;
  dataSource?: string | null;

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
