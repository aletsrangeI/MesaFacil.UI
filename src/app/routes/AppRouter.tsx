import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";
import RegistroUsuario from "../../pages/auth/RegistroUsuario";
import LoginPin from "../../pages/auth/LoginPin";
import UsuariosPage from "../../pages/seguridad/usuarios";
import AppLayout from "../../layout/AppLayout";
import { RolesPage } from "../../pages/roles";
import FormulariosPage from "../../pages/formularios";
import {
  selectRolesOrGuest,
  selectAccesos,
  selectCanAccess,
} from "../../state/authSlice";

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

/** Placeholder temporal para cada página */
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
            <AppLayout
              roles={roles as any}
              accesos={accesos}
              badgesCtx={{ pedidosPendientes: 3 }}
              showTopbar
            />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/" replace />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <RequireAccess path="/">
              <Placeholder title="Dashboard" />
            </RequireAccess>
          }
        />

        {/* Operación */}
        <Route
          path="/pedidos"
          element={
            <RequireAccess path="/pedidos">
              <Placeholder title="Pedidos" />
            </RequireAccess>
          }
        />
        <Route
          path="/mesas"
          element={
            <RequireAccess path="/mesas">
              <Placeholder title="Mesas" />
            </RequireAccess>
          }
        />
        <Route
          path="/delivery"
          element={
            <RequireAccess path="/delivery">
              <Placeholder title="Delivery" />
            </RequireAccess>
          }
        />
        <Route
          path="/cocina"
          element={
            <RequireAccess path="/cocina">
              <Placeholder title="Cocina KDS" />
            </RequireAccess>
          }
        />
        <Route
          path="/caja/rapida"
          element={
            <RequireAccess path="/caja/rapida">
              <Placeholder title="Caja Rápida" />
            </RequireAccess>
          }
        />

        {/* Cobro */}
        <Route
          path="/cobro/cuentas"
          element={
            <RequireAccess path="/cobro/cuentas">
              <Placeholder title="Cuentas" />
            </RequireAccess>
          }
        />
        <Route
          path="/cobro/pagos"
          element={
            <RequireAccess path="/cobro/pagos">
              <Placeholder title="Pagos" />
            </RequireAccess>
          }
        />
        <Route
          path="/cobro/descuentos"
          element={
            <RequireAccess path="/cobro/descuentos">
              <Placeholder title="Descuentos" />
            </RequireAccess>
          }
        />

        {/* Caja */}
        <Route
          path="/caja/turnos"
          element={
            <RequireAccess path="/caja/turnos">
              <Placeholder title="Turnos" />
            </RequireAccess>
          }
        />
        <Route
          path="/caja/movimientos"
          element={
            <RequireAccess path="/caja/movimientos">
              <Placeholder title="Movimientos" />
            </RequireAccess>
          }
        />
        <Route
          path="/caja/cortes"
          element={
            <RequireAccess path="/caja/cortes">
              <Placeholder title="Cortes de Caja" />
            </RequireAccess>
          }
        />

        {/* Menú */}
        <Route
          path="/menu/menues"
          element={
            <RequireAccess path="/menu/menues">
              <Placeholder title="Menús" />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/categorias"
          element={
            <RequireAccess path="/menu/categorias">
              <Placeholder title="Categorías" />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/productos"
          element={
            <RequireAccess path="/menu/productos">
              <Placeholder title="Productos" />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/variantes"
          element={
            <RequireAccess path="/menu/variantes">
              <Placeholder title="Variantes" />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/precios"
          element={
            <RequireAccess path="/menu/precios">
              <Placeholder title="Precios" />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/modificadores"
          element={
            <RequireAccess path="/menu/modificadores">
              <Placeholder title="Modificadores" />
            </RequireAccess>
          }
        />

        {/* Clientes */}
        <Route
          path="/clientes"
          element={
            <RequireAccess path="/clientes">
              <Placeholder title="Clientes" />
            </RequireAccess>
          }
        />

        {/* Reportes */}
        <Route
          path="/reportes/ventas"
          element={
            <RequireAccess path="/reportes/ventas">
              <Placeholder title="Reporte de Ventas" />
            </RequireAccess>
          }
        />
        <Route
          path="/reportes/productos"
          element={
            <RequireAccess path="/reportes/productos">
              <Placeholder title="Reporte de Productos" />
            </RequireAccess>
          }
        />
        <Route
          path="/reportes/pedidos"
          element={
            <RequireAccess path="/reportes/pedidos">
              <Placeholder title="Reporte de Pedidos" />
            </RequireAccess>
          }
        />
        <Route
          path="/reportes/caja"
          element={
            <RequireAccess path="/reportes/caja">
              <Placeholder title="Reporte de Caja" />
            </RequireAccess>
          }
        />
        <Route
          path="/reportes/kds"
          element={
            <RequireAccess path="/reportes/kds">
              <Placeholder title="Reporte KDS" />
            </RequireAccess>
          }
        />

        {/* Gestión */}
        <Route
          path="/gestion/empresa"
          element={
            <RequireAccess path="/gestion/empresa">
              <Placeholder title="Empresa" />
            </RequireAccess>
          }
        />
        <Route
          path="/gestion/sucursales"
          element={
            <RequireAccess path="/gestion/sucursales">
              <Placeholder title="Sucursales" />
            </RequireAccess>
          }
        />
        <Route
          path="/gestion/areas"
          element={
            <RequireAccess path="/gestion/areas">
              <Placeholder title="Áreas" />
            </RequireAccess>
          }
        />
        <Route
          path="/gestion/mesas"
          element={
            <RequireAccess path="/gestion/mesas">
              <Placeholder title="Mesas (Gestión)" />
            </RequireAccess>
          }
        />

        {/* Seguridad & Administración */}
        <Route
          path="/admin/users"
          element={
            <RequireAccess path="/admin/users">
              <UsuariosPage />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <RequireAccess path="/admin/roles">
              <RolesPage />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/permissions"
          element={
            <RequireAccess path="/admin/permissions">
              <Placeholder title="Permisos / Rutas" />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/org"
          element={
            <RequireAccess path="/admin/org">
              <Placeholder title="Organización" />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/catalog"
          element={
            <RequireAccess path="/admin/catalog">
              <Placeholder title="Catálogo" />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/forms"
          element={
            <RequireAccess path="/admin/forms">
              <FormulariosPage />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/pricing"
          element={
            <RequireAccess path="/admin/pricing">
              <Placeholder title="Precios y Promos" />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <RequireAccess path="/admin/inventory">
              <Placeholder title="Inventario" />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/devices"
          element={
            <RequireAccess path="/admin/devices">
              <Placeholder title="Dispositivos" />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RequireAccess path="/admin/reports">
              <Placeholder title="Reportes" />
            </RequireAccess>
          }
        />
      </Route>

      {/* Fallbacks */}
      <Route path="/unauthorized" element={<Placeholder title="No autorizado" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
