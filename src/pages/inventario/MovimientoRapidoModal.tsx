import React, { useState, useEffect } from "react";
import { Modal } from "../../components/modal/Modal";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../components/ui/toast";
import {
  useRegistrarMovimientoInventarioMutation,
  type Insumo,
  type Almacen,
} from "../../services/inventarioApi";
import { PlusCircle, ArrowDownCircle, Sliders, Check } from "lucide-react";

interface MovimientoRapidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  insumos: Insumo[];
  almacenes: Almacen[];
  motivosMovimiento?: Array<{ id: number; codigo: string; tipoMovimiento: string; descripcion: string }>;
  initialInsumoId?: number;
  initialAlmacenId?: number;
}

export const MovimientoRapidoModal: React.FC<MovimientoRapidoModalProps> = ({
  isOpen,
  onClose,
  insumos,
  almacenes,
  motivosMovimiento = [],
  initialInsumoId,
  initialAlmacenId,
}) => {
  const { addToast } = useToast();
  const [registrarMovimiento, { isLoading }] = useRegistrarMovimientoInventarioMutation();

  const [idAlmacen, setIdAlmacen] = useState<number>(initialAlmacenId || 0);
  const [idInsumo, setIdInsumo] = useState<number>(initialInsumoId || 0);
  const [tipoMovimiento, setTipoMovimiento] = useState<"EntradaManual" | "SalidaMerma" | "AjusteInventario">("EntradaManual");
  const [submotivo, setSubmotivo] = useState<string>("CompraEmergencia");
  const [cantidad, setCantidad] = useState<string>("");
  const [costoUnitario, setCostoUnitario] = useState<string>("");
  const [documentoReferencia, setDocumentoReferencia] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");

  const motivosFiltrados = (motivosMovimiento ?? []).filter(
    (m) => m.tipoMovimiento === tipoMovimiento
  );

  useEffect(() => {
    if (motivosFiltrados.length > 0 && !motivosFiltrados.some(m => (m.codigo || m.descripcion) === submotivo)) {
      setSubmotivo(motivosFiltrados[0].codigo || motivosFiltrados[0].descripcion);
    }
  }, [tipoMovimiento, motivosFiltrados]);

  useEffect(() => {
    if (initialInsumoId) setIdInsumo(initialInsumoId);
    if (initialAlmacenId) setIdAlmacen(initialAlmacenId);
    else if (almacenes.length > 0 && !idAlmacen) setIdAlmacen(almacenes[0].id);
  }, [initialInsumoId, initialAlmacenId, almacenes]);

  useEffect(() => {
    const selected = insumos.find((i) => i.id === idInsumo);
    if (selected && (!costoUnitario || costoUnitario === "0")) {
      setCostoUnitario(selected.costoPromedio.toString());
    }
  }, [idInsumo, insumos]);

  const selectedInsumo = insumos.find((i) => i.id === idInsumo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cantNum = parseFloat(cantidad);
    if (isNaN(cantNum) || cantNum <= 0) {
      addToast({ message: "Ingrese una cantidad válida mayor a 0", variant: "error" });
      return;
    }

    if (!idAlmacen || !idInsumo) {
      addToast({ message: "Seleccione un almacén e insumo", variant: "error" });
      return;
    }

    try {
      await registrarMovimiento({
        idAlmacen,
        idInsumo,
        tipoMovimiento,
        submotivo,
        cantidad: cantNum,
        costoUnitario: costoUnitario ? parseFloat(costoUnitario) : undefined,
        documentoReferencia: documentoReferencia || undefined,
        observaciones: observaciones || undefined,
      }).unwrap();

      addToast({
        message: "Movimiento de inventario registrado correctamente",
        variant: "success",
      });
      setCantidad("");
      setObservaciones("");
      setDocumentoReferencia("");
      onClose();
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al registrar movimiento",
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Registrar Movimiento de Inventario"
      size="md"
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", width: "100%" }}>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
            leftIcon={<Check size={16} />}
          >
            {isLoading ? "Guardando..." : "Confirmar Movimiento"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="inv-form-grid">
        <div className="inv-form-group">
          <label className="inv-form-label">Almacén *</label>
          <select
            className="inv-form-select"
            value={idAlmacen}
            onChange={(e) => setIdAlmacen(Number(e.target.value))}
            required
          >
            <option value="">Seleccione un almacén</option>
            {almacenes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre} ({a.sucursalNombre})
              </option>
            ))}
          </select>
        </div>

        <div className="inv-form-group">
          <label className="inv-form-label">Insumo *</label>
          <select
            className="inv-form-select"
            value={idInsumo}
            onChange={(e) => setIdInsumo(Number(e.target.value))}
            required
          >
            <option value="">Seleccione un insumo</option>
            {insumos.map((i) => (
              <option key={i.id} value={i.id}>
                {i.codigo} - {i.nombre} ({i.unidadMedidaCodigo})
              </option>
            ))}
          </select>
        </div>

        <div className="inv-form-group full-width">
          <label className="inv-form-label">Tipo de Movimiento *</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              className={`inv-tab-btn ${tipoMovimiento === "EntradaManual" ? "is-active" : ""}`}
              style={{ justifyContent: "center", border: "1px solid var(--color-surface-sunken, #e5e7eb)", borderRadius: "0.5rem" }}
              onClick={() => {
                setTipoMovimiento("EntradaManual");
                const mEntrada = motivosMovimiento.filter((m) => m.tipoMovimiento === "EntradaManual");
                if (mEntrada.length > 0) setSubmotivo(mEntrada[0].codigo || mEntrada[0].descripcion);
              }}
            >
              <PlusCircle size={16} /> Entrada
            </button>
            <button
              type="button"
              className={`inv-tab-btn ${tipoMovimiento === "SalidaMerma" ? "is-active" : ""}`}
              style={{ justifyContent: "center", border: "1px solid var(--color-surface-sunken, #e5e7eb)", borderRadius: "0.5rem" }}
              onClick={() => {
                setTipoMovimiento("SalidaMerma");
                const mSalida = motivosMovimiento.filter((m) => m.tipoMovimiento === "SalidaMerma");
                if (mSalida.length > 0) setSubmotivo(mSalida[0].codigo || mSalida[0].descripcion);
              }}
            >
              <ArrowDownCircle size={16} /> Merma / Baja
            </button>
            <button
              type="button"
              className={`inv-tab-btn ${tipoMovimiento === "AjusteInventario" ? "is-active" : ""}`}
              style={{ justifyContent: "center", border: "1px solid var(--color-surface-sunken, #e5e7eb)", borderRadius: "0.5rem" }}
              onClick={() => {
                setTipoMovimiento("AjusteInventario");
                const mAjuste = motivosMovimiento.filter((m) => m.tipoMovimiento === "AjusteInventario");
                if (mAjuste.length > 0) setSubmotivo(mAjuste[0].codigo || mAjuste[0].descripcion);
              }}
            >
              <Sliders size={16} /> Ajuste
            </button>
          </div>
        </div>

        <div className="inv-form-group">
          <label className="inv-form-label">Motivo Específico *</label>
          <select
            className="inv-form-select"
            value={submotivo}
            onChange={(e) => setSubmotivo(e.target.value)}
          >
            {motivosFiltrados.length > 0 ? (
              motivosFiltrados.map((m) => (
                <option key={m.id} value={m.codigo || m.descripcion}>
                  {m.descripcion}
                </option>
              ))
            ) : (
              <option value="General">Motivo General</option>
            )}
          </select>
        </div>

        <div className="inv-form-group">
          <label className="inv-form-label">
            Cantidad {selectedInsumo ? `(${selectedInsumo.unidadMedidaCodigo})` : ""} *
          </label>
          <input
            type="number"
            step="0.0001"
            min="0.0001"
            className="inv-form-input"
            placeholder="0.00"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>

        {tipoMovimiento === "EntradaManual" && (
          <div className="inv-form-group">
            <label className="inv-form-label">Costo Unitario ($ MXN) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="inv-form-input"
              placeholder="0.00"
              value={costoUnitario}
              onChange={(e) => setCostoUnitario(e.target.value)}
              required
            />
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6b7280)" }}>
              Recalcula automáticamente el Costo Promedio Ponderado.
            </span>
          </div>
        )}

        <div className="inv-form-group">
          <label className="inv-form-label">Documento o Folio de Ref.</label>
          <input
            type="text"
            className="inv-form-input"
            placeholder="Ej. Ticket 8934, Factura 102"
            value={documentoReferencia}
            onChange={(e) => setDocumentoReferencia(e.target.value)}
          />
        </div>

        <div className="inv-form-group full-width">
          <label className="inv-form-label">Observaciones / Justificación</label>
          <textarea
            className="inv-form-textarea"
            placeholder="Detalles sobre el motivo de la merma o procedencia de la compra..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
