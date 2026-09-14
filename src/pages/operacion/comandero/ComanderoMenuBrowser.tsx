import { useState } from "react";

/**
 * Categorías en chips deslizables + grid de 2 columnas de productos (spec 025).
 * Reutiliza los mismos datos de useCategoriasGetAllQuery/useProductosGetAllQuery
 * (con variantes y precios ya resueltos por el contenedor) que consume el POS.
 */
export function ComanderoMenuBrowser({
  categorias,
  productos,
  onSelectProducto,
}: {
  categorias: any[];
  /** Productos ya enriquecidos con `variantes: [{ id, nombre, precio }]` */
  productos: any[];
  onSelectProducto: (producto: any) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredProducts = selectedCategory
    ? productos.filter((p: any) => p.idCategoria === selectedCategory)
    : productos;

  return (
    <div>
      <div className="comandero-chips" role="tablist" aria-label="Categorías">
        <button
          type="button"
          className={`comandero-chip ${selectedCategory === null ? "is-active" : ""}`}
          onClick={() => setSelectedCategory(null)}
        >
          Todos
        </button>
        {categorias.map((cat: any) => (
          <button
            key={cat.id}
            type="button"
            className={`comandero-chip ${selectedCategory === cat.id ? "is-active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="comandero-empty-state">No hay productos en esta categoría.</div>
      ) : (
        <div className="comandero-productos-grid">
          {filteredProducts.map((prod: any) => {
            const defaultPrice = prod.variantes?.[0]?.precio || 0;
            const inicial = (prod.nombre || "?").trim().charAt(0).toUpperCase();
            return (
              <button
                key={prod.id}
                type="button"
                className="comandero-producto-card"
                onClick={() => onSelectProducto(prod)}
              >
                <div className="comandero-producto-imagen">{inicial}</div>
                <div className="comandero-producto-info">
                  <div className="comandero-producto-nombre">{prod.nombre}</div>
                  <div className="comandero-producto-precio">
                    {prod.variantes?.length > 1 ? `Desde $${defaultPrice.toFixed(2)}` : `$${defaultPrice.toFixed(2)}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
