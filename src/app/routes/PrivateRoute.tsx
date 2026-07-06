import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsExpired } from "../../state/authSlice";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const isAuth = useSelector(selectIsAuthenticated);
  const expired = useSelector(selectIsExpired); // tu selector nuevo
  if (!isAuth || expired) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
