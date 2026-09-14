import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ReceiptText } from "lucide-react";
import { selectUserProfile } from "../../../state/authSlice";
import { addToCart, clearCart, selectCart } from "../../../state/cartSlice";
import { useToast } from "../../../components/ui/toast";
import { useConfirm } from "../../../components/ui/confirm-dialog";
import { generateUUID } from "../../../lib/uuid";
import {
  useCategoriasGetAllQuery,
  useProductosGetAllQuery,
  usePreciosGetAllQuery,
  useVarianteProductosGetAllQuery,
  useGrupoModificadoresGetAllQuery,
  useOpcionModificadoresGetAllQuery,
  useMesasGetAllQuery,
  useAreasGetAllQuery,
  useTiposPedidoGetAllQuery,
  useCatalogosGetAllQuery,
  useSucursalesGetAllQuery,
  useMesasUpdateAsyncMutation,
  usePedidosInsertConDetallesAsyncMutation,
  usePedidosGetAllAsyncQuery,
} from "../../../services/generated/api";
import {
  useComanderoGetPedidoActivoByMesaQuery,
  useComanderoAgregarDetallesMutation,
} from "./comanderoApi";
import { ComanderoMesasGrid } from "./ComanderoMesasGrid";
import { ComanderoMenuBrowser } from "./ComanderoMenuBrowser";
import { ComanderoModifierSheet } from "./ComanderoModifierSheet";
import { ComanderoStickyBar } from "./ComanderoStickyBar";
import "./comandero.css";

/**
 * Modo Comandero Móvil (spec 025) — /operacion/comandero
 *
 * Reinterpretación visual mobile-first del mismo flujo de captura del POS
 * (src/pages/operacion/pos/index.tsx): selección de mesa -> catálogo -> modificadores
 * -> envío a cocina, usando exactamente los mismos endpoints/estado (cartSlice,
 * usePedidosInsertConDetallesAsyncMutation, useMesasUpdateAsyncMutation, etc.).
 *
 * Decisión de seguridad (spec 024 / criterio #4 de spec 025): esta vista NUNCA expone
 * un botón para cancelar/eliminar platillos que ya fueron enviados a cocina. La sección
 * "En cocina" del resumen de mesa es de solo lectura. Esa acción protegida por PIN de
 * supervisor sigue existiendo únicamente en el POS de caja (src/pages/operacion/pos/index.tsx).
 */
