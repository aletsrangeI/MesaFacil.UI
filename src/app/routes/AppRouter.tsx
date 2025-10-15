import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";
import { RoleGuard } from "./RoleGuard";
import RegistroUsuario from "../../pages/auth/RegistroUsuario";
import AppLayout from "../../layout/AppLayout";

import {
  selectRolesOrGuest, // devuelve roles canónicos o ["guest"]
  selectAccesos, // rutas permitidas (o ["/"])
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

      {/* Privado: AppLayout (Sidebar + Topbar opcional) */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout
              roles={roles as any} // AppLayout construye el menú con nav.config
              accesos={accesos}
              badgesCtx={{ pedidosPendientes: 3 }} // ejemplo; conéctalo a Redux/Query cuando lo tengas
              showTopbar
            />
          </PrivateRoute>
        }
      >
        {/* Dashboard (index) */}
        <Route index element={<Placeholder title="Dashboard" />} />

        {/* Operación */}
        <Route path="/pedidos" element={<Placeholder title="Pedidos" />} />
        <Route path="/mesas" element={<Placeholder title="Mesas" />} />
        <Route path="/delivery" element={<Placeholder title="Delivery" />} />
        <Route path="/cocina" element={<Placeholder title="Cocina KDS" />} />
        <Route
          path="/caja/rapida"
          element={<Placeholder title="Caja Rápida" />}
        />

        {/* Cobro */}
        <Route
          path="/cobro/cuentas"
          element={<Placeholder title="Cuentas" />}
        />
        <Route path="/cobro/pagos" element={<Placeholder title="Pagos" />} />
        <Route
          path="/cobro/descuentos"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Descuentos" />
            </RoleGuard>
          }
        />

        {/* Caja */}
        <Route path="/caja/turnos" element={<Placeholder title="Turnos" />} />
        <Route
          path="/caja/movimientos"
          element={<Placeholder title="Movimientos" />}
        />
        <Route
          path="/caja/cortes"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Cortes de Caja" />
            </RoleGuard>
          }
        />

        {/* Menú */}
        <Route
          path="/menu/menues"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Menús" />
            </RoleGuard>
          }
        />
        <Route
          path="/menu/categorias"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Categorías" />
            </RoleGuard>
          }
        />
        <Route
          path="/menu/productos"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Productos" />
            </RoleGuard>
          }
        />
        <Route
          path="/menu/variantes"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Variantes" />
            </RoleGuard>
          }
        />
        <Route
          path="/menu/precios"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Precios" />
            </RoleGuard>
          }
        />
        <Route
          path="/menu/modificadores"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Modificadores" />
            </RoleGuard>
          }
        />

        {/* Clientes */}
        <Route
          path="/clientes"
          element={
            <RoleGuard allowed={["admin", "manager", "cashier", "waiter"]}>
              <Placeholder title="Clientes" />
            </RoleGuard>
          }
        />

        {/* Reportes */}
        <Route
          path="/reportes/ventas"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Reporte de Ventas" />
            </RoleGuard>
          }
        />
        <Route
          path="/reportes/productos"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Reporte de Productos" />
            </RoleGuard>
          }
        />
        <Route
          path="/reportes/pedidos"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Reporte de Pedidos" />
            </RoleGuard>
          }
        />
        <Route
          path="/reportes/caja"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Reporte de Caja" />
            </RoleGuard>
          }
        />
        <Route
          path="/reportes/kds"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Reporte KDS" />
            </RoleGuard>
          }
        />

        {/* Gestión */}
        <Route
          path="/gestion/empresa"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Empresa" />
            </RoleGuard>
          }
        />
        <Route
          path="/gestion/sucursales"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Sucursales" />
            </RoleGuard>
          }
        />
        <Route
          path="/gestion/areas"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Áreas" />
            </RoleGuard>
          }
        />
        <Route
          path="/gestion/mesas"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Mesas (Gestión)" />
            </RoleGuard>
          }
        />

        {/* Seguridad */}
        <Route
          path="/seguridad/usuarios"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Usuarios" />
            </RoleGuard>
          }
        />
        <Route
          path="/seguridad/roles"
          element={
            <RoleGuard allowed={["admin"]}>
              <Placeholder title="Roles y Permisos" />
            </RoleGuard>
          }
        />
        <Route
          path="/seguridad/credenciales"
          element={
            <RoleGuard allowed={["admin"]}>
              <Placeholder title="Credenciales" />
            </RoleGuard>
          }
        />
        <Route
          path="/seguridad/turnos"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Turnos (Seguridad)" />
            </RoleGuard>
          }
        />

        {/* Catálogos / Config */}
        <Route
          path="/catalogos"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Catálogos" />
            </RoleGuard>
          }
        />
        <Route
          path="/config/apariencia"
          element={
            <RoleGuard allowed={["admin"]}>
              <Placeholder title="Apariencia" />
            </RoleGuard>
          }
        />
        <Route
          path="/config/integraciones"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Integraciones" />
            </RoleGuard>
          }
        />
        <Route
          path="/config/sistema"
          element={
            <RoleGuard allowed={["admin"]}>
              <Placeholder title="Sistema" />
            </RoleGuard>
          }
        />
        <Route
          path="/config/auditoria"
          element={
            <RoleGuard allowed={["admin", "manager"]}>
              <Placeholder title="Auditoría" />
            </RoleGuard>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}