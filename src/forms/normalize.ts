import type { ApiFormField } from "./types";

export function normalizeFields(raw: ApiFormField[]): ApiFormField[] {
  const sorted = [...raw].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const seen = new Set<string>();
  return sorted.filter((f) => {
    if (!f.name || seen.has(f.name)) return false;
    seen.add(f.name);
    return true;
  });
}

export function buildInitialValues(
  fields: ApiFormField[]
): Record<string, any> {
  const initial: Record<string, any> = {};
  for (const f of fields) {
    if (f.type === "date") {
      initial[f.name] = f.value?.trim() ? f.value : ""; // usar "" para controlar con input date
    } else if (f.type === "select") {
      // si value está vacío, deja "", así obligas a elegir algo (yup.required lo atrapará)
      initial[f.name] = (f.value ?? "").toString().trim();
    } else {
      initial[f.name] = f.value ?? "";
    }
  }
  return initial;
}
