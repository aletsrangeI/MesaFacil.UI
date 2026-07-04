import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import {
  useAuthLoginMutation,
  useFormFieldGetFormFieldByFormCatIdQuery,
  useLazyAuthMeQuery,
} from "../../services/generated/api";

import type {
  ApiFormField,
  ValidationRule,
  ValidationType,
  SelectOptionApi,
  FormCategoryId,
} from "../../forms/types";
import { FORM_CATEGORY_IDS } from "../../forms/types";
import { useAppDispatch } from "../../app/hooks";
import { setAuthResponse, setFromAuthMe } from "../../state/authSlice";

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

function coerceValidationValue(type: ValidationType, raw: unknown): number {
  if (type === "minLength") return Number(raw ?? 0) || 0;
  return Number(raw ?? 1) || 1;
}

type BackendOption = { id?: string | number; nombre?: string; label?: string; value?: string | number; text?: string; };
function toSelectOptions(list?: unknown): SelectOptionApi[] {
  if (!Array.isArray(list)) return [];
  return (list as BackendOption[]).map((o) => {
    const label = String(o.label ?? o.nombre ?? o.text ?? o.value ?? o.id ?? "");
    const value = (o.value ?? o.id ?? label) as string | number;
    return { id: value, nombre: label, label, value } as unknown as SelectOptionApi;
  });
}

/* ------------------------------------ Hook ------------------------------------ */

export function useAuthLoginForm(formCatId: FormCategoryId = FORM_CATEGORY_IDS.LOGIN) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Form schema (categoría formCatId)
  const { data: resp, isFetching: isFetchingFields, isError: isFieldsError, error: fieldsError } =
    useFormFieldGetFormFieldByFormCatIdQuery({ id: formCatId });

  // Mutación de login y consulta lazy de /auth/me
  const [authLogin, { isLoading: isSubmitting, error }] = useAuthLoginMutation();
  const [triggerMe] = useLazyAuthMeQuery();

  const [serverError, setServerError] = useState<string | null>(null);

  const formId = "registro-usuario-form";

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
              return { type, value: coerceValidationValue(type, v?.value) };
            })
          : [],
        options: toSelectOptions(dto.options),
        catalogoId: null,
        order: dto.order ?? 0,
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [resp]);

  // elige la primera ruta “real” (ignora /perm/*) o "/" por fallback
  const pickNextPath = (accesos?: string[]) => {
    const list = Array.isArray(accesos) ? accesos : [];
    const real = list.find((p) => p && !p.startsWith("/perm/"));
    return real || "/";
  };

  const handleSubmit = useCallback(
    async (values: LoginValues) => {
      setServerError(null);
      try {
        // 1) LOGIN
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

        // 2) Guardar tokens + sesión base (roles/accesos del login)
        dispatch(
          setAuthResponse({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken ?? undefined,
            // si tu back ya envía expiresAtUtc, úsalo (en tu ejemplo sí viene)
            expiresAt: token.expiresAtUtc ?? undefined,
            usuarioId: session.usuarioId,
            idEmpresa: session.idEmpresa,
            correo: session.correo,
            nombreCompleto: session.nombreCompleto ?? undefined,
            roles: session.roles ?? [],
            accesos: session.accesos ?? [],
            permsVersion: session.permsVersion ?? null,
          })
        );

        // 3) /auth/me para permisos finos y accesos actualizados (idempotente)
        try {
          const me = await triggerMe().unwrap();
          const d = me?.data;
          if (d) {
            dispatch(
              setFromAuthMe({
                usuarioId: d.usuarioId,
                idEmpresa: d.idEmpresa,
                correo: d.correo ?? "",
                nombre: d.nombre,
                roles: d.roles,
                permissions: d.permissions ?? [],
                accesos: d.accesos ?? [],
                permsVersion: d.permsVersion ?? null,
                permissionsChanged: Boolean(d.permissionsChanged),
              })
            );
          }
        } catch {
          // si falla /me no bloqueamos el acceso; ya tienes roles/accesos del login
        }

        // 4) Redirección
        const next = pickNextPath(session.accesos);
        navigate(next, { replace: true });
      } catch (e: any) {
        const msg =
          e?.data?.message ||
          e?.data?.title ||
          e?.error ||
          (e?.message ?? "No fue posible procesar la autenticación.");
        setServerError(msg);
      }
    },
    [authLogin, triggerMe, dispatch, navigate]
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
