import React, { useState } from "react";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../components/ui/toast";
import {
  useRegistrarTraspasoMutation,
  useGetExistenciasQuery,
  type Almacen,
  type Insumo,
  type TraspasoItem,
  type TraspasoResumen,
} from "../../services/inventarioApi";
import {
  ArrowRight,
  Check,
  Plus,
  Trash2,
  FileCheck,
} from "lucide-react";

interface TraspasosTabProps {
  almacenes: Almacen[];
  insumos: Insumo[];
}

export const TraspasosTab: React.FC<TraspasosTabProps> = ({ almacenes }) => {
  const { addToast } = useToast();

  const [idOrigen, setIdOrigen] = useState<number>(almacenes[0]?.id || 0);
  const [idDestino, setIdDestino] = useState<number>(almacenes[1]?.id || (almacenes[0]?.id ? almacenes[0].id : 0));
  const [observaciones, setObservaciones] = useState("");

  const [filas, setFilas] = useState<{ idInsumo: number; cantidad: string }[]>([
    { idInsumo: 0, cantidad: "" },
  ]);

  const [ultimoTraspaso, setUltimoTraspaso] = useState<TraspasoResumen | null>(null);

  const { data: existenciasOrigen = [] } = useGetExistenciasQuery(
    { idAlmacen: idOrigen },
    { skip: !idOrigen }
  );

  const [registrarTraspaso, { isLoading }] = useRegistrarTraspasoMutation();

  const agregarFila = () => {
    setFilas([...filas, { idInsumo: 0, cantidad: "" }]);
  };

  const eliminarFila = (index: number) => {
    setFilas(filas.filter((_, i) => i !== index));
  };

  const actualizarFila = (index: number, field: "idInsumo" | "cantidad", val: any) => {
    const next = [...filas];
    next[index] = { ...next[index], [field]: val };
    setFilas(next);
  };

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (idOrigen === idDestino) {
      addToast({ message: "El almacén de origen y destino no pueden ser el mismo", variant: "error" });
      return;
    }

    const itemsValidos: TraspasoItem[] = [];
    for (const f of filas) {
      const cant = parseFloat(f.cantidad);
      if (f.idInsumo && cant > 0) {
        const exist = existenciasOrigen.find((e) => e.idInsumo === f.idInsumo);
        const stockDisp = exist?.stockActual ?? 0;
        if (cant > stockDisp) {
          addToast({
            message: `Stock insuficiente para ${exist?.insumoNombre || "insumo"}. Disp: ${stockDisp}, Solicitado: ${cant}`,
            variant: "error",
          });
          return;
        }
        itemsValidos.push({
          idInsumo: f.idInsumo,
          cantidad: cant,
          stockDisponible: stockDisp,
        });
      }
    }

    if (itemsValidos.length === 0) {
      addToast({ message: "Agregue al menos un insumo con cantidad mayor a 0", variant: "error" });
      return;
    }

    try {
      const result = await registrarTraspaso({
        idAlmacenOrigen: idOrigen,
        idAlmacenDestino: idDestino,
        observaciones: observaciones || undefined,
        items: itemsValidos,
      }).unwrap();

      setUltimoTraspaso(result);
      addToast({ message: `Traspaso ${result.folio} completado con éxito`, variant: "success" });
      setFilas([{ idInsumo: 0, cantidad: "" }]);
      setObservaciones("");
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al procesar el traspaso",
        variant: "error",
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Selector de Origen y Destino */}
      <div className="inv-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", flex: 1 }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label className="inv-form-label" style={{ display: "block", marginBottom: "0.25rem" }}>
              Almacén Origen (De donde sale) *
            </label>
            <select
              className="inv-select"
              style={{ width: "100%" }}
              value={idOrigen}
              onChange={(e) => setIdOrigen(Number(e.target.value))}
            >
              {almacenes.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === idDestino}>
                  {a.nombre} ({a.sucursalNombre})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "1.25rem" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(214, 69, 69, 0.1)",
                color: "var(--color-primary, #d64545)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowRight size={20} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label className="inv-form-label" style={{ display: "block", marginBottom: "0.25rem" }}>
              Almacén Destino (A donde ingresa) *
            </label>
            <select
              className="inv-select"
              style={{ width: "100%" }}
              value={idDestino}
              onChange={(e) => setIdDestino(Number(e.target.value))}
            >
              {almacenes.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === idOrigen}>
                  {a.nombre} ({a.sucursalNombre})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formulario de Insumos a Transferir */}
      <div className="inv-table-card" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 1rem 0", color: "var(--color-text, #1f1f1f)" }}>
          Insumos a Transferir
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filas.map((fila, index) => {
            const existencia = existenciasOrigen.find((e) => e.idInsumo === fila.idInsumo);
            const stockDisp = existencia?.stockActual ?? 0;
            const um = existencia?.unidadMedidaCodigo ?? "";
            const cantNum = parseFloat(fila.cantidad) || 0;
            const esInvalido = cantNum > stockDisp;

            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto",
                  gap: "0.75rem",
                  alignItems: "center",
                  background: esInvalido ? "rgba(214, 69, 69, 0.05)" : "var(--color-surface-raised, #f4f6f8)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                }}
              >
                <div>
                  <label className="inv-form-label" style={{ fontSize: "0.75rem" }}>Insumo</label>
                  <select
                    className="inv-form-select"
                    value={fila.idInsumo}
                    onChange={(e) => actualizarFila(index, "idInsumo", Number(e.target.value))}
                  >
                    <option value={0}>Seleccione insumo con stock</option>
                    {existenciasOrigen
                      .filter((e) => e.stockActual > 0)
                      .map((e) => (
                        <option key={e.idInsumo} value={e.idInsumo}>
                          {e.insumoNombre} (Disp: {e.stockActual} {e.unidadMedidaCodigo})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="inv-form-label" style={{ fontSize: "0.75rem" }}>Stock Disponible</label>
                  <div
                    style={{
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                      color: stockDisp <= 0 ? "var(--color-danger, #d64545)" : "var(--color-text, #1f1f1f)",
                    }}
                  >
                    {stockDisp.toFixed(2)} {um}
                  </div>
                </div>

                <div>
                  <label className="inv-form-label" style={{ fontSize: "0.75rem" }}>Cantidad a Traspasar</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    className="inv-form-input"
                    placeholder="0.00"
                    value={fila.cantidad}
                    onChange={(e) => actualizarFila(index, "cantidad", e.target.value)}
                  />
                </div>

                <div style={{ paddingTop: "1.25rem" }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarFila(index)}
                    disabled={filas.length <= 1}
                    iconOnly
                    leftIcon={<Trash2 size={16} color="var(--color-danger, #d64545)" />}
                    aria-label="Eliminar fila"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <Button variant="secondary" size="sm" onClick={agregarFila} leftIcon={<Plus size={15} />}>
            Agregar Otro Insumo
          </Button>

          <div style={{ maxWidth: "400px", flex: 1, marginLeft: "1.5rem" }}>
            <input
              type="text"
              className="inv-form-input"
              placeholder="Observaciones / Motivo de transferencia..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleConfirmar}
            disabled={isLoading || idOrigen === idDestino}
            leftIcon={<Check size={16} />}
          >
            {isLoading ? "Procesando Traspaso..." : "Confirmar Traspaso Atómico"}
          </Button>
        </div>
      </div>

      {/* Comprobante del Último Traspaso */}
      {ultimoTraspaso && (
        <div
          className="inv-table-card"
          style={{
            padding: "1.25rem",
            borderLeft: "4px solid var(--color-success, #3c8d40)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-success, #3c8d40)", fontWeight: 700 }}>
            <FileCheck size={20} />
            <span>Último Traspaso Registrado: {ultimoTraspaso.folio}</span>
          </div>

          <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-muted, #6b7280)" }}>
            De <strong>{ultimoTraspaso.almacenOrigenNombre}</strong> a <strong>{ultimoTraspaso.almacenDestinoNombre}</strong> • {new Date(ultimoTraspaso.fechaSolicitud).toLocaleString("es-MX")}
          </div>

          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {ultimoTraspaso.detalles.map((d, i) => (
              <span key={i} className="inv-badge inv-badge-normal">
                {d.insumoNombre}: {d.cantidad} {d.unidadMedida}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
