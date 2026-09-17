import "./skeletons.css";

/** Skeleton genérico modular para páginas de backoffice / administración */
export function ModuleSkeletonLoader() {
  return (
    <div className="mf-module-skeleton" role="status" aria-label="Cargando módulo...">
      <div className="mf-module-skeleton__header">
        <div className="mf-module-skeleton__title-group">
          <div className="mf-skeleton-block" style={{ width: 220, height: 28 }} />
          <div className="mf-skeleton-block" style={{ width: 340, height: 16 }} />
        </div>
        <div className="mf-module-skeleton__actions">
          <div className="mf-skeleton-block" style={{ width: 110, height: 40, borderRadius: 8 }} />
          <div className="mf-skeleton-block" style={{ width: 140, height: 40, borderRadius: 8 }} />
        </div>
      </div>

      <div className="mf-module-skeleton__toolbar">
        <div className="mf-skeleton-block" style={{ width: 300, height: 40, borderRadius: 8 }} />
        <div className="mf-skeleton-block" style={{ width: 180, height: 40, borderRadius: 8 }} />
      </div>

      <div className="mf-module-skeleton__content-card">
        <div className="mf-module-skeleton__row">
          <div className="mf-skeleton-block" style={{ flex: 1, height: 24 }} />
          <div className="mf-skeleton-block" style={{ flex: 1, height: 24 }} />
          <div className="mf-skeleton-block" style={{ flex: 1, height: 24 }} />
          <div className="mf-skeleton-block" style={{ width: 80, height: 24 }} />
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="mf-module-skeleton__row">
            <div className="mf-skeleton-block" style={{ flex: 1, height: 44, borderRadius: 6 }} />
            <div className="mf-skeleton-block" style={{ flex: 1, height: 44, borderRadius: 6 }} />
            <div className="mf-skeleton-block" style={{ flex: 1, height: 44, borderRadius: 6 }} />
            <div className="mf-skeleton-block" style={{ width: 80, height: 44, borderRadius: 6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton optimizado para el Comandero Móvil de Meseros (pantalla completa) */
export function ComanderoSkeleton() {
  return (
    <div className="mf-comandero-skeleton" role="status" aria-label="Cargando comandero móvil...">
      {/* Barra superior de mesero */}
      <div className="mf-comandero-skeleton__header">
        <div className="mf-skeleton-block" style={{ width: 140, height: 24 }} />
        <div className="mf-skeleton-block" style={{ width: 80, height: 32, borderRadius: 16 }} />
      </div>

      {/* Selector de Áreas / Salones */}
      <div className="mf-comandero-skeleton__tabs">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="mf-skeleton-block"
            style={{ width: 90, height: 36, borderRadius: 18, flexShrink: 0 }}
          />
        ))}
      </div>

      {/* Cuadrícula táctil de mesas */}
      <div className="mf-comandero-skeleton__grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="mf-comandero-skeleton__card">
            <div className="mf-skeleton-block" style={{ width: 40, height: 20 }} />
            <div className="mf-skeleton-block" style={{ width: "80%", height: 16 }} />
            <div className="mf-skeleton-block" style={{ width: "50%", height: 14 }} />
          </div>
        ))}
      </div>

      {/* Navegación inferior fija */}
      <div className="mf-comandero-skeleton__bottom-nav">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="mf-skeleton-block"
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
        ))}
      </div>
    </div>
  );
}

/** Skeleton para la terminal de Punto de Venta (POS de Caja) */
export function PosSkeleton() {
  return (
    <div className="mf-pos-skeleton" role="status" aria-label="Cargando terminal POS...">
      {/* Catálogo de productos */}
      <div className="mf-pos-skeleton__catalog">
        <div className="mf-pos-skeleton__categories">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="mf-skeleton-block"
              style={{ width: 110, height: 42, borderRadius: 8, flexShrink: 0 }}
            />
          ))}
        </div>
        <div className="mf-pos-skeleton__products">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="mf-pos-skeleton__product-card">
              <div className="mf-skeleton-block" style={{ width: "100%", height: 60, borderRadius: 6 }} />
              <div className="mf-skeleton-block" style={{ width: "90%", height: 16 }} />
              <div className="mf-skeleton-block" style={{ width: "50%", height: 18 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Panel lateral de Ticket */}
      <div className="mf-pos-skeleton__ticket">
        <div className="mf-skeleton-block" style={{ width: "100%", height: 36, borderRadius: 8 }} />
        <div className="mf-skeleton-block" style={{ width: "100%", height: 180, borderRadius: 8 }} />
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="mf-skeleton-block" style={{ width: "100%", height: 32 }} />
          <div className="mf-skeleton-block" style={{ width: "100%", height: 48, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

/** Skeleton para la pantalla KDS de Cocina / Barra */
export function KdsSkeleton() {
  return (
    <div className="mf-kds-skeleton" role="status" aria-label="Cargando pantalla KDS...">
      <div className="mf-kds-skeleton__topbar">
        <div className="mf-skeleton-block" style={{ width: 160, height: 28 }} />
        <div className="mf-skeleton-block" style={{ width: 220, height: 36, borderRadius: 8 }} />
      </div>

      <div className="mf-kds-skeleton__lanes">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="mf-kds-skeleton__card">
            <div className="mf-skeleton-block" style={{ width: "100%", height: 40, borderRadius: 6 }} />
            <div className="mf-skeleton-block" style={{ width: "90%", height: 20 }} />
            <div className="mf-skeleton-block" style={{ width: "80%", height: 20 }} />
            <div className="mf-skeleton-block" style={{ width: "95%", height: 20 }} />
            <div className="mf-skeleton-block" style={{ width: "60%", height: 20 }} />
            <div style={{ marginTop: "auto" }}>
              <div className="mf-skeleton-block" style={{ width: "100%", height: 42, borderRadius: 8 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModuleSkeletonLoader;
