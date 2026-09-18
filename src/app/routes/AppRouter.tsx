import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";
import AppLayout from "../../layout/AppLayout";
import {
  selectRolesOrGuest,
  selectAccesos,
  selectCanAccess,
} from "../../state/authSlice";
import { useToast } from "../../components/ui/toast";
import {
  ModuleSkeletonLoader,
  ComanderoSkeleton,
  PosSkeleton,
  KdsSkeleton,
} from "../../components/common/loaders/ModuleSkeletonLoader";

// Lazy-loaded pages para optimización de bundle y arranque rápido
const DashboardPage = lazy(() => import("../../pages/dashboard/DashboardPage"));
const RegistroUsuario = lazy(() => import("../../pages/auth/RegistroUsuario"));
const LoginPin = lazy(() => import("../../pages/auth/LoginPin"));
const UsuariosPage = lazy(() => import("../../pages/seguridad/usuarios"));
const RolesPage = lazy(() =>
  import("../../pages/roles").then((m) => ({ default: m.RolesPage }))
);
const FormulariosPage = lazy(() => import("../../pages/formularios"));
const CatalogoPage = lazy(() => import("../../pages/catalogos"));
const ProductosPage = lazy(() => import("../../pages/productos"));
const CategoriasPage = lazy(() => import("../../pages/categorias"));
const MenusPage = lazy(() => import("../../pages/menues"));
const VariantesPage = lazy(() => import("../../pages/variantes"));
const PosPage = lazy(() => import("../../pages/operacion/pos"));
const PreciosPage = lazy(() => import("../../pages/precios"));
const ModificadoresPage = lazy(() => import("../../pages/modificadores"));
const EmpresaPage = lazy(() => import("../../pages/gestion/empresa"));
const SucursalesPage = lazy(() => import("../../pages/gestion/sucursales"));
const ImpresorasPage = lazy(() => import("../../pages/gestion/impresoras"));
const AreasPage = lazy(() => import("../../pages/gestion/areas"));
const MesasPage = lazy(() => import("../../pages/gestion/mesas"));
const TiposPedidoPage = lazy(() => import("../../pages/gestion/tipos-pedido"));
const KdsPage = lazy(() => import("../../pages/operacion/kds"));
const MovimientosPage = lazy(() => import("../../pages/caja/movimientos"));
const CortesPage = lazy(() => import("../../pages/caja/cortes"));
const DeliveryPage = lazy(() => import("../../pages/operacion/delivery"));
const DeliveryHistorialPage = lazy(
  () => import("../../pages/operacion/delivery/historial")
);
const InventarioPage = lazy(() => import("../../pages/inventario"));
const ComprasPage = lazy(() => import("../../pages/compras"));
const CxPPage = lazy(() => import("../../pages/cxp"));
const PlanesPage = lazy(() => import("../../pages/planes"));
const FacturacionPage = lazy(() => import("../../pages/facturacion"));
const AutofacturacionPage = lazy(
  () => import("../../pages/public/AutofacturacionPage")
);
const ComanderoPage = lazy(() => import("../../pages/operacion/comandero"));
const MenuEngineeringPage = lazy(
  () => import("../../pages/analitica/MenuEngineeringPage")
);

// Utilidades de pre-fetching inteligente en segundo plano tras autenticación
export const prefetchComandero = () => import("../../pages/operacion/comandero");
export const prefetchPos = () => import("../../pages/operacion/pos");
export const prefetchKds = () => import("../../pages/operacion/kds");
export const prefetchDashboard = () => import("../../pages/dashboard/DashboardPage");

export function prefetchTargetRoute(path?: string | null) {
  if (!path) return;
  const p = path.toLowerCase();
  if (p.startsWith("/operacion/comandero")) {
    prefetchComandero();
  } else if (p.startsWith("/ventas/pos")) {
    prefetchPos();
  } else if (p.startsWith("/ventas/kds") || p.startsWith("/cocina")) {
    prefetchKds();
  } else if (p === "/" || p.startsWith("/dashboard")) {
    prefetchDashboard();
  }
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
      <Route
        path="/login"
        element={
          <Suspense fallback={<ModuleSkeletonLoader />}>
            <RegistroUsuario />
          </Suspense>
        }
      />
      <Route
        path="/login-pin"
        element={
          <Suspense fallback={<ModuleSkeletonLoader />}>
            <LoginPin />
          </Suspense>
        }
      />

      {/* Portal Público de Autofacturación (spec 020) — sin login, standalone */}
      <Route
        path="/facturar"
        element={
          <Suspense fallback={<ModuleSkeletonLoader />}>
            <AutofacturacionPage />
          </Suspense>
        }
      />
      <Route
        path="/facturar/:ticketId"
        element={
          <Suspense fallback={<ModuleSkeletonLoader />}>
            <AutofacturacionPage />
          </Suspense>
        }
      />

      {/* Modo Comandero Móvil (spec 025) — requiere sesión (PrivateRoute) pero se renderiza
          FUERA de <AppLayout> a propósito: es una vista a pantalla completa, sin el sidebar
          denso del backoffice, pensada para tablets de 8.4"/smartphones de meseros. */}
      <Route
        path="/operacion/comandero"
        element={
          <PrivateRoute>
            <RequireAccess path="/operacion/comandero">
              <Suspense fallback={<ComanderoSkeleton />}>
                <ComanderoPage />
              </Suspense>
            </RequireAccess>
          </PrivateRoute>
        }
      />

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
        {/* Dashboard como vista principal y ruta raíz */}
        <Route index element={<DashboardPage />} />
        <Route path="/" element={<DashboardPage />} />

        {/* Operación */}
        <Route
          path="/ventas/pos"
          element={
            <RequireAccess path="/ventas/pos">
              <Suspense fallback={<PosSkeleton />}>
                <PosPage />
              </Suspense>
            </RequireAccess>
          }
        />
        <Route
          path="/ventas/kds"
          element={
            <RequireAccess path="/ventas/kds">
              <Suspense fallback={<KdsSkeleton />}>
                <KdsPage />
              </Suspense>
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
              <Suspense fallback={<KdsSkeleton />}>
                <KdsPage />
              </Suspense>
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
        <Route
          path="/analitica/ingenieria-menu"
          element={
            <RequireAccess path="/menu">
              <MenuEngineeringPage />
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
          path="/gestion/impresoras"
          element={
            <RequireAccess path="/">
              <ImpresorasPage />
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
        <Route
          path="/gestion/planes"
          element={
            <RequireAccess path="/">
              <PlanesPage />
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
          path="/inventario/recetas"
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
          path="/facturacion"
          element={
            <RequireAccess path="/facturacion">
              <FacturacionPage />
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
