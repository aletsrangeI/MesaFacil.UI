import { useSelector } from "react-redux";
import { type AuthState } from "../state/authSlice";

export function useCan(pathOrPerm: string) {
  return useSelector((s: { auth: AuthState }) => {
    const list = s.auth.accesos ?? ["/"];
    const norm = (p: string) =>
      p !== "/" ? p.toLowerCase().replace(/\/+$/, "") : "/";
    return list.some((a) => norm(a) === norm(pathOrPerm));
  });
}
