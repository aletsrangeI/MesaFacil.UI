import React from "react";
import { useCan } from "../../app/security/useCan";

export function ActionIfPerm({
  perm,
  children,
  fallback = null,
}: {
  perm: string;             // e.g. "/perm/users:write"
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const can = useCan(perm);
  if (!can) return <>{fallback}</>;
  return <>{children}</>;
}
