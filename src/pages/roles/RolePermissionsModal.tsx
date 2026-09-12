import React, { useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import {
  useAccesoRutaGetAllQuery,
  useRolAccesoRutaGetAllQuery,
  useRolAccesoRutaInsertMutation,
  useRolAccesoRutaDeleteMutation,
} from "../../services/generated/api";
import "./roles.css";

interface RolePermissionsModalProps {
  roleId: number | null;
  roleName: string | null;
  open: boolean;
  onClose: () => void;
}

export const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  roleId,
  roleName,
  open,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { data: rutasData, isLoading: loadingRutas } = useAccesoRutaGetAllQuery();
  const { data: assignmentsData, isLoading: loadingAssignments } = useRolAccesoRutaGetAllQuery();

  const [insertAssignment] = useRolAccesoRutaInsertMutation();
  const [deleteAssignment] = useRolAccesoRutaDeleteMutation();

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  if (!open || !roleId) return null;

  const allRoutes = rutasData?.data || [];
  const allAssignments = assignmentsData?.data || [];
  
  // Filter assignments for this role
  const roleAssignments = allAssignments.filter((a) => a.idRol === roleId);

  // Group routes (if they have a Group property, fallback to path segments or general)
  const groupedRoutes = allRoutes.reduce((acc, route) => {
    const groupName = (route as any).group || (route as any).grupo || route.path?.split('/')[1] || "General";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(route);
    return acc;
  }, {} as Record<string, typeof allRoutes>);

  const handleToggle = async (routeId: number, isGranted: boolean, assignmentId?: number) => {
    if (isGranted && assignmentId) {
      // Remove permission
      await deleteAssignment({ id: assignmentId }).unwrap();
    } else if (!isGranted) {
      // Add permission
      await insertAssignment({ rolAccesoRutaDto: { idRol: roleId, idAccesoRuta: routeId } }).unwrap();
    }
  };

  const isLoading = loadingRutas || loadingAssignments;

  return (
    <dialog ref={dialogRef} className="roles-page__dialog permissions-modal">
      <div className="roles-page__form">
        <header className="roles-page__form-header">
          <h2>Permisos del Rol: {roleName}</h2>
          <button
            type="button"
            className="roles-page__dialog-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </header>

        <main className="roles-page__form-body" style={{ minHeight: "300px" }}>
          {isLoading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>Cargando permisos...</div>
          ) : (
            <div className="permissions-group-container" style={{ padding: "10px" }}>
              {Object.keys(groupedRoutes).map((group) => (
                <div key={group} className="permission-group" style={{ marginBottom: "20px" }}>
                  <h3 style={{ textTransform: "capitalize", borderBottom: "1px solid #ccc", paddingBottom: "5px", marginBottom: "10px" }}>
                    {group}
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {groupedRoutes[group].map((route) => {
                      const assignment = roleAssignments.find((a) => a.idAccesoRuta === route.id);
                      const isGranted = !!assignment;
                      return (
                        <label
                          key={route.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isGranted}
                            onChange={() => handleToggle(route.id!, isGranted, assignment?.id)}
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span title={route.path}>{route.nombre || route.path}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="roles-page__form-footer">
          <Button type="button" variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </div>
    </dialog>
  );
};
