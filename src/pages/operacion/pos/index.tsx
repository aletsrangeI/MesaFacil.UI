import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../state/authSlice";
import { useToast } from "../../../components/ui/toast";
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
  useAreasGetAllQuery
} from "../../../services/generated/api";
import { ShoppingCart, User, LogOut, ChevronLeft, MapPin } from "lucide-react";
import { ProductModifiersModal } from "./ProductModifiersModal";

export default function PosPage() {
  const profile = useSelector(selectUserProfile);
  const [insertarPedido, { isLoading }] = usePedidosInsertConDetallesAsyncMutation();
  const { data: catData } = useCategoriasGetAllQuery();
  const { data: prodData } = useProductosGetAllQuery();
  const { data: varData } = useVarianteProductosGetAllQuery();
  const { data: precioData } = usePreciosGetAllQuery();
  const { data: gruposData } = useGrupoModificadoresGetAllQuery();
  const { data: opcionesData } = useOpcionModificadoresGetAllQuery();
  const { data: mesasData } = useMesasGetAllQuery();
  const { data: areasData } = useAreasGetAllQuery();
  
  // For Mesa selection
  const [selectedMesa, setSelectedMesa] = useState<any>(null);
  const [showMesaSelector, setShowMesaSelector] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  const categorias = Array.isArray((catData as any)?.data) ? (catData as any).data : [];
  const rawProductos = Array.isArray((prodData as any)?.data) ? (prodData as any).data : [];
  const variantes = Array.isArray((varData as any)?.data) ? (varData as any).data : [];
  const precios = Array.isArray((precioData as any)?.data) ? (precioData as any).data : [];
  const grupos = Array.isArray((gruposData as any)?.data) ? (gruposData as any).data : [];
  const opciones = Array.isArray((opcionesData as any)?.data) ? (opcionesData as any).data : [];
  const mesas = Array.isArray((mesasData as any)?.data) ? (mesasData as any).data : [];
  const areas = Array.isArray((areasData as any)?.data) ? (areasData as any).data : [];

  const filteredMesas = selectedAreaId 
    ? mesas.filter((m: any) => m.idArea === selectedAreaId) 
    : mesas;

  const getEstadoMesaLabel = (idEstadoMesa: number) => {
    switch (idEstadoMesa) {
      case 1: return { text: "Disponible", color: "var(--color-success, #10b981)" };
      case 2: return { text: "Ocupada", color: "var(--color-error, #ef4444)" };
      case 3: return { text: "Reservada", color: "var(--color-warning, #f59e0b)" };
      case 4: return { text: "Sucia", color: "#f97316" };
      case 5: return { text: "Fuera de Servicio", color: "var(--color-text-muted, #94a3b8)" };
      default: return { text: "Desconocido", color: "var(--color-text-muted, #94a3b8)" };
    }
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
  const [cart, setCart] = useState<any[]>([]);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const { addToast } = useToast();

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

  const handleConfirmAddToCart = (prod: any, selectedVariant: any, selectedModifiers: any[], extraPrice: number) => {
    setCart((prev) => [...prev, { 
      ...prod, 
      cartId: Math.random(),
      idVariante: selectedVariant.id,
      varianteNombre: selectedVariant.nombre,
      precioTotal: (selectedVariant.precio || 0) + extraPrice,
      modificadores: selectedModifiers
    }]);
    setModalProduct(null);
    addToast({ message: `${prod.nombre} agregado al pedido`, variant: "success" });
  };

  const handleRemoveFromCart = (cartId: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleEnviarPedido = async () => {
    if (!selectedMesa) {
      addToast({ message: "Por favor asigna una mesa primero", variant: "error" });
      return;
    }

    try {
      const payload = {
        idEmpresa: profile.idEmpresa,
        idSucursal: selectedMesa.idSucursal || 1,
        idMesa: selectedMesa.id,
        idTipoPedido: 1, // Comedor
        idEstadoPedido: 1, // Registrado
        personas: selectedMesa.asientos || 1,
        cargoServicioPct: 0,
        detalles: cart.map(item => ({
          idProducto: item.id,
          idVariante: item.idVariante,
          productoNombre: item.nombre,
          varianteNombre: item.varianteNombre,
          cantidad: 1,
          precioUnitario: item.precioTotal || 0,
          idImpuesto: 1,
          tasaImpuesto: 16,
          montoImpuesto: (item.precioTotal || 0) * 0.16,
          idEstadoPedidoDetalle: 1,
          opcionesModificador: item.modificadores ? item.modificadores.map((m: any) => m.id) : []
        }))
      };

      const result = await insertarPedido({ crearPedidoRequestDto: payload as any }).unwrap();
      
      if ((result as any).isSuccess) {
        addToast({ message: "Pedido enviado correctamente", variant: "success" });
        setCart([]);
      } else {
        addToast({ message: (result as any).message || "Error al enviar el pedido", variant: "error" });
      }
    } catch (error) {
      addToast({ message: "Error de conexiÃ³n al enviar el pedido", variant: "error" });
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.precioTotal || 0), 0);

  return (
    <div className="pos-layout">
      {/* Top Header */}
      <header className="pos-header">
        <div className="pos-header-left">
          <Link to="/" className="pos-back-button">
            <ChevronLeft size={24} />
            <span>Volver</span>
          </Link>
          <div className="pos-brand" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h2>MesaFácil POS</h2>
            <button 
              onClick={() => setShowMesaSelector(true)}
              style={{ 
                cursor: 'pointer', 
                border: selectedMesa ? '1px solid #e2e8f0' : 'none', 
                background: selectedMesa ? '#ffffff' : 'var(--color-primary, #3b82f6)',
                color: selectedMesa ? '#1e293b' : '#ffffff',
                padding: '10px 20px',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                boxShadow: selectedMesa ? '0 2px 4px rgba(0,0,0,0.05)' : '0 4px 12px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <MapPin size={20} color={selectedMesa ? "#3b82f6" : "#ffffff"} />
              {selectedMesa ? `Mesa: ${selectedMesa.codigo || selectedMesa.id} (${selectedMesa.asientos} pax)` : "Asignar Mesa"}
            </button>
          </div>
        </div>
        <div className="pos-header-right">
          <div className="pos-user-info">
            <User size={20} />
            <span>Mesero Activo</span>
          </div>
          <button className="pos-btn-icon">
            <LogOut size={20} />
          </button>
        </div>
      </header>

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
        <aside className="pos-cart-sidebar">
          <div className="pos-cart-header">
            <h3>Pedido Actual</h3>
            <span className="pos-cart-count">{cart.length} items</span>
          </div>

          <div className="pos-cart-items">
            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                <ShoppingCart size={48} opacity={0.2} />
                <p>El pedido está vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="pos-cart-item">
                  <div className="pos-cart-item-details">
                    <span className="pos-cart-item-name">{item.nombre} <small>({item.varianteNombre})</small></span>
                    <span className="pos-cart-item-price">${(item.precioTotal || 0).toFixed(2)}</span>
                    {item.modificadores && item.modificadores.length > 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {item.modificadores.map((m: any) => m.nombre).join(", ")}
                      </div>
                    )}
                  </div>
                  <button
                    className="pos-cart-item-remove"
                    onClick={() => handleRemoveFromCart(item.cartId)}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pos-cart-footer">
            <div className="pos-cart-summary">
              <div className="pos-summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="pos-summary-row pos-total-row">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="pos-btn-checkout"
              disabled={cart.length === 0 || isLoading}
              onClick={handleEnviarPedido}
            >
              {isLoading ? "Enviando..." : "Enviar Pedido"}
            </button>
          </div>
        </aside>
      </div>

      <ProductModifiersModal
        isOpen={!!modalProduct}
        product={modalProduct}
        grupos={grupos.filter((g: any) => g.idProducto === modalProduct?.id && g.activo !== false)}
        opciones={opciones}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleConfirmAddToCart}
      />

      {/* Inline Mesa Selector Modal using Real Data */}
      {showMesaSelector && (
        <div className="pos-modal-overlay">
          <div className="pos-modal-content" style={{ maxWidth: 900, width: '95%', padding: 0, background: '#f8fafc', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ background: '#ffffff', padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: 'var(--color-primary-light, #dbeafe)', padding: 12, borderRadius: 12 }}>
                  <MapPin size={28} color="var(--color-primary, #3b82f6)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>Selección de Mesa</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>Asigna el pedido a una ubicación específica</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMesaSelector(false)}
                style={{ background: '#f1f5f9', border: 'none', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '24px 32px' }}>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
                <button
                  style={{
                    padding: '10px 24px',
                    borderRadius: 30,
                    border: 'none',
                    background: selectedAreaId === null ? 'var(--color-primary, #3b82f6)' : '#ffffff',
                    color: selectedAreaId === null ? '#ffffff' : '#475569',
                    fontWeight: 'bold',
                    boxShadow: selectedAreaId === null ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedAreaId(null)}
                >
                  Todas las Áreas
                </button>
                {areas.map((area: any) => (
                  <button
                    key={area.id}
                    style={{
                      padding: '10px 24px',
                      borderRadius: 30,
                      border: 'none',
                      background: selectedAreaId === area.id ? 'var(--color-primary, #3b82f6)' : '#ffffff',
                      color: selectedAreaId === area.id ? '#ffffff' : '#475569',
                      fontWeight: 'bold',
                      boxShadow: selectedAreaId === area.id ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setSelectedAreaId(area.id)}
                  >
                    {area.descripcion || area.nombre || `Área ${area.id}`}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, maxHeight: '50vh', overflowY: 'auto', paddingRight: 8 }}>
                {filteredMesas.map((mesa: any) => {
                  const status = getEstadoMesaLabel(mesa.idEstadoMesa || 1);
                  const isSelected = selectedMesa?.id === mesa.id;
                  return (
                    <button
                      key={mesa.id}
                      style={{ 
                        padding: 24, 
                        border: isSelected ? '2px solid var(--color-primary, #3b82f6)' : '1px solid transparent',
                        background: isSelected ? 'var(--color-primary-light, #eff6ff)' : '#ffffff',
                        borderRadius: 16, 
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: isSelected ? '0 4px 12px rgba(59,130,246,0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        transform: 'scale(1)'
                      }}
                      onMouseEnter={e => { if(!isSelected) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; } }}
                      onMouseLeave={e => { if(!isSelected) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; } }}
                      onClick={() => {
                        setSelectedMesa(mesa);
                        setShowMesaSelector(false);
                      }}
                    >
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
    </div>
  );
}
