// src/routes/RoleGuard.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../hooks";
import { selectUserProfile } from "../../state/authSlice";



export function RoleGuard({
  allowed,
  children,
}: {
  allowed: string[]; // ["Admin", "Mesero", ...]
  children: ReactNode;
}) {
  const user = useAppSelector(selectUserProfile);
  const hasAccess = (user.roles ?? []).some((r) => allowed.includes(r));
  return hasAccess ? <>{children}</> : <Navigate to="/" replace />;
}