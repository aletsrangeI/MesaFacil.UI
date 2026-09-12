import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../components/ui/toast";
import {
  useGetExistenciasQuery,
  useAplicarAjustesConteoFisicoMutation,
  type Almacen,
} from "../../services/inventarioApi";
import {
  Eye,
  EyeOff,
  Sparkles,
  Check,
  RotateCcw,
} from "lucide-react";

interface ConteoFisicoTabProps {
  almacenes: Almacen[];
}

export const ConteoFisicoTab: React.FC<ConteoFisicoTabProps> = ({ almacenes }) => {
  const { addToast } = useToast();

  const [idAlmacen, setIdAlmacen] = useState<number>(almacenes[0]?.id || 0);
  const [conteoCiego, setConteoCiego] = useState(true);
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [observaciones, setObservaciones] = useState("");

  const { data: existencias = [], isLoading } = useGetExistenciasQuery(
    { idAlmacen },
    { skip: !idAlmacen }
  );

  // Mapa de conteos capturados: insumoId -> cantidad física en string
  const [capturaFisica, setCapturaFisica] = useState<Record<number, string>>({});

  const [aplicarAjustes, { isLoading: isApplying }] = useAplicarAjustesConteoFisicoMutation();

  useEffect(() => {
    // Inicializar mapa de captura
    const initial: Record<number, string> = {};
    existencias.forEach((e) => {
      initial[e.idInsumo] = "";
    });
    setCapturaFisica(initial);
  }, [existencias]);

  const existenciasFiltradas = existencias.filter((e) => {
    if (soloCriticos && !e.esCritico) return false;
    return true;
  });

  const handleInputChange = (idInsumo: number, val: string) => {
    setCapturaFisica((prev) => ({
      ...prev,
      [idInsumo]: val,
    }));
  };

  const handleReset = () => {
    const initial: Record<number, string> = {};
    existencias.forEach((e) => {
      initial[e.idInsumo] = "";
    });
    setCapturaFisica(initial);
  };

  const handleAplicarAjuste = async () => {
    const conteosAjustar: { idInsumo: number; stockFisico: number }[] = [];

    for (const e of existenciasFiltradas) {
      const rawVal = capturaFisica[e.idInsumo];
      if (rawVal !== undefined && rawVal.trim() !== "") {
        const valNum = parseFloat(rawVal);
        if (!isNaN(valNum) && valNum >= 0) {
          conteosAjustar.push({
            idInsumo: e.idInsumo,
            stockFisico: valNum,
          });
        }
      }
    }

    if (conteosAjustar.length === 0) {
      addToast({
        message: "Ingrese al menos un conteo físico para conciliar",
        variant: "error",
      });
      return;
    }

    if (!window.confirm(`¿Confirmas aplicar los ajustes de inventario para ${conteosAjustar.length} insumo(s)? Se generarán movimientos de auditoría en el Kárdex.`)) {
      return;
    }

    try {
      const ajustados = await aplicarAjustes({
        idAlmacen,
        observaciones: observaciones || undefined,
        conteos: conteosAjustar,
      }).unwrap();

      addToast({
        message: `Auditoría completada. Se generaron ajustes para ${ajustados} insumo(s).`,
        variant: "success",
      });
      handleReset();
      setObservaciones("");
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al aplicar ajustes",
        variant: "error",
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Barra de Control de Auditoría */}
      <div className="inv-filters-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", flex: 1 }}>
          <div style={{ minWidth: "200px" }}>
            <label className="inv-form-label" style={{ display: "block", marginBottom: "0.25rem" }}>
              Almacén a Auditar *
            </label>
            <select
              className="inv-select"
              value={idAlmacen}
              onChange={(e) => setIdAlmacen(Number(e.target.value))}
            >
              {almacenes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} ({a.sucursalNombre})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant={conteoCiego ? "primary" : "secondary"}
            size="sm"
            onClick={() => setConteoCiego(!conteoCiego)}
            leftIcon={conteoCiego ? <EyeOff size={16} /> : <Eye size={16} />}
          >
            {conteoCiego ? "Modo Ciego Activo (Sin Sesgo)" : "Modo Abierto"}
          </Button>

          <Button
            variant={soloCriticos ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSoloCriticos(!soloCriticos)}
            leftIcon={<Sparkles size={16} />}
          >
            {soloCriticos ? "Filtrado por Críticos" : "Solo Insumos Críticos"}
          </Button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary" size="sm" onClick={handleReset} leftIcon={<RotateCcw size={15} />}>
            Limpiar Captura
          </Button>

          <Button
            variant="primary"
            onClick={handleAplicarAjuste}
            disabled={isApplying || existenciasFiltradas.length === 0}
            leftIcon={<Check size={16} />}
          >
            {isApplying ? "Aplicando Ajustes..." : "Aplicar Ajuste de Inventario"}
          </Button>
        </div>
      </div>

      {/* Nota informativa de Conteo Ciego */}
      {conteoCiego && (
        <div
          style={{
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.85rem",
            color: "#1e40af",
          }}
        >
          <EyeOff size={18} />
          <span>
            <strong>Conteo Ciego Activado:</strong> El stock teórico del sistema se encuentra oculto para garantizar un conteo físico imparcial por parte del personal de cocina o barra.
          </span>
        </div>
      )}

      {/* Tabla de Conteo */}
      <div className="inv-table-card">
        <div className="inv-table-wrapper">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Insumo</th>
                <th>Categoría</th>
                {!conteoCiego && <th style={{ textAlign: "right" }}>Stock Sistema (Teórico)</th>}
                <th style={{ textAlign: "right" }}>Conteo Físico Real</th>
                {!conteoCiego && <th style={{ textAlign: "right" }}>Discrepancia</th>}
                {!conteoCiego && <th style={{ textAlign: "right" }}>Impacto ($)</th>}
                <th style={{ textAlign: "center" }}>Estado Captura</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={conteoCiego ? 5 : 8} style={{ textAlign: "center", padding: "2.5rem" }}>
                    Cargando insumos del almacén...
                  </td>
                </tr>
              ) : existenciasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={conteoCiego ? 5 : 8} style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-text-muted, #6b7280)" }}>
                    No hay insumos registrados para auditar en este almacén.
                  </td>
                </tr>
              ) : (
                existenciasFiltradas.map((e) => {
                  const rawVal = capturaFisica[e.idInsumo];
                  const hasValue = rawVal !== undefined && rawVal.trim() !== "";
                  const valNum = hasValue ? parseFloat(rawVal) : NaN;
                  const diff = !isNaN(valNum) ? valNum - e.stockActual : 0;
                  const impacto = diff * e.costoPromedio;
                  const hasDiff = hasValue && Math.abs(diff) > 0.0001;

                  return (
                    <tr key={e.id} className={`inv-audit-row ${hasDiff ? "has-diff" : ""}`}>
                      <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{e.insumoCodigo}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 600 }}>{e.insumoNombre}</span>
                          {e.esCritico && (
                            <span className="inv-badge inv-badge-critico">
                              <Sparkles size={11} /> Crítico
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{e.categoriaNombre}</td>

                      {!conteoCiego && (
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {e.stockActual.toFixed(2)} {e.unidadMedidaCodigo}
                        </td>
                      )}

                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.35rem" }}>
                          <input
                            type="number"
                            step="0.0001"
                            min="0"
                            className="inv-number-input"
                            placeholder="0.00"
                            value={rawVal || ""}
                            onChange={(ev) => handleInputChange(e.idInsumo, ev.target.value)}
                          />
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted, #6b7280)", minWidth: "30px" }}>
                            {e.unidadMedidaCodigo}
                          </span>
                        </div>
                      </td>

                      {!conteoCiego && (
                        <td style={{ textAlign: "right", fontWeight: 700 }}>
                          {hasValue ? (
                            <span style={{ color: diff > 0 ? "var(--color-success, #3c8d40)" : diff < 0 ? "var(--color-danger, #d64545)" : "inherit" }}>
                              {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} {e.unidadMedidaCodigo}
                            </span>
                          ) : (
                            <span style={{ color: "var(--color-text-muted, #6b7280)" }}>—</span>
                          )}
                        </td>
                      )}

                      {!conteoCiego && (
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {hasValue ? (
                            <span style={{ color: impacto > 0 ? "var(--color-success, #3c8d40)" : impacto < 0 ? "var(--color-danger, #d64545)" : "inherit" }}>
                              ${impacto.toFixed(2)}
                            </span>
                          ) : (
                            <span style={{ color: "var(--color-text-muted, #6b7280)" }}>—</span>
                          )}
                        </td>
                      )}

                      <td style={{ textAlign: "center" }}>
                        {hasValue ? (
                          <span className="inv-badge inv-badge-normal">
                            <Check size={12} /> Capturado
                          </span>
                        ) : (
                          <span className="inv-badge" style={{ background: "var(--color-surface-raised, #f4f6f8)", color: "var(--color-text-muted, #6b7280)" }}>
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
