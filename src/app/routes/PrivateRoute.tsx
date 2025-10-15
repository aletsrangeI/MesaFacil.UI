import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../hooks";
import { selectIsAuthenticated } from "../../state/authSlice";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
