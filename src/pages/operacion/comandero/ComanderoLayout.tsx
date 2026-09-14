import { useMemo, useState, useEffect } from "react";
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
/**
 * Spec 019: Hook de resiliencia offline para Comandero Móvil.
 */
function useCachedFallback<T>(apiData: any, storageKey: string): T[] {
  const [cached, setCached] = useState<T[]>(() => {
    try {
      const val = localStorage.getItem(storageKey);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const list = Array.isArray(apiData?.data) ? apiData.data : (Array.isArray(apiData) ? apiData : null);
    if (list && list.length > 0) {
      setCached(list);
      try {
        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch {}
    }
  }, [apiData, storageKey]);

  const liveList = Array.isArray(apiData?.data) ? apiData.data : (Array.isArray(apiData) ? apiData : []);
  return liveList.length > 0 ? liveList : cached;
}

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

  const categorias = useCachedFallback<any>(catData, "mf_cache_categorias");
  const rawProductos = useCachedFallback<any>(prodData, "mf_cache_productos");
  const variantes = useCachedFallback<any>(varData, "mf_cache_variantes");
  const precios = useCachedFallback<any>(precioData, "mf_cache_precios");
  const grupos = useCachedFallback<any>(gruposData, "mf_cache_grupos");
  const opciones = useCachedFallback<any>(opcionesData, "mf_cache_opciones");
  const mesas = useCachedFallback<any>(mesasData, "mf_cache_mesas");
  const areas = useCachedFallback<any>(areasData, "mf_cache_areas");
  const pedidos = Array.isArray((pedidosData as any)?.data) ? (pedidosData as any).data : [];
  const estadosMesa = useCachedFallback<any>(catEstadosMesa, "mf_cache_estados_mesa");
  const estadosPedido = useCachedFallback<any>(catEstadosPedido, "mf_cache_estados_pedido");
  const estadosPedidoDetalle = useCachedFallback<any>(catEstadosPedidoDetalle, "mf_cache_estados_pedido_detalle");
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
    const estadoPorCobrar =
      estadosMesa.find((e: any) => (e.descripcion || "").toLowerCase().includes("cobrar")) ||
      estadosMesa.find((e: any) => (e.descripcion || "").toLowerCase().includes("cuenta")) ||
      { id: 91, descripcion: "Por Cobrar" };

    try {
      await updateMesa({ mesaDto: { ...selectedMesa, idEstadoMesa: estadoPorCobrar.id } }).unwrap();
      addToast({ message: `Cuenta solicitada para la mesa ${selectedMesa.codigo || selectedMesa.id}`, variant: "success" });
      refetchMesas();
      handleVolverAMesas();
    } catch {
      // Spec 019: Tolerancia a fallos en modo offline al pedir la cuenta
      try {
        const offlineRequests = JSON.parse(localStorage.getItem('mf_offline_cuenta_requests') || '[]');
        offlineRequests.push({ idMesa: selectedMesa.id, idEstadoMesa: estadoPorCobrar.id, requestedAt: new Date().toISOString() });
        localStorage.setItem('mf_offline_cuenta_requests', JSON.stringify(offlineRequests));
        addToast({ message: `Cuenta solicitada en modo local para la mesa ${selectedMesa.codigo || selectedMesa.id}`, variant: "info" });
        // Actualizar optimísticamente mesa en cache local
        const cachedMesas = JSON.parse(localStorage.getItem('mf_cache_mesas') || '[]');
        const updatedCached = cachedMesas.map((m: any) => m.id === selectedMesa.id ? { ...m, idEstadoMesa: estadoPorCobrar.id } : m);
        localStorage.setItem('mf_cache_mesas', JSON.stringify(updatedCached));
        refetchMesas();
        handleVolverAMesas();
      } catch {
        addToast({ message: "Error al solicitar la cuenta. Intenta de nuevo.", variant: "error" });
      }
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

    const defaultIdSucursal = (sucursalesData as any)?.data?.[0]?.id || 1;
    const fullOrderPayload = {
      idEmpresa: profile.idEmpresa,
      idSucursal: selectedMesa?.idSucursal || defaultIdSucursal,
      idMesa: selectedMesa?.id || null,
      idTipoPedido: orderTypeComedor?.id ?? 1,
      idEstadoPedido: defaultEstadoPedido,
      personas: selectedMesa?.asientos || 1,
      cargoServicioPct: 0,
      idempotencyKey,
      canalOrigen: "ComanderoMovil",
      detalles: detallesPayload,
    };

    try {
      if (modoRetomar && pedidoActivo) {
        const result = await agregarDetalles({ idPedido: pedidoActivo.id, detalles: detallesPayload }).unwrap();
        if (!result?.isSuccess) {
          addToast({ message: result?.message || "Error al enviar la comanda", variant: "error" });
          return;
        }
        addToast({ message: `Ítems agregados al Pedido #${pedidoActivo.id}`, variant: "success" });
      } else {
        const result = await insertarPedido({ crearPedidoRequestDto: fullOrderPayload as any }).unwrap();
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
        // Spec 019: Modo offline en Comandero Móvil — guardar comanda completa en cola local
        try {
          const offlineQueue = JSON.parse(localStorage.getItem('mf_offline_pending_orders') || '[]');
          const mesaCodigo = selectedMesa ? ` [Mesa ${selectedMesa.codigo || selectedMesa.id}]` : '';
          offlineQueue.push({
            ...fullOrderPayload,
            mesaCodigo: selectedMesa?.codigo || selectedMesa?.id,
            mesa: selectedMesa,
            itemsCount: cart.length,
            queuedAt: new Date().toISOString()
          });
          localStorage.setItem('mf_offline_pending_orders', JSON.stringify(offlineQueue));
          addToast({ message: `¡Comanda guardada en cola local${mesaCodigo}! Se enviará a cocina al reconectar.`, variant: 'info' });
          dispatch(clearCart());
          setIdempotencyKey(generateUUID());
          refetchMesas();
          setSelectedMesa(null);
          setView("mesas");
        } catch {
          addToast({ message: error?.data?.message || "Error de conexión al enviar la comanda", variant: "error" });
        }
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
