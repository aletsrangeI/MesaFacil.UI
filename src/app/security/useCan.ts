import { useSelector } from "react-redux";
import type { RootState } from "../store";

function norm(p: string) {
  const s = String(p || "").toLowerCase();
  return s !== "/" ? s.replace(/\/+$/, "") : "/";
}

/** Devuelve true si el usuario actual tiene el path/perm en auth.accesos */
export function useCan(pathOrPerm: string) {
  return useSelector((s: RootState) => {
    const list = s.auth.accesos ?? ["/"];
    const target = norm(pathOrPerm);
    return list.some((a) => norm(a) === target);
  });
}
