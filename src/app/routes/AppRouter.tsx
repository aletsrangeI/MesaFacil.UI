import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "../../pages/HomePage";
import { PrivateRoute } from "./PrivateRoute";
import RegistroUsuario from "../../pages/auth/RegistroUsuario";
import LoginPin from "../../pages/auth/LoginPin";
import UsuariosPage from "../../pages/seguridad/usuarios";
import AppLayout from "../../layout/AppLayout";
import { RolesPage } from "../../pages/roles";
import FormulariosPage from "../../pages/formularios";
import CatalogoPage from "../../pages/catalogos";
import {
  selectRolesOrGuest,
  selectAccesos,
  selectCanAccess,
} from "../../state/authSlice";
import ProductosPage from "../../pages/productos";
import CategoriasPage from "../../pages/categorias";
import MenusPage from "../../pages/menues";
import VariantesPage from "../../pages/variantes";
import PosPage from "../../pages/operacion/pos";
import PreciosPage from "../../pages/precios";
import ModificadoresPage from "../../pages/modificadores";
import EmpresaPage from "../../pages/gestion/empresa";
import SucursalesPage from "../../pages/gestion/sucursales";
import AreasPage from "../../pages/gestion/areas";
import MesasPage from "../../pages/gestion/mesas";
import TiposPedidoPage from "../../pages/gestion/tipos-pedido";
import KdsPage from "../../pages/operacion/kds";
import MovimientosPage from "../../pages/caja/movimientos";
import CortesPage from "../../pages/caja/cortes";
import DeliveryPage from "../../pages/operacion/delivery";
import DeliveryHistorialPage from "../../pages/operacion/delivery/historial";
import InventarioPage from "../../pages/inventario";
import ComprasPage from "../../pages/compras";
import CxPPage from "../../pages/cxp";

import { useEffect } from "react";
import { useToast } from "../../components/ui/toast";

/** Guard que valida acceso por path usando selectCanAccess */
function RequireAccess({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const can = useSelector(selectCanAccess(path));
  const { addToast } = useToast();

  useEffect(() => {
    if (!can) {
      addToast({
        message: "Ya no tienes acceso a este módulo. Contacta a tu administrador.",
        variant: "error",
      });
    }
  }, [can, addToast]);

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
              <HomePage />
            </RequireAccess>
          }
        />

        {/* Operación */}
        <Route
          path="/ventas/pos"
          element={
            <RequireAccess path="/ventas/pos">
              <PosPage />
            </RequireAccess>
          }
        />
        <Route
          path="/ventas/kds"
          element={
            <RequireAccess path="/ventas/kds">
              <KdsPage />
            </RequireAccess>
          }
        />
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
              <DeliveryPage />
            </RequireAccess>
          }
        />
        <Route
          path="/delivery/historial"
          element={
            <RequireAccess path="/delivery/historial">
              <DeliveryHistorialPage />
            </RequireAccess>
          }
        />
        <Route
          path="/cocina"
          element={
            <RequireAccess path="/cocina">
              <KdsPage />
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
              <MovimientosPage />
            </RequireAccess>
          }
        />
        <Route
          path="/caja/cortes"
          element={
            <RequireAccess path="/caja/cortes">
              <CortesPage />
            </RequireAccess>
          }
        />

        {/* Menú */}
        <Route
          path="/menu/menues"
          element={
            <RequireAccess path="/menu">
              <MenusPage />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/categorias"
          element={
            <RequireAccess path="/menu">
              <CategoriasPage />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/productos"
          element={
            <RequireAccess path="/menu">
              <ProductosPage />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/variantes"
          element={
            <RequireAccess path="/menu">
              <VariantesPage />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/precios"
          element={
            <RequireAccess path="/menu">
              <PreciosPage />
            </RequireAccess>
          }
        />
        <Route
          path="/menu/modificadores"
          element={
            <RequireAccess path="/menu">
              <ModificadoresPage />
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
            <RequireAccess path="/">
              <EmpresaPage />
            </RequireAccess>
          }
        />
        <Route
          path="/gestion/sucursales"
          element={
            <RequireAccess path="/">
              <SucursalesPage />
            </RequireAccess>
          }
        />
        <Route
          path="/gestion/areas"
          element={
            <RequireAccess path="/">
              <AreasPage />
            </RequireAccess>
          }
        />
        <Route
          path="/gestion/mesas"
          element={
            <RequireAccess path="/">
              <MesasPage />
            </RequireAccess>
          }
        />
        <Route
          path="/gestion/tipos-pedido"
          element={
            <RequireAccess path="/">
              <TiposPedidoPage />
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
        {/* Catálogos genéricos — redirect de la URL legacy y ruta parametrizada */}
        <Route
          path="/admin/catalog"
          element={<Navigate to="/admin/catalogos/credenciales" replace />}
        />
        <Route
          path="/admin/catalogos/:catalog"
          element={
            <RequireAccess path="/admin/catalog">
              <CatalogoPage />
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
          path="/inventario"
          element={
            <RequireAccess path="/inventario">
              <InventarioPage />
            </RequireAccess>
          }
        />
        <Route
          path="/compras"
          element={
            <RequireAccess path="/compras">
              <ComprasPage />
            </RequireAccess>
          }
        />
        <Route
          path="/cxp"
          element={
            <RequireAccess path="/cxp">
              <CxPPage />
            </RequireAccess>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <RequireAccess path="/admin/inventory">
              <InventarioPage />
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
