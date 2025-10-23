import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";
import RegistroUsuario from "../../pages/auth/RegistroUsuario";
import AppLayout from "../../layout/AppLayout";
import { RolesPage } from "../../pages/roles";

import {
  selectRolesOrGuest, // roles canónicos o ["guest"]
  selectAccesos,      // rutas permitidas (o ["/"])
  selectCanAccess,    // selector parametrizado por path
} from "../../state/authSlice";

/** Placeholder temporal para cada página */
function Placeholder({ title }: { title: string }) {
  return (
    <main style={{ padding: 16 }}>
      <h1>{title}</h1>
      <p>Pendiente…</p>
    </main>
  );
}

/** Guard que valida acceso por path usando selectCanAccess */
function RequireAccess({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const can = useSelector(selectCanAccess(path));
  return can ? <>{children}</> : <Navigate to="/" replace />;
}

export default function AppRouter() {
  const roles = useSelector(selectRolesOrGuest);
  const accesos = useSelector(selectAccesos);

  return (
    <Routes>
      {/* Público */}
      <Route path="/login" element={<RegistroUsuario />} />

      {/* Privado: AppLayout (Sidebar + Topbar opcional) */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout
              roles={roles as any}
              accesos={accesos}
              badgesCtx={{}}     // conéctalo a Redux/Query cuando tengas contadores
              showTopbar
            />
          </PrivateRoute>
        }
      >
        {/* Importante: el index redirige a "/" (que está protegido por RequireAccess) */}
        <Route index element={<Navigate to="/" replace />} />

        {/* === Rutas registradas en backend (IsMenu = true) === */}
        {/* 1) Dashboard → "/" */}
        <Route
          path="/"
          element={
            <RequireAccess path="/">
              <Placeholder title="Dashboard" />
            </RequireAccess>
          }
        />

        {/* 2) /admin/users (USERS_READ) */}
        <Route
          path="/admin/users"
          element={
            <RequireAccess path="/admin/users">
              <Placeholder title="Usuarios" />
            </RequireAccess>
          }
        />

        {/* 4) /admin/roles (ROLES_READ) */}
        <Route
          path="/admin/roles"
          element={
            <RequireAccess path="/admin/roles">
              <RolesPage/>
            </RequireAccess>
          }
        />

        {/* 6) /admin/permissions (ROUTES_ADMIN) */}
        <Route
          path="/admin/permissions"
          element={
            <RequireAccess path="/admin/permissions">
              <Placeholder title="Permisos / Rutas" />
            </RequireAccess>
          }
        />

        {/* 7) /admin/org (ORG_ADMIN) */}
        <Route
          path="/admin/org"
          element={
            <RequireAccess path="/admin/org">
              <Placeholder title="Organización" />
            </RequireAccess>
          }
        />

        {/* 8) /admin/catalog (CATALOG_ADMIN) */}
        <Route
          path="/admin/catalog"
          element={
            <RequireAccess path="/admin/catalog">
              <Placeholder title="Catálogo" />
            </RequireAccess>
          }
        />

        {/* 9) /admin/forms (FORMS_ADMIN) */}
        <Route
          path="/admin/forms"
          element={
            <RequireAccess path="/admin/forms">
              <Placeholder title="Form Builder" />
            </RequireAccess>
          }
        />

        {/* 10) /admin/pricing (PRICING_ADMIN) */}
        <Route
          path="/admin/pricing"
          element={
            <RequireAccess path="/admin/pricing">
              <Placeholder title="Precios y Promos" />
            </RequireAccess>
          }
        />

        {/* 11) /admin/inventory (INVENTORY_READ) */}
        <Route
          path="/admin/inventory"
          element={
            <RequireAccess path="/admin/inventory">
              <Placeholder title="Inventario" />
            </RequireAccess>
          }
        />

        {/* 13) /admin/devices (DEVICES_ADMIN) */}
        <Route
          path="/admin/devices"
          element={
            <RequireAccess path="/admin/devices">
              <Placeholder title="Dispositivos" />
            </RequireAccess>
          }
        />

        {/* 14) /admin/reports (REPORTS_VIEW) */}
        <Route
          path="/admin/reports"
          element={
            <RequireAccess path="/admin/reports">
              <Placeholder title="Reportes" />
            </RequireAccess>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
