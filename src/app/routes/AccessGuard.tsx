// src/app/routes/AccessGuard.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCanAccess } from "../../state/authSlice";

export function AccessGuard({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const can = useSelector(selectCanAccess(path));
  const loc = useLocation();
  return can ? (
    <>{children}</>
  ) : (
    <Navigate to="/" state={{ from: loc }} replace />
  );
}
