import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button/Button";
import "./pos.css";

export function ProductModifiersModal({
  isOpen,
  product,
  grupos,
  opciones,
  onClose,
  onAddToCart,
}: {
  isOpen: boolean;
  product: any;
  grupos: any[];
  opciones: any[];
  onClose: () => void;
  onAddToCart: (product: any, selectedVariant: any, selectedModifiers: any[], extraPrice: number, notas: string) => void;
}) {
  // State to hold selected option IDs
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [notas, setNotas] = useState("");

  // Initialize with default options when opened
  useEffect(() => {
    if (isOpen && product) {
      const defaults = opciones
        .filter(o => grupos.some(g => g.id === o.idGrupo) && o.esDefault)
        .map(o => o.id);
      setSelectedOptions(defaults);
      setNotas("");
      
      if (product.variantes && product.variantes.length > 0) {
        setSelectedVariant(product.variantes[0]);
      }
    }
  }, [isOpen, product, grupos, opciones]);

  if (!isOpen || !product) return null;

  const handleToggleOption = (grupo: any, opcion: any) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.includes(opcion.id);
      
      // Calculate current selections for this group
      const currentGroupSelections = prev.filter(id => 
        opciones.find(o => o.id === id)?.idGrupo === grupo.id
      );

      if (isSelected) {
        // Deselect
        return prev.filter(id => id !== opcion.id);
      } else {
        // Select
        if (grupo.maxSeleccion > 0 && currentGroupSelections.length >= grupo.maxSeleccion) {
          // If max reached, replace the first selected one if max is 1 (radio behavior)
          if (grupo.maxSeleccion === 1) {
            return [...prev.filter(id => !currentGroupSelections.includes(id)), opcion.id];
          }
          // Otherwise do nothing (limit reached)
          return prev;
        }
        return [...prev, opcion.id];
      }
    });
  };

  // Validation
  const isValid = grupos.every(grupo => {
    const selectedCount = selectedOptions.filter(id => 
      opciones.find(o => o.id === id)?.idGrupo === grupo.id
    ).length;
    
    if (grupo.obligatorio && selectedCount < (grupo.minSeleccion || 1)) return false;
    if (grupo.minSeleccion > 0 && selectedCount < grupo.minSeleccion) return false;
    return true;
  });

  const extraPrice = selectedOptions.reduce((acc, id) => {
    const opt = opciones.find(o => o.id === id);
    return acc + (opt?.precioExtra || 0);
  }, 0);

  const handleConfirm = () => {
    const selectedMods = selectedOptions.map(id => opciones.find(o => o.id === id)).filter(Boolean);
    onAddToCart(product, selectedVariant, selectedMods, extraPrice, notas);
  };

  return (
    <div className="pos-modal-overlay">
      <div className="pos-modal-content" style={{ maxWidth: 600, width: '100%', padding: '24px', background: 'var(--color-surface, #fff)', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: 8 }}>{product.nombre}</h2>
        <p style={{ color: 'var(--color-text-muted, #666)', marginBottom: 24 }}>Personaliza tu pedido</p>
        
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          
          {/* Variants Section */}
          {product.variantes && product.variantes.length > 1 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  Tamaño / Variante <span style={{ color: 'red', fontSize: '0.9rem', marginLeft: 8 }}>* Obligatorio</span>
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {product.variantes.map((variante: any) => {
                  const isSelected = selectedVariant?.id === variante.id;
                  return (
                    <label 
                      key={variante.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px', 
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        background: isSelected ? 'rgba(214, 69, 69, 0.08)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <input 
                        type="radio" 
                        checked={isSelected}
                        onChange={() => setSelectedVariant(variante)}
                        style={{ marginRight: 12, transform: 'scale(1.2)' }}
                      />
                      <div style={{ flex: 1 }}>{variante.nombre}</div>
                      <div style={{ fontWeight: 'bold' }}>${(variante.precio || 0).toFixed(2)}</div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modifiers Section */}
          {grupos.map(grupo => {
            const grupoOpciones = opciones.filter(o => o.idGrupo === grupo.id && o.activo !== false);
            
            return (
              <div key={grupo.id} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                    {grupo.nombre} 
                    {grupo.obligatorio && <span style={{ color: 'red', fontSize: '0.9rem', marginLeft: 8 }}>* Obligatorio</span>}
                  </h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {grupo.minSeleccion > 0 && `Mín: ${grupo.minSeleccion} `}
                    {grupo.maxSeleccion > 0 && `Máx: ${grupo.maxSeleccion}`}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {grupoOpciones.map(opcion => {
                    const isSelected = selectedOptions.includes(opcion.id);
                    return (
                      <label 
                        key={opcion.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '12px', 
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          background: isSelected ? 'rgba(214, 69, 69, 0.08)' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <input 
                          type={grupo.maxSeleccion === 1 ? "radio" : "checkbox"} 
                          checked={isSelected}
                          onChange={() => handleToggleOption(grupo, opcion)}
                          style={{ marginRight: 12, transform: 'scale(1.2)' }}
                        />
                        <div style={{ flex: 1 }}>{opcion.nombre}</div>
                        {opcion.precioExtra > 0 && (
                          <div style={{ fontWeight: 'bold' }}>+${opcion.precioExtra.toFixed(2)}</div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Notas libres */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.1rem' }}>Notas para cocina</h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej. Sin cebolla, bien cocido..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', minHeight: '80px', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Extra: </span>
            <strong style={{ fontSize: '1.2rem' }}>${extraPrice.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" disabled={!isValid || !selectedVariant} onClick={handleConfirm}>
              Agregar ${((selectedVariant?.precio || 0) + extraPrice).toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
