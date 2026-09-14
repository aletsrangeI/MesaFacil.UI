// src/pages/planes/index.tsx
import type { ReactNode } from "react";
import { Check, Minus, Sparkles } from "lucide-react";
import { useGetPlanesSuscripcionQuery } from "../../services/suscripcionApi";
import type { CatPlanSuscripcion } from "../../services/suscripcionApi";
import "./planes.css";

function formatoMoneda(valor: number): string {
  return valor.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

function Celda({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="planes-page__check planes-page__check--ok">
      <Check size={16} />
    </span>
  ) : (
    <span className="planes-page__check planes-page__check--no">
      <Minus size={16} />
    </span>
  );
}

interface FilaCapacidad {
  etiqueta: string;
  render: (plan: CatPlanSuscripcion) => ReactNode;
}

const FILAS: FilaCapacidad[] = [
  {
    etiqueta: "Precio mensual",
    render: (p) => formatoMoneda(p.precioMensualMxn),
  },
  {
    etiqueta: "Precio anual",
    render: (p) => formatoMoneda(p.precioAnualMxn),
  },
  {
    etiqueta: "Sucursales incluidas",
    render: (p) => p.maxSucursales,
  },
  {
    etiqueta: "Punto de Venta (POS) / Mesas",
    render: (p) => <Celda ok={p.permiteMesas} />,
  },
  {
    etiqueta: "División de Cuenta (Split-Bill)",
    render: (p) => <Celda ok={p.permiteSplitBill} />,
  },
  {
    etiqueta: "Pantallas KDS incluidas",
    render: (p) => (p.maxKdsBase > 0 ? p.maxKdsBase : <Celda ok={false} />),
  },
  {
    etiqueta: "Recetas & Food Cost",
    render: (p) => <Celda ok={p.permiteRecetas} />,
  },
  {
    etiqueta: "Inventario e Insumos",
    render: () => <Celda ok={true} />,
  },
  {
    etiqueta: "Ingesta XML SAT CFDI (Compras)",
    render: (p) => <Celda ok={p.permiteCfdiXml} />,
  },
  {
    etiqueta: "Cuentas por Pagar (CxP)",
    render: (p) => <Celda ok={p.permiteCxP} />,
  },
];

export default function PlanesPage() {
  const { data: planes, isLoading, isError } = useGetPlanesSuscripcionQuery();

  return (
    <div className="planes-page">
      <div className="planes-page__header">
        <div className="planes-page__header-icon">
          <Sparkles size={24} />
        </div>
        <div className="planes-page__header-text">
          <h1>Planes y Suscripción</h1>
          <p>
            Compara las capacidades incluidas en cada plan de MesaFácil. Estos son
            los tiers comerciales disponibles para tu negocio.
          </p>
        </div>
      </div>

      <div className="planes-page__demo-banner">
        <div className="planes-page__demo-banner-content">
          <span className="planes-page__demo-banner-tag">MODO DEMO COMERCIAL</span>
          <p>
            El sistema opera actualmente con <strong>todas las características desbloqueadas por defecto</strong> (<code>FeatureGating:Enabled = false</code>). Todas las pantallas y módulos (KDS, Comanderos, Recetas, Facturación XML) están disponibles para demostraciones comerciales y pruebas sin restricciones.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="planes-page__state">Cargando planes disponibles…</div>
      )}

      {isError && (
        <div className="planes-page__state planes-page__state--error">
          No se pudieron cargar los planes en este momento. Intenta de nuevo más
          tarde.
        </div>
      )}

      {!isLoading && !isError && planes && planes.length > 0 && (
        <div className="planes-page__table-wrap">
          <table className="planes-page__table">
            <thead>
              <tr>
                <th className="planes-page__col-label">Capacidad</th>
                {planes.map((plan) => (
                  <th key={plan.id} className="planes-page__col-plan">
                    {plan.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILAS.map((fila) => (
                <tr key={fila.etiqueta}>
                  <td className="planes-page__row-label">{fila.etiqueta}</td>
                  {planes.map((plan) => (
                    <td key={plan.id} className="planes-page__cell">
                      {fila.render(plan)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && (!planes || planes.length === 0) && (
        <div className="planes-page__state">
          No hay planes de suscripción configurados todavía.
        </div>
      )}
    </div>
  );
}
