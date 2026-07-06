// imports
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";
import { PermissionGuard } from "./PermissionGuard"; // <-- usa permisos finos
import RegistroUsuario from "../../pages/auth/RegistroUsuario";
import LoginPin from "../../pages/auth/LoginPin";
import UsuariosPage from "../../pages/seguridad/UsuariosPage";
import AppLayout from "../../layout/AppLayout";
import {
  selectRolesOrGuest,
  selectAccesos,
} from "../../state/authSlice";

function Placeholder({ title }: { title: string }) {
  return (
    <main style={{ padding: 16 }}>
      <h1>{title}</h1>
      <p>Pendiente…</p>
    </main>
  );
}


export default function AppRouter() {
  const roles = useSelector(selectRolesOrGuest);
  const accesos = useSelector(selectAccesos);

  return (
    <Routes>
      {/* Público */}
      <Route path="/login" element={<RegistroUsuario />} />
      <Route path="/login-pin" element={<LoginPin />} />

      {/* Privado */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout roles={roles as any} accesos={accesos} badgesCtx={{ pedidosPendientes: 3 }} showTopbar />
          </PrivateRoute>
        }
      >
        {/* Dashboard (index) */}
        <Route
          index
          element={
            <PermissionGuard required="DASHBOARD_VIEW">
              <Placeholder title="Dashboard" />
            </PermissionGuard>
          }
        />

        {/* --- Operación (si aún no definimos permisos de operación, puedes dejar RoleGuard o libre) --- */}
        <Route path="/pedidos" element={<Placeholder title="Pedidos" />} />
        <Route path="/mesas" element={<Placeholder title="Mesas" />} />
        <Route path="/delivery" element={<Placeholder title="Delivery" />} />
        <Route path="/cocina" element={<Placeholder title="Cocina KDS" />} />
        <Route path="/caja/rapida" element={<Placeholder title="Caja Rápida" />} />

        {/* Cobro */}
        <Route path="/cobro/cuentas" element={<Placeholder title="Cuentas" />} />
        <Route path="/cobro/pagos" element={<Placeholder title="Pagos" />} />
        {/* si luego defines permisos de cobro, cámbialo a PermissionGuard */}
        <Route
          path="/cobro/descuentos"
          element={
            <PermissionGuard required="PRICING_ADMIN">
              <Placeholder title="Descuentos" />
            </PermissionGuard>
          }
        />

        {/* Caja (cuando definas permisos de caja, cambiamos) */}
        <Route path="/caja/turnos" element={<Placeholder title="Turnos" />} />
        <Route path="/caja/movimientos" element={<Placeholder title="Movimientos" />} />
        <Route path="/caja/cortes" element={<Placeholder title="Cortes de Caja" />} />

        {/* Menú (Catálogo) */}
        <Route
          path="/menu/menues"
          element={
            <PermissionGuard required="CATALOG_ADMIN">
              <Placeholder title="Menús" />
            </PermissionGuard>
          }
        />
        <Route
          path="/menu/categorias"
          element={
            <PermissionGuard required="CATALOG_ADMIN">
              <Placeholder title="Categorías" />
            </PermissionGuard>
          }
        />
        <Route
          path="/menu/productos"
          element={
            <PermissionGuard required="CATALOG_ADMIN">
              <Placeholder title="Productos" />
            </PermissionGuard>
          }
        />
        <Route
          path="/menu/variantes"
          element={
            <PermissionGuard required="CATALOG_ADMIN">
              <Placeholder title="Variantes" />
            </PermissionGuard>
          }
        />
        <Route
          path="/menu/precios"
          element={
            <PermissionGuard required="PRICING_ADMIN">
              <Placeholder title="Precios" />
            </PermissionGuard>
          }
        />
        <Route
          path="/menu/modificadores"
          element={
            <PermissionGuard required="CATALOG_ADMIN">
              <Placeholder title="Modificadores" />
            </PermissionGuard>
          }
        />

        {/* Clientes (hasta definir permiso específico, puedes dejarlo por rol si quieres) */}
        <Route path="/clientes" element={<Placeholder title="Clientes" />} />

        {/* Reportes */}
        <Route
          path="/reportes/ventas"
          element={
            <PermissionGuard required="REPORTS_VIEW">
              <Placeholder title="Reporte de Ventas" />
            </PermissionGuard>
          }
        />
        <Route
          path="/reportes/productos"
          element={
            <PermissionGuard required="REPORTS_VIEW">
              <Placeholder title="Reporte de Productos" />
            </PermissionGuard>
          }
        />
        <Route
          path="/reportes/pedidos"
          element={
            <PermissionGuard required="REPORTS_VIEW">
              <Placeholder title="Reporte de Pedidos" />
            </PermissionGuard>
          }
        />
        <Route
          path="/reportes/caja"
          element={
            <PermissionGuard required="REPORTS_VIEW">
              <Placeholder title="Reporte de Caja" />
            </PermissionGuard>
          }
        />
        <Route
          path="/reportes/kds"
          element={
            <PermissionGuard required="REPORTS_VIEW">
              <Placeholder title="Reporte KDS" />
            </PermissionGuard>
          }
        />

        {/* Gestión / Organización */}
        <Route
          path="/gestion/empresa"
          element={
            <PermissionGuard required="ORG_ADMIN">
              <Placeholder title="Empresa" />
            </PermissionGuard>
          }
        />
        <Route
          path="/gestion/sucursales"
          element={
            <PermissionGuard required="ORG_ADMIN">
              <Placeholder title="Sucursales" />
            </PermissionGuard>
          }
        />
        <Route
          path="/gestion/areas"
          element={
            <PermissionGuard required="ORG_ADMIN">
              <Placeholder title="Áreas" />
            </PermissionGuard>
          }
        />
        <Route
          path="/gestion/mesas"
          element={
            <PermissionGuard required="ORG_ADMIN">
              <Placeholder title="Mesas (Gestión)" />
            </PermissionGuard>
          }
        />

        {/* Seguridad */}
        <Route
          path="/admin/users"
          element={
            <PermissionGuard required="USERS_READ">
              <UsuariosPage />
            </PermissionGuard>
          }
        />
        <Route
          path="/seguridad/roles"
          element={
            <PermissionGuard required="ROLES_READ">
              <Placeholder title="Roles y Permisos" />
            </PermissionGuard>
          }
        />
        <Route
          path="/seguridad/credenciales"
          element={
            <PermissionGuard required="USERS_READ">
              <Placeholder title="Credenciales" />
            </PermissionGuard>
          }
        />
        <Route
          path="/seguridad/turnos"
          element={
            <PermissionGuard required="ORG_ADMIN">
              <Placeholder title="Turnos (Seguridad)" />
            </PermissionGuard>
          }
        />

        {/* Catálogos / Config */}
        <Route
          path="/catalogos"
          element={
            <PermissionGuard required="CATALOG_ADMIN">
              <Placeholder title="Catálogos" />
            </PermissionGuard>
          }
        />
        <Route
          path="/config/apariencia"
          element={
            <PermissionGuard required="ORG_ADMIN">
              <Placeholder title="Apariencia" />
            </PermissionGuard>
          }
        />
        <Route
          path="/config/integraciones"
          element={
            <PermissionGuard required={["ORG_ADMIN", "DEVICES_ADMIN"] /* cualquiera la cumple? ajusta si quieres all */}>
              <Placeholder title="Integraciones" />
            </PermissionGuard>
          }
        />
        <Route
          path="/config/sistema"
          element={
            <PermissionGuard required="ORG_ADMIN">
              <Placeholder title="Sistema" />
            </PermissionGuard>
          }
        />
        <Route
          path="/config/auditoria"
          element={
            <PermissionGuard required="REPORTS_VIEW">
              <Placeholder title="Auditoría" />
            </PermissionGuard>
          }
        />
      </Route>

      {/* Fallbacks */}
      <Route path="/unauthorized" element={<Placeholder title="No autorizado" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
