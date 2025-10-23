import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import {
  useAuthLoginMutation,
  useFormFieldGetFormFieldByFormCatIdQuery,
} from "../../services/generated/api";

import type {
  ApiFormField,
  ValidationRule,
  ValidationType,
  SelectOptionApi,
} from "../../forms/types";
import { useAppDispatch } from "../../app/hooks";
import { setAuthResponse } from "../../state/authSlice";

export type LoginValues = { username?: string; password?: string };

/* -------------------- Helpers (normalización mínima y segura) -------------------- */

const FIELD_TYPES: ReadonlyArray<ApiFormField["type"]> = [
  "text",
  "select",
  "password",
  "date",
];

function asUiFieldType(t: unknown): ApiFormField["type"] {
  const v = String(t ?? "text").toLowerCase() as ApiFormField["type"];
  return (FIELD_TYPES.includes(v) ? v : "text") as ApiFormField["type"];
}

const VALIDATION_TYPES: ReadonlyArray<ValidationType> = [
  "required",
  "email",
  "confirmPassword",
  "phone",
  "date",
  "minLength",
];

function asValidationType(t: unknown): ValidationType {
  const v = String(t ?? "required") as ValidationType;
  return (VALIDATION_TYPES.includes(v) ? v : "required") as ValidationType;
}

// Asegura que value sea number según tu contrato de UI
function coerceValidationValue(type: ValidationType, raw: unknown): number {
  if (type === "minLength") return Number(raw ?? 0) || 0;
  return Number(raw ?? 1) || 1;
}

type BackendOption = {
  id?: string | number;
  nombre?: string;
  label?: string;
  value?: string | number;
  text?: string;
};

function toSelectOptions(list?: unknown): SelectOptionApi[] {
  if (!Array.isArray(list)) return [];
  return (list as BackendOption[]).map((o) => {
    const label = String(
      o.label ?? o.nombre ?? o.text ?? o.value ?? o.id ?? ""
    );
    const value = (o.value ?? o.id ?? label) as string | number;

    // Devolvemos un objeto que satisface ambos mundos:
    // - Si tu SelectOptionApi es {label,value} compila (tiene esas props)
    // - Si es {id,nombre} también (tiene id/nombre)
    const bothShapes = {
      id: value,
      nombre: label,
      label,
      value,
    };

    return bothShapes as unknown as SelectOptionApi;
  });
}

/* ------------------------------------ Hook ------------------------------------ */

export function useAuthLoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    data: resp,
    isFetching: isFetchingFields,
    isError: isFieldsError,
    error: fieldsError,
  } = useFormFieldGetFormFieldByFormCatIdQuery({ code: "LOGIN" });

  const [authLogin, { isLoading: isSubmitting, error }] =
    useAuthLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const formId = "registro-usuario-form";

  // resp puede venir como { data: FormField[] } (según tu ejemplo)
  type BackendField = {
    id?: number | string;
    type?: string;
    name?: string;
    placeholder?: string;
    label?: string;
    value?: string;
    validations?: Array<{ type?: string; value?: number | string }>;
    options?: BackendOption[];
    order?: number;
  };

  const fields: ApiFormField[] = useMemo(() => {
    const list = Array.isArray((resp as any)?.data)
      ? ((resp as any).data as BackendField[])
      : [];

    // dedupe por id|name por si el backend manda duplicados
    const uniq = new Map<string, BackendField>();
    for (const f of list) {
      const key = `${f.id ?? ""}|${f.name ?? ""}`;
      if (!uniq.has(key)) uniq.set(key, f);
    }

    return Array.from(uniq.values())
      .map<ApiFormField>((dto) => ({
        type: asUiFieldType(dto.type),
        name: dto.name ?? "",
        placeholder: dto.placeholder ?? "",
        label: dto.label ?? dto.name ?? "",
        value: dto.value ?? "",
        validations: Array.isArray(dto.validations)
          ? dto.validations.map<ValidationRule>((v) => {
              const type = asValidationType(v?.type);
              return {
                type,
                value: coerceValidationValue(type, v?.value),
              };
            })
          : [], // <- siempre array, nunca undefined
        options: toSelectOptions(dto.options), // <- compatible con ambos shapes
        catalogoId: null,
        order: dto.order ?? 0,
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [resp]);

  const handleSubmit = useCallback(
    async (values: LoginValues) => {
      setServerError(null);
      try {
        const apiResp = await authLogin({
          loginRequest: {
            userOrEmail: String(values.username ?? ""),
            password: String(values.password ?? ""),
          },
        }).unwrap();

        if (!apiResp?.isSuccess || !apiResp.data) {
          throw new Error(apiResp?.message || "Error de autenticación.");
        }
        const { token, session } = apiResp.data;

        const accesos = Array.isArray(session.accesos) ? session.accesos : [];
        const firstAllowed = accesos[0] ?? "/";

        dispatch(
          setAuthResponse({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken ?? undefined,
            expiresAt: token.expiresAtUtc ?? undefined,
            usuarioId: session.usuarioId,
            idEmpresa: session.idEmpresa,
            correo: session.correo,
            nombreCompleto: session.nombreCompleto ?? undefined,
            roles: session.roles ?? [],
            accesos,
            permsVersion: session.permsVersion ?? null,
          })
        );

        const roleToPath: Record<string, string> = {
          Admin: "/admin",
          Mesero: "/mesero",
        };
        const next = firstAllowed || roleToPath[session.roles[0]] || "/";
        navigate(next, { replace: true });

      } catch (e: any) {
        const msg =
          e?.data?.message ||
          e?.data?.title ||
          e?.error ||
          "No fue posible procesar la autenticación.";
        setServerError(msg);
      }
    },
    [authLogin]
  );

  const isLoading = isSubmitting || isFetchingFields;

  const consolidatedError =
    serverError ??
    (isFieldsError
      ? typeof fieldsError === "string"
        ? fieldsError
        : "No fue posible cargar el formulario."
      : null);

  return {
    formId,
    fields,
    isLoading,
    error, // error de la mutation de Auth
    serverError: consolidatedError,
    handleSubmit,
    clearServerError: () => setServerError(null),
  };
}
