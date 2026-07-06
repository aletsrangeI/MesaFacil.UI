import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export function usePermissions() {
  const { permissions, roles, accesos } = useSelector((s: RootState) => s.auth);
  const has = (p: string | string[]) =>
    Array.isArray(p) ? p.every(x => permissions.includes(x)) : permissions.includes(p);
  const canAccessPath = (path: string) => Array.isArray(accesos) ? accesos.includes(path) : false;
  return { permissions, roles, accesos, has, canAccessPath };
}