export default function ComanderoLayout() {
  const profile = useSelector(selectUserProfile);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const { addToast } = useToast();
  const confirm = useConfirm();

  const [view, setView] = useState<"mesas" | "menu">("mesas");
  const [selectedMesa, setSelectedMesa] = useState<any>(null);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => generateUUID());

  const { data: catData } = useCategoriasGetAllQuery();
  const { data: prodData } = useProductosGetAllQuery();
  const { data: varData } = useVarianteProductosGetAllQuery();
  const { data: precioData } = usePreciosGetAllQuery();
  const { data: gruposData } = useGrupoModificadoresGetAllQuery();
  const { data: opcionesData } = useOpcionModificadoresGetAllQuery();
  const { data: catTiposData } = useTiposPedidoGetAllQuery();
  const { data: mesasData, refetch: refetchMesas } = useMesasGetAllQuery();
  const { data: areasData } = useAreasGetAllQuery();
  const { data: pedidosData } = usePedidosGetAllAsyncQuery(undefined, { pollingInterval: 15000 });
  const { data: sucursalesData } = useSucursalesGetAllQuery();
  const { data: catEstadosMesa } = useCatalogosGetAllQuery({ catalog: "estados-mesa" });
  const { data: catEstadosPedido } = useCatalogosGetAllQuery({ catalog: "estados-pedido" });
  const { data: catEstadosPedidoDetalle } = useCatalogosGetAllQuery({ catalog: "estados-pedido-detalle" });
  const { data: catImpuestos } = useCatalogosGetAllQuery({ catalog: "impuestos" });

  const [updateMesa, { isLoading: isPidiendoCuenta }] = useMesasUpdateAsyncMutation();
  const [insertarPedido, { isLoading: isInsertando }] = usePedidosInsertConDetallesAsyncMutation();
  const [agregarDetalles, { isLoading: isAgregando }] = useComanderoAgregarDetallesMutation();

  const { data: pedidoActivoData } = useComanderoGetPedidoActivoByMesaQuery(selectedMesa?.id ?? 0, {
    skip: !selectedMesa?.id,
  });
  const pedidoActivo = pedidoActivoData?.isSuccess ? pedidoActivoData?.data : null;
  const modoRetomar = !!pedidoActivo;

  const categorias = Array.isArray((catData as any)?.data) ? (catData as any).data : [];
  const rawProductos = Array.isArray((prodData as any)?.data) ? (prodData as any).data : [];
  const variantes = Array.isArray((varData as any)?.data) ? (varData as any).data : [];
  const precios = Array.isArray((precioData as any)?.data) ? (precioData as any).data : [];
  const grupos = Array.isArray((gruposData as any)?.data) ? (gruposData as any).data : [];
  const opciones = Array.isArray((opcionesData as any)?.data) ? (opcionesData as any).data : [];
  const mesas = Array.isArray((mesasData as any)?.data) ? (mesasData as any).data : [];
  const areas = Array.isArray((areasData as any)?.data) ? (areasData as any).data : [];
  const pedidos = Array.isArray((pedidosData as any)?.data) ? (pedidosData as any).data : [];
  const estadosMesa = Array.isArray((catEstadosMesa as any)?.data) ? (catEstadosMesa as any).data : [];
  const estadosPedido = Array.isArray((catEstadosPedido as any)?.data) ? (catEstadosPedido as any).data : [];
  const estadosPedidoDetalle = Array.isArray((catEstadosPedidoDetalle as any)?.data) ? (catEstadosPedidoDetalle as any).data : [];
  const impuestos = Array.isArray((catImpuestos as any)?.data) ? (catImpuestos as any).data : [];

  const rawOrderTypes = Array.isArray((catTiposData as any)?.data) ? (catTiposData as any).data : [];
  const orderTypeComedor = rawOrderTypes.find((t: any) => t.isComedor && t.isActive !== false) || rawOrderTypes[0];

  // Pedidos "activos" (no cerrados/cancelados) para calcular minutos abierta por mesa en el grid.
  const pedidosActivos = useMemo(
    () => pedidos.filter((p: any) => {
      const estado = estadosPedido.find((e: any) => e.id === p.idEstadoPedido);
      const desc = (estado?.descripcion || "").toLowerCase();
      return !desc.includes("cerrado") && !desc.includes("cancelado");
    }),
    [pedidos, estadosPedido]
  );

  const productos = useMemo(
    () =>
      rawProductos.map((p: any) => {
        const productVariantes = variantes.filter((v: any) => v.idProducto === p.id);
        return {
          ...p,
          variantes:
            productVariantes.length > 0
              ? productVariantes.map((v: any) => {
                  const precioObj = precios.find((pr: any) => pr.idVariante === v.id);
                  return { ...v, precio: precioObj ? precioObj.monto : 0 };
                })
              : [{ id: 0, nombre: "Regular", precio: 0 }],
        };
      }),
    [rawProductos, variantes, precios]
  );

  const defaultImpuesto = impuestos.find((i: any) => i.descripcion?.toLowerCase().includes("iva")) || impuestos[0] || { id: 1, descripcion: "IVA 16%" };
  const tasaImpuestoMatch = defaultImpuesto.descripcion?.match(/\d+(\.\d+)?/);
  const defaultTasaImpuesto = tasaImpuestoMatch ? parseFloat(tasaImpuestoMatch[0]) : 16;
  const defaultIdImpuesto = defaultImpuesto.id;
  const factorIva = 1 + defaultTasaImpuesto / 100;

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.precioTotal || 0) * (curr.cantidad || 1), 0);
  const itemCount = cart.reduce((acc, curr) => acc + (curr.cantidad || 1), 0);

  const handleSelectMesa = async (mesa: any) => {
    const estado = estadosMesa.find((e: any) => e.id === (mesa.idEstadoMesa || 1));
    const isOcupada = (estado?.descripcion || "").toLowerCase().includes("ocupada");
    if (isOcupada) {
      const ok = await confirm({
        title: "Mesa Ocupada",
        message: "Esta mesa ya tiene un pedido activo. ¿Deseas agregar más ítems a la cuenta?",
        confirmLabel: "Sí, continuar",
        variant: "warning",
      });
      if (!ok) return;
    }
    dispatch(clearCart());
    setSelectedMesa(mesa);
    setView("menu");
  };

  const handleVolverAMesas = () => {
    dispatch(clearCart());
    setSelectedMesa(null);
    setView("mesas");
  };

  const handleSelectProducto = (prod: any) => {
    const productGroups = grupos.filter((g: any) => g.idProducto === prod.id && g.activo !== false);
    if (prod.variantes.length > 1 || productGroups.length > 0) {
      setModalProduct(prod);
    } else {
      handleConfirmAddToCart(prod, prod.variantes[0], [], 0, "");
    }
  };

  const handleConfirmAddToCart = (
    prod: any,
    selectedVariant: any,
    selectedModifiers: any[],
    extraPrice: number,
    notas: string
  ) => {
    const modsSignature = JSON.stringify(selectedModifiers.map((m: any) => m.id).sort());
    const itemSignature = `${prod.id}_${selectedVariant.id}_${modsSignature}`;
    dispatch(
      addToCart({
        ...prod,
        cartId: Math.random(),
        signature: itemSignature,
        idVariante: selectedVariant.id,
        varianteNombre: selectedVariant.nombre,
        precioTotal: (selectedVariant.precio || 0) + extraPrice,
        modificadores: selectedModifiers,
        cantidad: 1,
        notas,
      })
    );
    setModalProduct(null);
    addToast({ message: `${prod.nombre} agregado a la comanda`, variant: "success" });
  };

  const handlePedirCuenta = async () => {
    if (!selectedMesa) return;
    const estadoPorCobrar = estadosMesa.find((e: any) => (e.descripcion || "").toLowerCase().includes("cobrar"));
    if (!estadoPorCobrar) {
      addToast({
        message: 'No existe el estado "Por Cobrar" en Catálogos > Estados de Mesa. Pide a un Gerente que lo configure en /admin/catalogos/estados-mesa.',
        variant: "error",
      });
      return;
    }
    try {
      await updateMesa({ mesaDto: { ...selectedMesa, idEstadoMesa: estadoPorCobrar.id } }).unwrap();
      addToast({ message: `Cuenta solicitada para la mesa ${selectedMesa.codigo || selectedMesa.id}`, variant: "success" });
      refetchMesas();
      handleVolverAMesas();
    } catch {
      addToast({ message: "Error al solicitar la cuenta. Intenta de nuevo.", variant: "error" });
    }
  };

  const handleEnviarACocina = async () => {
    if (cart.length === 0) {
      addToast({ message: "Agrega al menos un platillo antes de enviar.", variant: "error" });
      return;
    }

    const defaultEstadoPedido = estadosPedido.find((e: any) => e.descripcion?.toLowerCase().includes("registrado"))?.id || 1;
    const defaultEstadoDetalle =
      estadosPedidoDetalle.find((e: any) => e.descripcion?.toLowerCase().includes("registrado") || e.descripcion?.toLowerCase().includes("pendiente"))?.id || 1;

    const detallesPayload = cart.map((item) => {
      const precioConIva = item.precioTotal || 0;
      const precioSinIva = precioConIva / factorIva;
      const montoImpuesto = precioConIva - precioSinIva;
      return {
        idProducto: item.id,
        idVariante: item.idVariante,
        productoNombre: item.nombre,
        varianteNombre: item.varianteNombre,
        cantidad: item.cantidad || 1,
        precioUnitario: precioConIva,
        idImpuesto: defaultIdImpuesto,
        tasaImpuesto: defaultTasaImpuesto,
        montoImpuesto,
        notas: item.notas,
        idEstadoPedidoDetalle: defaultEstadoDetalle,
        opcionesModificador: item.modificadores ? item.modificadores.map((m: any) => m.id) : [],
      };
    });

    try {
      if (modoRetomar && pedidoActivo) {
        const result = await agregarDetalles({ idPedido: pedidoActivo.id, detalles: detallesPayload }).unwrap();
        if (!result?.isSuccess) {
          addToast({ message: result?.message || "Error al enviar la comanda", variant: "error" });
          return;
        }
        addToast({ message: `Ítems agregados al Pedido #${pedidoActivo.id}`, variant: "success" });
      } else {
        const defaultIdSucursal = (sucursalesData as any)?.data?.[0]?.id || 1;
        const payload = {
          idEmpresa: profile.idEmpresa,
          idSucursal: selectedMesa?.idSucursal || defaultIdSucursal,
          idMesa: selectedMesa?.id || null,
          idTipoPedido: orderTypeComedor?.id ?? 1,
          idEstadoPedido: defaultEstadoPedido,
          personas: selectedMesa?.asientos || 1,
          cargoServicioPct: 0,
          idempotencyKey,
          // Spec 025, criterio de trazabilidad: el comandero móvil se identifica con su
          // propio canal de origen (distinto de "POS") para que KDS/reportes lo agrupen aparte.
          canalOrigen: "ComanderoMovil",
          detalles: detallesPayload,
        };
        const result = await insertarPedido({ crearPedidoRequestDto: payload as any }).unwrap();
        if (!(result as any).isSuccess) {
          addToast({ message: (result as any).message || "Error al enviar la comanda", variant: "error" });
          return;
        }
        const pedidoId = (result as any)?.data || "";
        addToast({ message: `¡Comanda #${pedidoId} enviada a cocina!`, variant: "success" });
      }

      // Feedback háptico (spec 025): degrada sin error en navegadores/dispositivos sin soporte (p.ej. iOS Safari).
      try {
        if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
          navigator.vibrate(50);
        }
      } catch {
        // Ignorado a propósito: la vibración es sólo feedback, nunca debe romper el flujo de envío.
      }

      dispatch(clearCart());
      setIdempotencyKey(generateUUID());
      refetchMesas();
      // Redirección automática al selector de mesas tras enviar con éxito.
      setSelectedMesa(null);
      setView("mesas");
    } catch (error: any) {
      if (error?.status === 409) {
        addToast({ message: "La mesa acaba de cambiar de estado. Vuelve a intentarlo.", variant: "error" });
        refetchMesas();
        setView("mesas");
        setSelectedMesa(null);
      } else {
        addToast({ message: error?.data?.message || "Error de conexión al enviar la comanda", variant: "error" });
      }
    }
  };

  return (
    <div className="comandero-root">
      <header className="comandero-header">
        {view === "menu" ? (
          <button type="button" className="comandero-btn-back" aria-label="Volver a mesas" onClick={handleVolverAMesas}>
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div style={{ width: 48 }} />
        )}
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1>{view === "mesas" ? "Comandero" : `Mesa ${selectedMesa?.codigo || selectedMesa?.id}`}</h1>
          <div className="comandero-header-sub">
            {view === "mesas" ? profile?.nombreCompleto || "Mesero" : `${itemCount} ítem${itemCount === 1 ? "" : "s"} · $${cartTotal.toFixed(2)}`}
          </div>
        </div>
        {view === "menu" ? (
          <button type="button" className="comandero-btn-pedir-cuenta" onClick={handlePedirCuenta} disabled={isPidiendoCuenta}>
            <ReceiptText size={16} />
            Cuenta
          </button>
        ) : (
          <div style={{ width: 48 }} />
        )}
      </header>

      <div className="comandero-body">
        {view === "mesas" ? (
          <ComanderoMesasGrid
            mesas={mesas}
            areas={areas}
            pedidosActivos={pedidosActivos}
            estadosMesa={estadosMesa}
            onSelectMesa={handleSelectMesa}
          />
        ) : (
          <>
            {modoRetomar && pedidoActivo?.detalles?.length > 0 && (
              <div className="comandero-en-cocina">
                <div className="comandero-en-cocina-titulo">En cocina (ya enviado)</div>
                {pedidoActivo.detalles
                  .filter((d: any) => !d.cancelado)
                  .map((d: any) => (
                    <div key={d.id} className="comandero-en-cocina-item">
                      <span>
                        <strong>{d.cantidad}x</strong> {d.productoNombre}
                        {d.varianteNombre && d.varianteNombre !== "Regular" ? ` (${d.varianteNombre})` : ""}
                      </span>
                      <span>${((d.precioUnitario || 0) * (d.cantidad || 1)).toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )}
            <ComanderoMenuBrowser categorias={categorias} productos={productos} onSelectProducto={handleSelectProducto} />
          </>
        )}
      </div>

      {view === "menu" && (
        <ComanderoStickyBar
          itemCount={itemCount}
          total={cartTotal}
          isSending={isInsertando || isAgregando}
          disabled={cart.length === 0}
          onEnviar={handleEnviarACocina}
        />
      )}

      <ComanderoModifierSheet
        isOpen={!!modalProduct}
        product={modalProduct}
        grupos={grupos.filter((g: any) => g.idProducto === modalProduct?.id && g.activo !== false)}
        opciones={opciones}
        onClose={() => setModalProduct(null)}
        onConfirm={handleConfirmAddToCart}
      />
    </div>
  );
}
