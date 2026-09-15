import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUserProfile, selectIdSucursal, selectNombreSucursal } from "../../../state/authSlice";
import { addToCart, updateQuantity, removeFromCart, clearCart, updateItemNote, selectCart } from "../../../state/cartSlice";
import { useToast } from "../../../components/ui/toast";
import { useConfirm } from "../../../components/ui/confirm-dialog";
import { generateUUID } from "../../../lib/uuid";
import "./pos.css";
import {
  useCategoriasGetAllQuery,
  useProductosGetAllQuery,
  usePedidosInsertConDetallesAsyncMutation,
  usePreciosGetAllQuery,
  useVarianteProductosGetAllQuery,
  useGrupoModificadoresGetAllQuery,
  useOpcionModificadoresGetAllQuery,
  useMesasGetAllQuery,
  useAreasGetAllQuery,
  useTiposPedidoGetAllQuery,
  useCatalogosGetAllQuery,
  useSucursalesGetAllQuery,
  useMesasUpdateAsyncMutation
} from "../../../services/generated/api";
import { ShoppingCart, User, LogOut, ChevronLeft, MapPin, Coins, FileText, X, AlertTriangle, Edit3, ArrowDownUp, Activity, DoorOpen, Building } from "lucide-react";
import { ProductModifiersModal } from "./ProductModifiersModal";
import { PaymentModal } from "./PaymentModal";
import { CorteCajaModal, useGetResumenCorteQuery } from "./CorteCajaModal";
import { MovimientoCajaModal } from "./MovimientoCajaModal";
import { CorteXModal } from "./CorteXModal";
import { AperturaTurnoModal } from "./AperturaTurnoModal";
import { ThermalTicketModal } from "./ThermalTicketModal";
import { emptySplitApi as api } from '../../../services/baseApi';
import { SupervisorPinModal } from "../../../components/seguridad/SupervisorPinModal";

