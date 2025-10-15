// src/routes/RoleGuard.tsx
import { Navigate } from "react-router-dom";
import { selectRolesOrGuest } from "../../state/authSlice";
import { useSelector } from "react-redux";

type Canonical =
  | "admin"
  | "manager"
  | "cashier"
  | "waiter"
  | "kitchen"
  | "delivery"
  | "guest";

// RoleGuard.tsx (idea)

export function RoleGuard({
  allowed,
  children,
}: {
  allowed: Canonical[];
  children: React.ReactNode;
}) {
  const roles = useSelector(selectRolesOrGuest); // canónicos
  const ok = roles.some((r) => allowed.includes(r as Canonical));
  return ok ? <>{children}</> : <Navigate to="/" replace />;
}
