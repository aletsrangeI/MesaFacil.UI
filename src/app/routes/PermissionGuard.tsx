import { Navigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";


export function PermissionGuard({ required, children }: { required: string | string[], children: React.ReactNode }) {
  const { has } = usePermissions();
  return has(required) ? children : <Navigate to="/unauthorized" replace />;
}