// ─── POS-specific injected endpoints ────────────────────────────────────────
const posApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPedidoActivoByMesa: build.query<any, number>({
      query: (idMesa) => `/api/Pedidos/GetPedidoActivoByMesa/${idMesa}`,
      providesTags: ['Pedido']
    }),
    agregarDetalles: build.mutation<any, { idPedido: string; detalles: any[] }>({
      query: ({ idPedido, detalles }) => ({
        url: `/api/Pedidos/AgregarDetalles/${idPedido}`,
        method: 'POST',
        body: detalles
      }),
      invalidatesTags: ['Pedido', 'Mesa']
    }),
    cancelarDetalle: build.mutation<any, { idDetalle: string; motivo?: string }>({
      query: ({ idDetalle, motivo }) => ({
        url: `/api/Pedidos/CancelarDetalle/${idDetalle}${motivo ? `?motivo=${encodeURIComponent(motivo)}` : ''}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Pedido']
    }),
    // Spec 024, criterio de aceptación #1: cuando el PedidoDetalle ya fue enviado a cocina (tiene
    // un TicketDetalle asociado), el backend (WebApi/Modules/Endpoints/PedidoDetalleEndpoints.cs,
    // ruta DELETE /api/pedidodetalle/delete-async/{id}) exige el header "X-Authorization-Token"
    // con el JWT efímero de 60s emitido por /api/seguridad/autorizar-supervisor-pin. Sin ticket
    // asociado el mismo endpoint funciona igual que un borrado normal (sin header).
    cancelarDetalleProtegido: build.mutation<any, { idDetalle: string; motivo?: string; tokenAutorizacion: string }>({
      query: ({ idDetalle, motivo, tokenAutorizacion }) => ({
        url: `/api/pedidodetalle/delete-async/${idDetalle}${motivo ? `?motivo=${encodeURIComponent(motivo)}` : ''}`,
        method: 'DELETE',
        headers: { 'X-Authorization-Token': tokenAutorizacion }
      }),
      invalidatesTags: ['Pedido', 'PedidoDetalle', 'TicketCocina', 'TicketDetalle']
    })
  })
});

const {
  useGetPedidoActivoByMesaQuery,
  useAgregarDetallesMutation,
  useCancelarDetalleProtegidoMutation
} = posApi;

/**
 * Spec 019: Hook de resiliencia offline. Guarda en localStorage los catálogos
 * recibidos en línea y los devuelve de respaldo cuando se opera desconectado.
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

export default function PosPage() {
  const profile = useSelector(selectUserProfile);
  const confirm = useConfirm();
  const [insertarPedido, { isLoading }] = usePedidosInsertConDetallesAsyncMutation();
  const { data: catData } = useCategoriasGetAllQuery();
  const { data: prodData } = useProductosGetAllQuery();
  const { data: varData } = useVarianteProductosGetAllQuery();
  const { data: precioData } = usePreciosGetAllQuery();
  const { data: gruposData } = useGrupoModificadoresGetAllQuery();
  const { data: opcionesData } = useOpcionModificadoresGetAllQuery();
  const { data: catTiposData } = useTiposPedidoGetAllQuery();
  const { data: mesasData, refetch: refetchMesas } = useMesasGetAllQuery();
  const { data: areasData } = useAreasGetAllQuery();
  const [updateMesa] = useMesasUpdateAsyncMutation();
  
  const { data: catEstadosMesa } = useCatalogosGetAllQuery({ catalog: 'estados-mesa' });
  const { data: catEstadosPedido } = useCatalogosGetAllQuery({ catalog: 'estados-pedido' });
  const { data: catEstadosPedidoDetalle } = useCatalogosGetAllQuery({ catalog: 'estados-pedido-detalle' });
  const { data: catImpuestos } = useCatalogosGetAllQuery({ catalog: 'impuestos' });
  const { data: catCanalesData } = useCatalogosGetAllQuery({ catalog: 'canales-venta' });
  const { data: sucursalesData } = useSucursalesGetAllQuery();
  
  // For Mesa selection
  const [selectedMesa, setSelectedMesa] = useState<any>(null);
  const [showMesaSelector, setShowMesaSelector] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [orderType, setOrderType] = useState<number>(1); // Comedor default

  // ─── Retomar Pedido ───────────────────────────────────────────────────────
  const [pedidoActivo, setPedidoActivo] = useState<any>(null);
  const [modoRetomar, setModoRetomar] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [skipPedidoQuery, setSkipPedidoQuery] = useState(true);
  const [paymentPedidoId, setPaymentPedidoId] = useState<string | null>(null);
  const [showCorteModal, setShowCorteModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showCorteXModal, setShowCorteXModal] = useState(false);
  const [showAperturaModal, setShowAperturaModal] = useState(false);
  const [showPrecuentaModal, setShowPrecuentaModal] = useState(false);

  const authSucursalId = useSelector(selectIdSucursal);
  const authNombreSucursal = useSelector(selectNombreSucursal);
  const sucursalesList = Array.isArray((sucursalesData as any)?.data) ? (sucursalesData as any).data : [];
  const activeSucursalId = authSucursalId || profile?.idSucursal || selectedMesa?.idSucursal || sucursalesList[0]?.id || 2;
  const activeNombreSucursal = authNombreSucursal || profile?.nombreSucursal || sucursalesList.find((s: any) => s.id === activeSucursalId)?.nombre || `Sucursal #${activeSucursalId}`;

  const { data: resumenTurnoData } = useGetResumenCorteQuery({ idSucursal: activeSucursalId });
  const tieneTurnoActivo = !!resumenTurnoData?.data?.idTurno;

  const { data: pedidoActivoData, isFetching: isFetchingPedido } = useGetPedidoActivoByMesaQuery(
    selectedMesa?.id ?? 0,
    { skip: skipPedidoQuery || !selectedMesa?.id }
  );
  const [agregarDetalles, { isLoading: isLoadingAgregar }] = useAgregarDetallesMutation();
  const [cancelarDetalleProtegido] = useCancelarDetalleProtegidoMutation();

  // ─── Spec 024: Candado de Supervisor para cancelación de platillos en cocina ───────────────
  const [pinModalCancelacion, setPinModalCancelacion] = useState<{ idPedido: string; idDetalle: string; productoNombre: string } | null>(null);

  
  const rawOrderTypes = Array.isArray((catTiposData as any)?.data) ? (catTiposData as any).data : [];
  const orderTypes = rawOrderTypes
    .filter((t: any) => t.isActive !== false)
    .map((t: any) => ({ id: t.id, label: t.descripcion, isComedor: t.isComedor }));
    
  const isComedor = orderTypes.find((t: any) => t.id === orderType)?.isComedor || false;
  const isDelivery = orderTypes.find((t: any) => t.id === orderType)?.label?.toLowerCase().includes('delivery') || false;

  // Estados para datos de Delivery y Mostrador
  const [deliveryCanal, setDeliveryCanal] = useState<string>('Delivery Propio');
  const [deliveryCliente, setDeliveryCliente] = useState<string>('');
  const [deliveryTelefono, setDeliveryTelefono] = useState<string>('');
  const [deliveryDireccion, setDeliveryDireccion] = useState<string>('');
  const [deliveryIdExterno, setDeliveryIdExterno] = useState<string>('');

  const rawCanales = Array.isArray((catCanalesData as any)?.data) ? (catCanalesData as any).data : [];
  const canalesDelivery = rawCanales.filter((c: any) => c.esDelivery && c.isActive !== false);
  const canalesOpciones = canalesDelivery.length > 0
    ? canalesDelivery
    : [
        { id: 1, descripcion: 'Delivery Propio' },
        { id: 2, descripcion: 'Uber Eats' },
        { id: 3, descripcion: 'Rappi' },
        { id: 4, descripcion: 'Didi Food' },
      ];

  const categorias = useCachedFallback<any>(catData, "mf_cache_categorias");
  const rawProductos = useCachedFallback<any>(prodData, "mf_cache_productos");
  const variantes = useCachedFallback<any>(varData, "mf_cache_variantes");
  const precios = useCachedFallback<any>(precioData, "mf_cache_precios");
  const grupos = useCachedFallback<any>(gruposData, "mf_cache_grupos");
  const opciones = useCachedFallback<any>(opcionesData, "mf_cache_opciones");
  const mesas = useCachedFallback<any>(mesasData, "mf_cache_mesas");
  const areas = useCachedFallback<any>(areasData, "mf_cache_areas");

  const branchMesas = activeSucursalId
    ? mesas.filter((m: any) => !m.idSucursal || m.idSucursal === activeSucursalId)
    : mesas;

  const filteredMesas = selectedAreaId 
    ? branchMesas.filter((m: any) => m.idArea === selectedAreaId) 
    : branchMesas;

  const estadosMesa = Array.isArray((catEstadosMesa as any)?.data) ? (catEstadosMesa as any).data : [];
  const estadosPedido = Array.isArray((catEstadosPedido as any)?.data) ? (catEstadosPedido as any).data : [];
  const estadosPedidoDetalle = Array.isArray((catEstadosPedidoDetalle as any)?.data) ? (catEstadosPedidoDetalle as any).data : [];

  const getEstadoMesaLabel = (idEstadoMesa: number) => {
    const estado = estadosMesa.find((e: any) => e.id === idEstadoMesa);
    if (!estado) return { text: "Desconocido", color: "var(--color-text-muted, #94a3b8)" };
    
    const desc = estado.descripcion.toLowerCase();
    let color = "var(--color-text-muted, #94a3b8)";
    if (desc.includes("disponible")) color = "var(--color-success, #10b981)";
    if (desc.includes("ocupada")) color = "var(--color-error, #ef4444)";
    if (desc.includes("reservada")) color = "var(--color-warning, #f59e0b)";
    if (desc.includes("sucia")) color = "#f97316";

    return { text: estado.descripcion, color };
  };

  // Group variants by product instead of flattening
  const productos = rawProductos.map((p: any) => {
    const productVariantes = variantes.filter((v: any) => v.idProducto === p.id);
    return {
      ...p,
      variantes: productVariantes.length > 0 ? productVariantes.map((v: any) => {
        const precioObj = precios.find((pr: any) => pr.idVariante === v.id);
        return { ...v, precio: precioObj ? precioObj.monto : 0 };
      }) : [{ id: 0, nombre: "Regular", precio: 0 }]
    };
  });

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => generateUUID());
  const { addToast } = useToast();

  // ─── Efectos: Retomar Pedido ──────────────────────────────────────────────
  useEffect(() => {
    if (selectedMesa?.id) {
      const statusLabel = getEstadoMesaLabel(selectedMesa.idEstadoMesa || 1);
      const isOcupada = statusLabel.text.toLowerCase().includes('ocupada');
      if (isOcupada) {
        setSkipPedidoQuery(false);
      } else {
        setSkipPedidoQuery(true);
        setPedidoActivo(null);
        setModoRetomar(false);
      }
    } else {
      setSkipPedidoQuery(true);
      setPedidoActivo(null);
      setModoRetomar(false);
    }
  }, [selectedMesa]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (pedidoActivoData?.isSuccess && pedidoActivoData?.data) {
      setPedidoActivo(pedidoActivoData.data);
    }
  }, [pedidoActivoData]);

  const filteredProducts = selectedCategory
    ? productos.filter((p: any) => p.idCategoria === selectedCategory)
    : productos;

  const handleAddToCart = (prod: any) => {
    const productGroups = grupos.filter((g: any) => g.idProducto === prod.id && g.activo !== false);

    // Always show modal if it has variants (>1) or has modifiers
    if (prod.variantes.length > 1 || productGroups.length > 0) {
      setModalProduct(prod);
    } else {
      const singleVariant = prod.variantes[0];
      handleConfirmAddToCart(prod, singleVariant, [], 0);
    }
  };

  const handleConfirmAddToCart = (prod: any, selectedVariant: any, selectedModifiers: any[], extraPrice: number, notas: string = "") => {
    const modsSignature = JSON.stringify(selectedModifiers.map((m: any) => m.id).sort());
    const itemSignature = `${prod.id}_${selectedVariant.id}_${modsSignature}`;

    dispatch(addToCart({
      ...prod,
      cartId: Math.random(),
      signature: itemSignature,
      idVariante: selectedVariant.id,
      varianteNombre: selectedVariant.nombre,
      precioTotal: (selectedVariant.precio || 0) + extraPrice,
      modificadores: selectedModifiers,
      cantidad: 1,
      notas: notas
    }));
    setModalProduct(null);
    addToast({ message: `${prod.nombre} agregado al pedido`, variant: "success" });
  };

  const handleUpdateQuantity = (cartId: number, delta: number) => {
    dispatch(updateQuantity({ cartId, delta }));
  };

  const handleRemoveFromCart = (cartId: number) => {
    dispatch(removeFromCart(cartId));
  };

  const impuestos = Array.isArray((catImpuestos as any)?.data) ? (catImpuestos as any).data : [];
  const defaultImpuesto = impuestos.find((i: any) => i.descripcion.toLowerCase().includes('iva')) || impuestos[0] || { id: 1, descripcion: 'IVA 16%' };
  const tasaImpuestoMatch = defaultImpuesto.descripcion.match(/\d+(\.\d+)?/);
  const defaultTasaImpuesto = tasaImpuestoMatch ? parseFloat(tasaImpuestoMatch[0]) : 16;
  const defaultIdImpuesto = defaultImpuesto.id;
  const tasaDecimal = defaultTasaImpuesto / 100;
  const factorIva = 1 + tasaDecimal;

  const handleEnviarPedido = async () => {
    if (isComedor && !selectedMesa) {
      addToast({ 
        message: 'Por favor asigna una mesa para consumo en comedor.', 
        variant: 'error' 
      });
      setShowMesaSelector(true);
      return;
    }
    if (cart.length === 0) {
      addToast({ message: 'El carrito está vacío. Agrega productos al pedido.', variant: 'error' });
      return;
    }

    const defaultEstadoPedido = estadosPedido.find((e: any) => e.descripcion.toLowerCase().includes('registrado'))?.id || 1;
    const defaultEstadoDetalle = estadosPedidoDetalle.find((e: any) => e.descripcion.toLowerCase().includes('registrado') || e.descripcion.toLowerCase().includes('pendiente'))?.id || 1;

    const detallesPayload = cart.map(item => {
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
        montoImpuesto: montoImpuesto,
        notas: item.notas,
        idEstadoPedidoDetalle: defaultEstadoDetalle,
        opcionesModificador: item.modificadores ? item.modificadores.map((m: any) => m.id) : []
      };
    });

    try {
      if (modoRetomar && pedidoActivo) {
        // FLUJO 2: Agregar a pedido existente
        const result = await agregarDetalles({ idPedido: pedidoActivo.id, detalles: detallesPayload }).unwrap();
        if (result?.isSuccess) {
          addToast({ message: `Ítems agregados al Pedido #${pedidoActivo.id}`, variant: 'success' });
          dispatch(clearCart());
          setIdempotencyKey(generateUUID());
        } else {
          addToast({ message: result?.message || 'Error al agregar ítems', variant: 'error' });
        }
      } else {
        const defaultIdSucursal = activeSucursalId;

        const fullOrderPayload = {
          idEmpresa: profile.idEmpresa,
          idSucursal: selectedMesa?.idSucursal || defaultIdSucursal,
          idMesa: isComedor ? (selectedMesa?.id || null) : null,
          idTipoPedido: orderType,
          idEstadoPedido: defaultEstadoPedido,
          personas: isComedor ? (selectedMesa?.asientos || 1) : 1,
          cargoServicioPct: 0,
          idempotencyKey: idempotencyKey,
          canalOrigen: isComedor ? "POS" : (isDelivery ? deliveryCanal : "POS"),
          idExterno: isDelivery && deliveryIdExterno ? deliveryIdExterno.trim() : null,
          nombreClienteDelivery: !isComedor && deliveryCliente ? deliveryCliente.trim() : null,
          telefonoDelivery: !isComedor && deliveryTelefono ? deliveryTelefono.trim() : null,
          direccionEntrega: isDelivery && deliveryDireccion ? deliveryDireccion.trim() : null,
          detalles: detallesPayload
        };
        const result = await insertarPedido({ crearPedidoRequestDto: fullOrderPayload as any }).unwrap();
        if ((result as any).isSuccess) {
          const pedidoId = (result as any)?.data || '';
          const mesaInfo = isComedor && selectedMesa ? ` [Mesa ${selectedMesa.codigo}]` : '';
          addToast({ message: `¡Pedido #${pedidoId}${mesaInfo} enviado a cocina!`, variant: 'success' });
          dispatch(clearCart());
          setMobileCartOpen(false);
          setIdempotencyKey(generateUUID());
          setDeliveryCliente('');
          setDeliveryTelefono('');
          setDeliveryDireccion('');
          setDeliveryIdExterno('');
        } else {
          addToast({ message: (result as any).message || 'Error al enviar el pedido', variant: 'error' });
        }
      }
    } catch (error: any) {
      if (error?.status === 409) {
        const errorMsg = error?.data?.message || 'La mesa seleccionada acaba de ser ocupada por otro pedido.';
        addToast({ 
          message: `${errorMsg} Por favor selecciona otra mesa disponible.`, 
          variant: 'error' 
        });
        setSelectedMesa(null);
        refetchMesas();
      } else {
        // Spec 019: Manejo offline resiliente para pedidos cuando se interrumpe la red
        try {
          const offlineQueue = JSON.parse(localStorage.getItem('mf_offline_pending_orders') || '[]');
          const mesaCodigo = isComedor && selectedMesa ? ` [Mesa ${selectedMesa.codigo || selectedMesa.id}]` : '';
          const defaultIdSucursal = activeSucursalId;
          offlineQueue.push({
            idEmpresa: profile.idEmpresa,
            idSucursal: selectedMesa?.idSucursal || defaultIdSucursal,
            idMesa: isComedor ? (selectedMesa?.id || null) : null,
            idTipoPedido: orderType,
            idEstadoPedido: defaultEstadoPedido,
            personas: isComedor ? (selectedMesa?.asientos || 1) : 1,
            cargoServicioPct: 0,
            idempotencyKey: idempotencyKey,
            canalOrigen: isComedor ? "POS" : (isDelivery ? deliveryCanal : "POS"),
            idExterno: isDelivery && deliveryIdExterno ? deliveryIdExterno.trim() : null,
            nombreClienteDelivery: !isComedor && deliveryCliente ? deliveryCliente.trim() : null,
            telefonoDelivery: !isComedor && deliveryTelefono ? deliveryTelefono.trim() : null,
            direccionEntrega: isDelivery && deliveryDireccion ? deliveryDireccion.trim() : null,
            detalles: detallesPayload,
            mesaCodigo: selectedMesa?.codigo || selectedMesa?.id,
            mesa: selectedMesa,
            itemsCount: cart.length,
            total: cartTotal,
            queuedAt: new Date().toISOString()
          });
          localStorage.setItem('mf_offline_pending_orders', JSON.stringify(offlineQueue));
          addToast({ message: `¡Pedido guardado en cola local${mesaCodigo}! Se sincronizará automáticamente.`, variant: 'info' });
          dispatch(clearCart());
          setMobileCartOpen(false);
          setIdempotencyKey(generateUUID());
          setDeliveryCliente('');
          setDeliveryTelefono('');
          setDeliveryDireccion('');
          setDeliveryIdExterno('');
        } catch {
          addToast({ message: error?.data?.message || 'Error de conexión al enviar el pedido', variant: 'error' });
        }
      }
    }
  };


  const cartTotal = cart.reduce((acc, curr) => acc + ((curr.precioTotal || 0) * (curr.cantidad || 1)), 0);
  const subtotal = cartTotal / factorIva;
  const iva = cartTotal - subtotal;

  return (
    <div className="pos-layout">
      {/* Top Header */}
      <header className="pos-header">
        <div className="pos-header-left">
          <Link to="/" className="pos-back-button">
            <ChevronLeft size={24} />
            <span>Volver</span>
          </Link>
          <div className="pos-brand">
            <h2>MesaFácil POS</h2>
            {isComedor && (
              <button 
                onClick={() => setShowMesaSelector(true)}
                className={`pos-assign-mesa-btn ${selectedMesa ? "selected" : ""}`}
              >
                <MapPin size={20} color={selectedMesa ? "#3b82f6" : "#ffffff"} />
                {selectedMesa ? `Mesa: ${selectedMesa.codigo || selectedMesa.id} (${selectedMesa.asientos} pax)` : "Asignar Mesa"}
              </button>
            )}
          </div>
        </div>
        <div className="pos-header-right">
          {!tieneTurnoActivo ? (
            <button
              onClick={() => setShowAperturaModal(true)}
              className="pos-header-btn-caja pos-header-btn-apertura"
              title="Abrir turno de caja"
            >
              <DoorOpen size={16} />
              <span className="pos-btn-text">Abrir Turno</span>
            </button>
          ) : (
            <div className="pos-caja-actions-group">
              <button 
                onClick={() => setShowCorteXModal(true)}
                title="Corte X: Arqueo parcial en vivo sin cerrar turno"
                className="pos-header-btn-caja pos-btn-cortex"
              >
                <Activity size={16} />
                <span className="pos-btn-text">Corte X</span>
              </button>
              <button 
                onClick={() => setShowMovimientoModal(true)}
                title="Movimiento: Registrar entrada o salida de efectivo"
                className="pos-header-btn-caja pos-btn-mov"
              >
                <ArrowDownUp size={16} />
                <span className="pos-btn-text">Movimiento</span>
              </button>
              <button 
                onClick={() => setShowCorteModal(true)}
                title="Cierre de Turno: Cerrar turno y arquear caja"
                className="pos-header-btn-caja pos-btn-cierre"
              >
                <Coins size={16} />
                <span className="pos-btn-text">Cerrar Turno</span>
              </button>
            </div>
          )}
          <div className="pos-user-info">
            <User size={20} />
            <span>{profile?.nombreCompleto || profile?.correo || 'Usuario'}</span>
          </div>
          <div className="pos-branch-badge" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#2563eb',
            fontWeight: 600
          }} title={`Sucursal activa asignada: ${activeNombreSucursal}`}>
            <Building size={16} />
            <span>{activeNombreSucursal}</span>
          </div>
          <button className="pos-btn-icon">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {!tieneTurnoActivo && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fffbeb',
          borderBottom: '2px solid #f59e0b',
          padding: '10px 24px',
          color: '#92400e',
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <span>
              <strong>Atención:</strong> No hay un turno ni corte de caja abierto para <strong>{activeNombreSucursal}</strong>. Abre tu turno antes de cobrar o registrar pedidos para que el arqueo registre los fondos correctamente.
            </span>
          </div>
          <button
            onClick={() => setShowAperturaModal(true)}
            style={{
              background: '#d97706',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 16px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          >
            <DoorOpen size={16} />
            <span>Abrir Turno Ahora</span>
          </button>
        </div>
      )}

      <div className="pos-main">
        {/* Main Content: Categories & Products */}
        <div className="pos-catalog">
          {/* Categories */}
          <div className="pos-categories">
            <button
              className={`pos-category-btn ${selectedCategory === null ? "active" : ""}`}
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </button>
            {categorias.map((cat: any) => (
              <button
                key={cat.id}
                className={`pos-category-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="pos-products-grid">
            {filteredProducts.length === 0 ? (
              <div className="pos-empty-state">No hay productos disponibles</div>
            ) : (
              filteredProducts.map((prod: any) => {
                const defaultPrice = prod.variantes[0]?.precio || 0;
                return (
                  <button
                    key={prod.id}
                    className="pos-product-card"
                    onClick={() => handleAddToCart(prod)}
                  >
                    <div className="pos-product-image">
                      {/* Placeholder image */}
                    </div>
                    <div className="pos-product-info">
                      <h4>{prod.nombre}</h4>
                      <p className="pos-product-price">
                        {prod.variantes.length > 1 ? `Desde $${defaultPrice.toFixed(2)}` : `$${defaultPrice.toFixed(2)}`}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar: Order Summary (Cart) */}
        <aside className={`pos-cart-sidebar ${mobileCartOpen ? "is-mobile-open" : ""}`}>
          <div className="pos-cart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="pos-cart-close-mobile"
                onClick={() => setMobileCartOpen(false)}
                aria-label="Volver al catálogo"
                title="Volver al catálogo"
              >
                <ChevronLeft size={20} />
              </button>
              <h3>Pedido Actual</h3>
            </div>
            <span className="pos-cart-count">{cart.length} items</span>
          </div>

          {/* Banner: Pedido Activo */}
          {pedidoActivo && (
            <div style={{
              margin: '0 0 12px 0',
              padding: '10px 14px',
              borderRadius: '10px',
              background: modoRetomar ? 'rgba(59,130,246,0.12)' : 'rgba(233,185,73,0.12)',
              border: `1px solid ${modoRetomar ? '#3b82f6' : '#e9b949'}`,
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, color: modoRetomar ? '#3b82f6' : '#b45309', display: 'flex', alignItems: 'center', gap: 6 }}>
                {modoRetomar ? (
                  <>
                    <Edit3 size={15} />
                    <span>Modo: Agregar a Pedido Activo</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={15} />
                    <span>Mesa con Pedido Activo</span>
                  </>
                )}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: 6 }}>
                {isFetchingPedido
                  ? 'Cargando pedido...'
                  : `Pedido #${pedidoActivo.id} · ${pedidoActivo.detalles?.filter((d: any) => !d.cancelado).length || 0} ítems activos`
                }
              </div>
              {!modoRetomar ? (
                <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                  <button
                    onClick={() => setModoRetomar(true)}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => setShowPrecuentaModal(true)}
                    style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    title="Imprimir o ver pre-cuenta con propinas sugeridas"
                  >
                    <FileText size={13} />
                    Pre-cuenta
                  </button>
                  <button
                    onClick={() => setPaymentPedidoId(pedidoActivo.id)}
                    style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
                  >
                    Cobrar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setModoRetomar(false); dispatch(clearCart()); }}
                  style={{ background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', width: '100%' }}
                >
                  Cancelar (crear pedido nuevo)
                </button>
              )}
            </div>
          )}

          <div className="pos-order-type-container">
            <label className="pos-order-type-label">Tipo de Pedido</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(Number(e.target.value))}
              className="pos-order-type-select"
            >
              {orderTypes.map((t: any) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>

          {!isComedor && (
            <div style={{
              margin: '0 0 12px 0',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'var(--color-surface-hover, #f8fafc)',
              border: '1px solid var(--color-border, #e2e8f0)',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text, #1e293b)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                {isDelivery ? '🛵 Datos de Delivery' : '🛍️ Datos de Entrega en Mostrador'}
              </div>

              {isDelivery && (
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: 2 }}>
                    Canal / Plataforma
                  </label>
                  <select
                    value={deliveryCanal}
                    onChange={(e) => setDeliveryCanal(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#fff' }}
                  >
                    {canalesOpciones.map((c: any) => (
                      <option key={c.id} value={c.descripcion}>
                        {c.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: 2 }}>
                    {isDelivery ? 'Cliente' : 'Nombre comensal'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={deliveryCliente}
                    onChange={(e) => setDeliveryCliente(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div style={{ width: '100px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: 2 }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="Opcional"
                    value={deliveryTelefono}
                    onChange={(e) => setDeliveryTelefono(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
              </div>

              {isDelivery && deliveryCanal === 'Delivery Propio' && (
                <div style={{ marginBottom: 4 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: 2 }}>
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    placeholder="Calle, Número, Colonia..."
                    value={deliveryDireccion}
                    onChange={(e) => setDeliveryDireccion(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
              )}

              {isDelivery && deliveryCanal !== 'Delivery Propio' && (
                <div style={{ marginBottom: 4 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: 2 }}>
                    ID / Folio en App
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. #UE-84920"
                    value={deliveryIdExterno}
                    onChange={(e) => setDeliveryIdExterno(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="pos-cart-items">
            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                <ShoppingCart size={48} opacity={0.2} />
                <p>El pedido está vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="pos-cart-item">
                  <div className="pos-cart-item-details" style={{ flex: 1 }}>
                    <span className="pos-cart-item-name">{item.nombre} <small>({item.varianteNombre})</small></span>
                    <span className="pos-cart-item-price">${((item.precioTotal || 0) * (item.cantidad || 1)).toFixed(2)}</span>
                    {item.modificadores && item.modificadores.length > 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {item.modificadores.map((m: any) => m.nombre).join(", ")}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Nota para cocina..."
                      defaultValue={item.notas || ""}
                      onBlur={(e) => dispatch(updateItemNote({ cartId: item.cartId, newNotas: e.target.value }))}
                      style={{
                        marginTop: '4px',
                        padding: '4px 8px',
                        fontSize: '0.8rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        width: '100%',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-background)', borderRadius: '16px', padding: '2px' }}>
                      <button 
                        onClick={() => handleUpdateQuantity(item.cartId, -1)}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >-</button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', minWidth: '16px', textAlign: 'center' }}>{item.cantidad || 1}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.cartId, 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>
                    <button
                      className="pos-cart-item-remove"
                      onClick={() => handleRemoveFromCart(item.cartId)}
                      style={{ alignSelf: 'flex-end', fontSize: '0.8rem', padding: '4px 8px' }}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Ítems del pedido activo existente (en cocina) */}
            {modoRetomar && pedidoActivo?.detalles?.length > 0 && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  En cocina
                </div>
                {pedidoActivo.detalles.map((d: any) => (
                  <div key={d.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '5px 0',
                    opacity: d.cancelado ? 0.4 : 1,
                    textDecoration: d.cancelado ? 'line-through' : 'none',
                    fontSize: '13px',
                    borderBottom: '1px solid var(--color-border)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>{d.cantidad}x</span> {d.productoNombre}
                      {d.varianteNombre && d.varianteNombre !== 'Regular' && <small style={{ color: 'var(--color-text-muted)' }}> ({d.varianteNombre})</small>}
                      {d.notas && <div style={{ fontSize: '11px', color: '#f59e0b' }}>Nota: {d.notas}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>${((d.precioUnitario || 0) * (d.cantidad || 1)).toFixed(2)}</span>
                      {!d.cancelado && (
                        <button
                          onClick={async () => {
                            // Spec 024, Flujo 1: todo ítem en esta lista ("En cocina") ya fue
                            // persistido y AgregarDetalles/InsertConDetalles ya le generó un
                            // TicketDetalle (comanda enviada a cocina) — por lo tanto SIEMPRE
                            // requiere el candado de PIN de supervisor antes de poder cancelarse
                            // (a diferencia de los ítems locales del carrito aún no enviados, que
                            // se quitan sin PIN vía handleRemoveFromCart, sin llamada al backend).
                            const ok = await confirm({
                              title: "¿Cancelar platillo enviado a cocina?",
                              message: `"${d.productoNombre}" ya fue enviado a cocina. Se requerirá el PIN de un supervisor para cancelarlo.`,
                              confirmLabel: "Continuar",
                              variant: "danger"
                            });
                            if (ok) {
                              setPinModalCancelacion({ idPedido: pedidoActivo.id, idDetalle: d.id, productoNombre: d.productoNombre });
                            }
                          }}
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '4px', padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pos-cart-footer">
            <div className="pos-cart-summary">
              <div className="pos-summary-row">
                <span>Subtotal (Sin IVA)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="pos-summary-row">
                <span>IVA ({defaultTasaImpuesto}%)</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="pos-summary-row pos-total-row">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="pos-btn-checkout"
              disabled={cart.length === 0 || isLoading || isLoadingAgregar}
              onClick={handleEnviarPedido}
            >
              {isLoading || isLoadingAgregar ? (modoRetomar ? 'Agregando...' : 'Enviando...') : (modoRetomar ? '+ Agregar al Pedido' : 'Enviar Pedido')}
            </button>
          </div>
        </aside>

      </div>

      {/* Floating mobile cart bar */}
      <div 
        className={`pos-mobile-cart-bar ${cart.length > 0 ? "has-items" : ""}`}
        onClick={() => setMobileCartOpen(true)}
        role="button"
        tabIndex={0}
      >
        <div className="pos-mobile-cart-bar-left">
          <div className="pos-mobile-cart-badge">
            <ShoppingCart size={18} />
            <span>{cart.reduce((acc, curr) => acc + (curr.cantidad || 1), 0)}</span>
          </div>
          <div className="pos-mobile-cart-pricing">
            <span className="pos-mobile-cart-label">Ver Pedido</span>
            <span className="pos-mobile-cart-total">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button type="button" className="pos-mobile-cart-btn-view">
          Continuar →
        </button>
      </div>

      <ProductModifiersModal
        isOpen={!!modalProduct}
        product={modalProduct}
        grupos={grupos.filter((g: any) => g.idProducto === modalProduct?.id && g.activo !== false)}
        opciones={opciones}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleConfirmAddToCart}
      />

      <PaymentModal 
        isOpen={!!paymentPedidoId}
        idPedido={paymentPedidoId}
        onClose={() => setPaymentPedidoId(null)}
        onPaymentSuccess={() => {
          setPaymentPedidoId(null);
          setSelectedMesa(null);
          setPedidoActivo(null);
        }}
      />

      {/* Spec 024: Candado de Supervisor para cancelar platillos ya enviados a cocina */}
      <SupervisorPinModal
        isOpen={!!pinModalCancelacion}
        onClose={() => setPinModalCancelacion(null)}
        accionProtegida="CancelarPlatilloCocina"
        idPedido={pinModalCancelacion?.idPedido ?? ''}
        idPedidoDetalle={pinModalCancelacion?.idDetalle ?? null}
        titulo="Cancelar Platillo en Cocina"
        descripcion={pinModalCancelacion ? `"${pinModalCancelacion.productoNombre}" ya fue enviado a cocina` : undefined}
        onAutorizado={async (tokenAutorizacion, motivo) => {
          if (!pinModalCancelacion) return;
          const { idDetalle, productoNombre } = pinModalCancelacion;
          try {
            await cancelarDetalleProtegido({ idDetalle, motivo, tokenAutorizacion }).unwrap();
            setPedidoActivo((prev: any) => ({
              ...prev,
              detalles: prev.detalles.map((item: any) =>
                item.id === idDetalle ? { ...item, cancelado: true, motivoCancelacion: motivo } : item
              )
            }));
            addToast({ message: `"${productoNombre}" cancelado con autorización de supervisor`, variant: 'success' });
          } catch {
            addToast({ message: 'Error al cancelar el platillo (token expirado o rechazado por el servidor)', variant: 'error' });
          } finally {
            setPinModalCancelacion(null);
          }
        }}
      />

      <ThermalTicketModal
        isOpen={showPrecuentaModal}
        onClose={() => setShowPrecuentaModal(false)}
        idPedido={pedidoActivo?.id ?? null}
        tipo="pre-cuenta"
      />

      {/* Inline Mesa Selector Modal using Real Data */}
      {showMesaSelector && (
        <div className="pos-modal-overlay">
          <div className="pos-modal-content" style={{ maxWidth: 860, width: '95%', maxHeight: '90dvh', display: 'flex', flexDirection: 'column', padding: 0, background: '#f8fafc', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ background: '#ffffff', padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'var(--color-primary-light, #dbeafe)', padding: 8, borderRadius: 10 }}>
                  <MapPin size={22} color="var(--color-primary, #3b82f6)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Selección de Mesa</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', marginTop: 2 }}>Asigna el pedido a una ubicación específica</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMesaSelector(false)}
                style={{ background: '#f1f5f9', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>
            
            <div style={{ padding: '14px 20px', overflowY: 'auto', flex: 1, minHeight: 0, WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 14, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                <button
                  style={{
                    padding: '8px 18px',
                    borderRadius: 30,
                    border: 'none',
                    background: selectedAreaId === null ? 'var(--color-primary, #3b82f6)' : '#ffffff',
                    color: selectedAreaId === null ? '#ffffff' : '#475569',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    boxShadow: selectedAreaId === null ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onClick={() => setSelectedAreaId(null)}
                >
                  Todas las Áreas
                </button>
                {areas.map((area: any) => (
                  <button
                    key={area.id}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 30,
                      border: 'none',
                      background: selectedAreaId === area.id ? 'var(--color-primary, #3b82f6)' : '#ffffff',
                      color: selectedAreaId === area.id ? '#ffffff' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      boxShadow: selectedAreaId === area.id ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                    onClick={() => setSelectedAreaId(area.id)}
                  >
                    {area.descripcion || area.nombre || `Área ${area.id}`}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12, paddingRight: 4 }}>
                {filteredMesas.map((mesa: any) => {
                  const status = getEstadoMesaLabel(mesa.idEstadoMesa || 1);
                  const isSelected = selectedMesa?.id === mesa.id;
                  const isOcupada = status.text.toLowerCase().includes("ocupada");
                  return (
                    <button
                      key={mesa.id}
                      style={{ 
                        padding: 24, 
                        border: isSelected ? '2px solid var(--color-primary, #3b82f6)' : '1px solid transparent',
                        background: isSelected ? 'var(--color-primary-light, #eff6ff)' : (isOcupada ? 'rgba(239, 68, 68, 0.1)' : '#ffffff'),
                        borderRadius: 16, 
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: isSelected ? '0 4px 12px rgba(59,130,246,0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        transform: 'scale(1)',
                        position: 'relative'
                      }}
                      onMouseEnter={e => { if(!isSelected) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; } }}
                      onMouseLeave={e => { if(!isSelected) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; } }}
                      onClick={async () => {
                        if (isOcupada) {
                          const ok = await confirm({
                            title: "Mesa Ocupada",
                            message: "Esta mesa ya tiene un pedido activo. ¿Deseas seleccionarla de todos modos para agregar ítems?",
                            confirmLabel: "Sí, seleccionar",
                            variant: "warning"
                          });
                          if (!ok) return;
                        }
                        setSelectedMesa(mesa);
                        setShowMesaSelector(false);
                      }}
                      title={isOcupada ? "Mesa ocupada (Pedido activo)" : undefined}
                    >
                      {isOcupada && (
                        <div style={{ position: 'absolute', top: -10, right: -10, background: 'var(--color-error, #ef4444)', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                          Ocupada
                        </div>
                      )}
                      <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#1e293b' }}>{mesa.codigo || `M ${mesa.id}`}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <User size={14} /> {mesa.asientos} pax
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        color: status.color, 
                        marginTop: 4, 
                        padding: '4px 12px', 
                        borderRadius: 12, 
                        background: `${status.color}15`,
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        {status.text}
                      </div>
                      
                      {status.text !== "Disponible" && (
                        <div 
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await updateMesa({ mesaDto: { ...mesa, idEstadoMesa: 1 } }).unwrap();
                              addToast({ message: "Mesa liberada correctamente", variant: "success" });
                              refetchMesas();
                            } catch (err) {
                              // Spec 019: Modo offline / resiliencia al liberar mesa
                              try {
                                const offlineReleases = JSON.parse(localStorage.getItem('mf_offline_table_releases') || '[]');
                                offlineReleases.push({ idMesa: mesa.id, idEstadoMesa: 1, releasedAt: new Date().toISOString() });
                                localStorage.setItem('mf_offline_table_releases', JSON.stringify(offlineReleases));
                                addToast({ message: "Mesa liberada localmente (pendiente de sincronización)", variant: "info" });
                                // Actualizar optimísticamente en cache local de mesas
                                const cachedMesas = JSON.parse(localStorage.getItem('mf_cache_mesas') || '[]');
                                const updatedCached = cachedMesas.map((m: any) => m.id === mesa.id ? { ...m, idEstadoMesa: 1 } : m);
                                localStorage.setItem('mf_cache_mesas', JSON.stringify(updatedCached));
                                refetchMesas();
                              } catch {
                                addToast({ message: "Error al liberar mesa", variant: "error" });
                              }
                            }
                          }}
                          style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--color-primary, #D64545)', textDecoration: 'underline', textAlign: 'center', width: '100%' }}
                        >
                          Liberar Mesa
                        </div>
                      )}
                      
                    </button>
                  );
                })}
                {filteredMesas.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                    <MapPin size={48} opacity={0.2} style={{ marginBottom: 16 }} />
                    <p style={{ fontSize: '1.2rem', margin: 0 }}>No se encontraron mesas en esta área</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Corte de Caja y Arqueo */}
      <CorteCajaModal 
        isOpen={showCorteModal}
        onClose={() => setShowCorteModal(false)}
        idSucursal={activeSucursalId}
      />

      {/* Modal de Movimiento de Caja (Entradas y Salidas de Efectivo) */}
      <MovimientoCajaModal
        isOpen={showMovimientoModal}
        onClose={() => setShowMovimientoModal(false)}
        idSucursal={activeSucursalId}
      />

      {/* Modal de Corte X (Arqueo en Vivo Provisional) */}
      <CorteXModal
        isOpen={showCorteXModal}
        onClose={() => setShowCorteXModal(false)}
        idSucursal={activeSucursalId}
      />

      {/* Modal de Apertura de Turno */}
      <AperturaTurnoModal
        isOpen={showAperturaModal}
        onClose={() => setShowAperturaModal(false)}
        idSucursal={activeSucursalId}
      />
    </div>
  );
}
