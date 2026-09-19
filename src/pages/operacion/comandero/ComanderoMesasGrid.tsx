import { useMemo, useState } from "react";
import { Users, ReceiptText, Link2 } from "lucide-react";

/**
 * Grid táctil de mesas por área para el Modo Comandero Móvil (spec 025).
 * Reutiliza los mismos datos de useMesasGetAllQuery/useAreasGetAllQuery/catalogo estados-mesa
 * que ya consume src/pages/operacion/pos/index.tsx, sólo con una presentación visual
 * simplificada orientada a pantallas táctiles pequeñas.
 */
export function ComanderoMesasGrid({
  mesas,
  areas,
  pedidosActivos,
  estadosMesa,
  onSelectMesa,
}: {
  mesas: any[];
  areas: any[];
  /** Lista de pedidos activos (idEstadoPedido no cerrado) para calcular minutos abierta por mesa */
  pedidosActivos: any[];
  estadosMesa: any[];
  onSelectMesa: (mesa: any) => void;
}) {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  const filteredMesas = selectedAreaId
    ? mesas.filter((m: any) => m.idArea === selectedAreaId)
    : mesas;

  const getEstadoInfo = (idEstadoMesa: number) => {
    if (idEstadoMesa === 4) return { text: "Por Cobrar", cls: "por-cobrar" };
    const estado = estadosMesa.find((e: any) => e.id === idEstadoMesa);
    const desc = (estado?.descripcion || "").toLowerCase();
    if (desc.includes("cobrar") || desc.includes("cuenta")) return { text: "Por Cobrar", cls: "por-cobrar" };
    if (idEstadoMesa === 2 || desc.includes("ocupada")) return { text: estado?.descripcion || "Ocupada", cls: "ocupada" };
    if (idEstadoMesa === 1 || desc.includes("disponible")) return { text: estado?.descripcion || "Libre", cls: "libre" };
    if (idEstadoMesa === 5 || desc.includes("sucia")) return { text: estado?.descripcion || "Sucia", cls: "otro" };
    return { text: estado?.descripcion || "—", cls: "otro" };
  };

  const minutosAbiertaPorMesa = useMemo(() => {
    const map = new Map<number, number>();
    const ahora = Date.now();
    for (const p of pedidosActivos || []) {
      if (!p?.idMesa || !p?.abiertoEn) continue;
      const abiertoEn = new Date(p.abiertoEn).getTime();
      if (Number.isNaN(abiertoEn)) continue;
      const minutos = Math.max(0, Math.round((ahora - abiertoEn) / 60000));
      const previo = map.get(p.idMesa);
      if (previo === undefined || minutos < previo) map.set(p.idMesa, minutos);
    }
    return map;
  }, [pedidosActivos]);

  return (
    <div>
      <div className="comandero-chips" role="tablist" aria-label="Filtro de área">
        <button
          type="button"
          className={`comandero-chip ${selectedAreaId === null ? "is-active" : ""}`}
          onClick={() => setSelectedAreaId(null)}
        >
          Todas
        </button>
        {areas.map((area: any) => (
          <button
            key={area.id}
            type="button"
            className={`comandero-chip ${selectedAreaId === area.id ? "is-active" : ""}`}
            onClick={() => setSelectedAreaId(area.id)}
          >
            {area.descripcion || area.nombre || `Área ${area.id}`}
          </button>
        ))}
      </div>

      {filteredMesas.length === 0 ? (
        <div className="comandero-empty-state">No hay mesas en esta área.</div>
      ) : (
        <div className="comandero-mesas-grid">
          {filteredMesas.map((mesa: any) => {
            const estado = getEstadoInfo(mesa.idEstadoMesa || 1);
            const minutos = minutosAbiertaPorMesa.get(mesa.id);
            return (
              <button
                key={mesa.id}
                type="button"
                className={`comandero-mesa-card ${estado.cls}`}
                onClick={() => {
                  const target = mesa.idMesaPrincipal
                    ? (mesas.find((m: any) => m.id === mesa.idMesaPrincipal) || mesa)
                    : mesa;
                  onSelectMesa(target);
                }}
              >
                <div className="comandero-mesa-codigo">{mesa.codigo || `M${mesa.id}`}</div>
                {mesa.idMesaPrincipal ? (
                  <div className="comandero-mesa-meta" style={{ color: '#8b5cf6', fontWeight: 700 }}>
                    <Link2 size={12} style={{ verticalAlign: "-2px", marginRight: 3 }} />
                    Unida a M{mesa.codigoMesaPrincipal || mesa.idMesaPrincipal}
                  </div>
                ) : mesa.idsMesasUnidas && mesa.idsMesasUnidas.length > 0 ? (
                  <div className="comandero-mesa-meta" style={{ color: '#2563eb', fontWeight: 700 }}>
                    <Link2 size={12} style={{ verticalAlign: "-2px", marginRight: 3 }} />
                    +{mesa.codigosMesasUnidas?.join(', ') || mesa.idsMesasUnidas.length}
                  </div>
                ) : null}
                <div className="comandero-mesa-meta">
                  <Users size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                  {mesa.asientosTotalesGrupo || mesa.asientos} pax
                </div>
                <div className="comandero-mesa-meta">
                  {estado.cls === "por-cobrar" && (
                    <ReceiptText size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                  )}
                  {estado.text}
                </div>
                {typeof minutos === "number" && (
                  <div className="comandero-mesa-minutos">{minutos} min</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
