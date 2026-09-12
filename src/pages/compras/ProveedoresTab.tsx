import React, { useState, useMemo } from "react";
import {
  useGetProveedoresQuery,
  useCrearProveedorMutation,
  useActualizarProveedorMutation,
  useEliminarProveedorMutation,
  useGetMapeosProveedorQuery,
  useGuardarMapeoMutation,
  useEliminarMapeoMutation,
  useGetRegimenesFiscalesQuery,
  type Proveedor,
} from "../../services/comprasApi";
import { useGetInsumosQuery, type Insumo } from "../../services/inventarioApi";
import { useToast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button/Button";
import { Modal } from "../../components/modal/Modal";
import {
  PlusCircle,
  Search,
  Building2,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Landmark,
} from "lucide-react";

function validarRfcMexicano(rfc: string): { valido: boolean; mensaje: string } {
  const clean = rfc.trim().toUpperCase();
  if (!clean) return { valido: false, mensaje: "El RFC es obligatorio" };
  if (clean.length !== 12 && clean.length !== 13) {
    return { valido: false, mensaje: "El RFC debe tener 12 (moral) o 13 (física) caracteres" };
  }
  if (clean === "XAXX010101000" || clean === "XEXX010101000") {
    return { valido: true, mensaje: "RFC genérico válido" };
  }
  const regex = /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
  if (!regex.test(clean)) {
    return { valido: false, mensaje: "Formato de RFC no cumple el estándar oficial SAT" };
  }
  return { valido: true, mensaje: "RFC válido" };
}

export function ProveedoresTab() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [soloActivos, setSoloActivos] = useState(true);

  const { data: regimenesFiscales = [] } = useGetRegimenesFiscalesQuery();

  const { data: proveedores = [], isLoading, refetch } = useGetProveedoresQuery({
    buscar: searchTerm || undefined,
    activo: soloActivos ? true : undefined,
  });

  const { data: insumos = [] } = useGetInsumosQuery();

  const [crearProveedor, { isLoading: isCreando }] = useCrearProveedorMutation();
  const [actualizarProveedor, { isLoading: isActualizando }] = useActualizarProveedorMutation();
  const [eliminarProveedor] = useEliminarProveedorMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);

  const [formData, setFormData] = useState({
    rfc: "",
    razonSocial: "",
    nombreComercial: "",
    email: "",
    telefono: "",
    contacto: "",
    direccion: "",
    regimenFiscal: "601",
    diasCredito: 0,
    banco: "",
    cuentaBancaria: "",
  });

  const [selectedProveedorMapeos, setSelectedProveedorMapeos] = useState<Proveedor | null>(null);

  const handleOpenCreate = () => {
    setEditingProveedor(null);
    setFormData({
      rfc: "",
      razonSocial: "",
      nombreComercial: "",
      email: "",
      telefono: "",
      contacto: "",
      direccion: "",
      regimenFiscal: "601",
      diasCredito: 0,
      banco: "",
      cuentaBancaria: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Proveedor) => {
    setEditingProveedor(p);
    setFormData({
      rfc: p.rfc,
      razonSocial: p.razonSocial,
      nombreComercial: p.nombreComercial || "",
      email: p.email || "",
      telefono: p.telefono || "",
      contacto: p.contacto || "",
      direccion: p.direccion || "",
      regimenFiscal: p.regimenFiscal || "601",
      diasCredito: p.diasCredito || 0,
      banco: p.banco || "",
      cuentaBancaria: p.cuentaBancaria || "",
    });
    setIsModalOpen(true);
  };

  const rfcValidation = useMemo(() => validarRfcMexicano(formData.rfc), [formData.rfc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rfcValidation.valido) {
      addToast({ variant: "error", message: rfcValidation.mensaje });
      return;
    }

    if (!formData.razonSocial.trim()) {
      addToast({ variant: "error", message: "La Razón Social es requerida." });
      return;
    }

    try {
      if (editingProveedor) {
        await actualizarProveedor({
          id: editingProveedor.id,
          ...formData,
          isActive: editingProveedor.isActive,
        }).unwrap();
        addToast({ variant: "success", message: "Proveedor actualizado con éxito." });
      } else {
        await crearProveedor(formData).unwrap();
        addToast({ variant: "success", message: "Proveedor registrado con éxito." });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al procesar el proveedor.";
      addToast({
        variant: "error",
        message: errorMsg,
      });
    }
  };

  const handleDeshabilitar = async (p: Proveedor) => {
    if (!window.confirm(`¿Deseas deshabilitar al proveedor ${p.razonSocial}?`)) return;
    try {
      await eliminarProveedor(p.id).unwrap();
      addToast({ variant: "success", message: "Proveedor deshabilitado exitosamente." });
      refetch();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al deshabilitar proveedor.";
      addToast({ variant: "error", message: errorMsg });
    }
  };

  return (
    <div className="compras-stack">
      {/* Barra de control */}
      <div className="compras-filters-bar">
        <div className="compras-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por Razón Social, RFC o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="compras-search-input"
          />
        </div>

        <div className="compras-filter-group">
          <label className="compras-form-check">
            <input
              type="checkbox"
              checked={soloActivos}
              onChange={(e) => setSoloActivos(e.target.checked)}
            />
            Solo activos
          </label>

          <Button
            variant="primary"
            onClick={handleOpenCreate}
            leftIcon={<PlusCircle size={16} />}
          >
            Nuevo Proveedor
          </Button>
        </div>
      </div>

      {/* Tabla de Proveedores */}
      <div className="compras-table-card">
        <div className="compras-table-wrapper">
          <table className="compras-table">
            <thead>
              <tr>
                <th>Proveedor / Razón Social</th>
                <th>RFC (SAT)</th>
                <th>Condiciones</th>
                <th>Contacto</th>
                <th>Datos Bancarios</th>
                <th>Compras</th>
                <th className="compras-col-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="compras-table-loading">
                    Cargando directorio de proveedores...
                  </td>
                </tr>
              ) : proveedores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="compras-table-empty">
                    No se encontraron proveedores registrados con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                proveedores.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="compras-supplier-cell">
                        <div className="compras-supplier-avatar">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div className="compras-supplier-name">{p.razonSocial}</div>
                          {p.nombreComercial && (
                            <div className="compras-supplier-alias">{p.nombreComercial}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="compras-code-pill">
                        {p.rfc}
                      </span>
                      {p.regimenFiscal && (
                        <div className="compras-text-subtle">Régimen {p.regimenFiscal}</div>
                      )}
                    </td>

                    <td>
                      {p.diasCredito > 0 ? (
                        <span className="compras-badge compras-badge--info">
                          <Clock size={12} />
                          Crédito {p.diasCredito} días
                        </span>
                      ) : (
                        <span className="compras-badge compras-badge--success">
                          <CheckCircle2 size={12} />
                          De Contado
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="compras-contact-list">
                        {p.contacto && <div className="compras-contact-item is-primary">{p.contacto}</div>}
                        {p.telefono && (
                          <div className="compras-contact-item">
                            <Phone size={11} /> {p.telefono}
                          </div>
                        )}
                        {p.email && (
                          <div className="compras-contact-item">
                            <Mail size={11} /> {p.email}
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      {p.cuentaBancaria || p.banco ? (
                        <div className="compras-bank-info">
                          {p.banco && (
                            <div className="compras-bank-name">
                              <Landmark size={11} /> {p.banco}
                            </div>
                          )}
                          {p.cuentaBancaria && (
                            <div className="compras-bank-clabe">
                              {p.cuentaBancaria}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="compras-bank-empty">Sin datos bancarios</span>
                      )}
                    </td>

                    <td>
                      <div className="compras-stats-summary">
                        <span className="compras-stats-count">{p.totalCompras}</span> facturas
                        <div className="compras-stats-amount">
                          ${p.montoTotalComprado?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </td>

                    <td className="compras-col-right">
                      <div className="compras-table-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconOnly
                          leftIcon={<Layers size={16} />}
                          onClick={() => setSelectedProveedorMapeos(p)}
                          title="Ver mapeos de conceptos SAT"
                          aria-label="Ver mapeos"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconOnly
                          leftIcon={<Edit2 size={16} />}
                          onClick={() => handleOpenEdit(p)}
                          title="Editar proveedor"
                          aria-label="Editar"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconOnly
                          leftIcon={<Trash2 size={16} color="var(--color-danger, #d64545)" />}
                          onClick={() => handleDeshabilitar(p)}
                          title="Deshabilitar proveedor"
                          aria-label="Deshabilitar"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Alta / Edición Proveedor */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProveedor ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
        description="Ficha fiscal SAT y condiciones comerciales de compra."
        size="lg"
        footer={
          <div className="compras-form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={isCreando || isActualizando}
              leftIcon={<CheckCircle2 size={16} />}
              onClick={handleSubmit}
            >
              {editingProveedor ? "Guardar Cambios" : "Crear Proveedor"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="compras-form-grid">
            <div className="compras-form-group">
              <label className="compras-form-label">RFC (SAT México) *</label>
              <input
                type="text"
                required
                maxLength={13}
                value={formData.rfc}
                onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                placeholder="Ej. BME8808116B1"
                className={`compras-form-input compras-form-input--mono${
                  formData.rfc.length > 0
                    ? rfcValidation.valido
                      ? " is-valid"
                      : " is-invalid"
                    : ""
                }`}
              />
              {formData.rfc.length > 0 && (
                <p className={`compras-form-hint ${rfcValidation.valido ? "compras-form-hint--valid" : "compras-form-hint--invalid"}`}>
                  {rfcValidation.valido ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  {rfcValidation.mensaje}
                </p>
              )}
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Razón Social Oficial *</label>
              <input
                type="text"
                required
                value={formData.razonSocial}
                onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                placeholder="Ej. Carnes Selectas de Sonora SA de CV"
                className="compras-form-input"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Nombre Comercial (Alias)</label>
              <input
                type="text"
                value={formData.nombreComercial}
                onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                placeholder="Ej. Sonora Beef Co."
                className="compras-form-input"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Régimen Fiscal (SAT)</label>
              <select
                value={formData.regimenFiscal}
                onChange={(e) => setFormData({ ...formData, regimenFiscal: e.target.value })}
                className="compras-form-select"
              >
                {regimenesFiscales.length === 0 ? (
                  <option value="601">601 - General de Ley Personas Morales</option>
                ) : (
                  regimenesFiscales.map((r) => (
                    <option key={r.codigo || r.id} value={r.codigo}>
                      {r.nombreCompleto}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Plazo de Crédito</label>
              <div className="compras-inline-row">
                <input
                  type="number"
                  min={0}
                  max={180}
                  value={formData.diasCredito}
                  onChange={(e) =>
                    setFormData({ ...formData, diasCredito: parseInt(e.target.value) || 0 })
                  }
                  className="compras-form-input"
                  style={{ width: 100 }}
                />
                <span className="compras-form-hint">días (0 = contado)</span>
              </div>
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Nombre de Contacto</label>
              <input
                type="text"
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                placeholder="Ej. Juan Pérez - Ventas"
                className="compras-form-input"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej. 662 123 4567"
                className="compras-form-input"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Correo Electrónico</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="facturas@proveedor.com"
                className="compras-form-input"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Banco</label>
              <input
                type="text"
                value={formData.banco}
                onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                placeholder="Ej. BBVA / Banorte"
                className="compras-form-input"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Cuenta / CLABE (18 dígitos)</label>
              <input
                type="text"
                value={formData.cuentaBancaria}
                onChange={(e) => setFormData({ ...formData, cuentaBancaria: e.target.value })}
                placeholder="Ej. 012180001234567890"
                className="compras-form-input compras-form-input--mono"
              />
            </div>

            <div className="compras-form-group compras-form-group--full">
              <label className="compras-form-label">Dirección</label>
              <textarea
                rows={2}
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Calle, Número, Colonia, Código Postal, Ciudad"
                className="compras-form-textarea"
              />
            </div>
          </div>
        </form>
      </Modal>

      {selectedProveedorMapeos && (
        <ModalMapeosProveedor
          proveedor={selectedProveedorMapeos}
          insumos={insumos}
          onClose={() => setSelectedProveedorMapeos(null)}
        />
      )}
    </div>
  );
}

function ModalMapeosProveedor({
  proveedor,
  insumos,
  onClose,
}: {
  proveedor: Proveedor;
  insumos: Insumo[];
  onClose: () => void;
}) {
  const { addToast } = useToast();
  const { data: mapeos = [], isLoading, refetch } = useGetMapeosProveedorQuery(proveedor.id);
  const [guardarMapeo] = useGuardarMapeoMutation();
  const [eliminarMapeo] = useEliminarMapeoMutation();

  const [nuevoMapeo, setNuevoMapeo] = useState({
    descripcionSAT: "",
    claveProdServ: "",
    unidadSAT: "",
    idInsumo: insumos[0]?.id || 0,
    factorConversion: 1.0,
  });

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMapeo.descripcionSAT.trim() || !nuevoMapeo.claveProdServ.trim() || !nuevoMapeo.idInsumo) {
      addToast({ variant: "error", message: "Completa los campos requeridos del mapeo." });
      return;
    }

    try {
      await guardarMapeo({
        idProveedor: proveedor.id,
        payload: {
          idProveedor: proveedor.id,
          ...nuevoMapeo,
        },
      }).unwrap();
      addToast({ variant: "success", message: "Mapeo inteligente registrado." });
      setNuevoMapeo({
        descripcionSAT: "",
        claveProdServ: "",
        unidadSAT: "",
        idInsumo: insumos[0]?.id || 0,
        factorConversion: 1.0,
      });
      refetch();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al guardar mapeo.";
      addToast({ variant: "error", message: errorMsg });
    }
  };

  const handleEliminar = async (idMapeo: number) => {
    if (!window.confirm("¿Eliminar este mapeo inteligente?")) return;
    try {
      await eliminarMapeo({ idProveedor: proveedor.id, idMapeo }).unwrap();
      addToast({ variant: "success", message: "Mapeo eliminado." });
      refetch();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al eliminar.";
      addToast({ variant: "error", message: errorMsg });
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Mapeo SAT ➔ Insumos: ${proveedor.razonSocial}`}
      description="Asociaciones aprendidas para autocompletar renglones al importar facturas XML del SAT."
      size="lg"
      footer={
        <div className="compras-form-actions">
          <Button onClick={onClose} variant="secondary">
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="compras-stack" style={{ gap: "1rem" }}>
        <form onSubmit={handleGuardar} className="compras-mapeo-card">
          <div className="compras-mapeo-title">
            Vincular Concepto SAT con Insumo Interno
          </div>
          <div className="compras-form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <div className="compras-form-group">
              <label className="compras-form-label">Descripción en Factura *</label>
              <input
                type="text"
                required
                placeholder="Ej. CARNE MOLIDA 80/20"
                value={nuevoMapeo.descripcionSAT}
                onChange={(e) => setNuevoMapeo({ ...nuevoMapeo, descripcionSAT: e.target.value })}
                className="compras-form-input"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Clave SAT (8 dígitos) *</label>
              <input
                type="text"
                required
                placeholder="Ej. 50111500"
                value={nuevoMapeo.claveProdServ}
                onChange={(e) => setNuevoMapeo({ ...nuevoMapeo, claveProdServ: e.target.value })}
                className="compras-form-input compras-form-input--mono"
              />
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Insumo Restaurante *</label>
              <select
                value={nuevoMapeo.idInsumo}
                onChange={(e) => setNuevoMapeo({ ...nuevoMapeo, idInsumo: parseInt(e.target.value) })}
                className="compras-form-select"
              >
                {insumos.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nombre} ({i.unidadMedidaCodigo})
                  </option>
                ))}
              </select>
            </div>

            <div className="compras-form-group">
              <label className="compras-form-label">Factor Conversión</label>
              <div className="compras-inline-row">
                <input
                  type="number"
                  step="0.01"
                  min="0.0001"
                  value={nuevoMapeo.factorConversion}
                  onChange={(e) =>
                    setNuevoMapeo({ ...nuevoMapeo, factorConversion: parseFloat(e.target.value) || 1 })
                  }
                  className="compras-form-input"
                />
                <Button type="submit" size="sm" variant="primary">
                  Vincular
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="compras-table-card">
          <div className="compras-table-wrapper">
            <table className="compras-table">
              <thead>
                <tr>
                  <th>Concepto SAT</th>
                  <th>Clave SAT</th>
                  <th>Insumo Mapeado</th>
                  <th>Factor</th>
                  <th className="compras-col-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="compras-table-loading">
                      Cargando mapeos...
                    </td>
                  </tr>
                ) : mapeos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="compras-table-empty">
                      No hay conceptos mapeados aún. Se guardarán automáticamente al importar una factura XML.
                    </td>
                  </tr>
                ) : (
                  mapeos.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.descripcionSAT}</td>
                      <td>
                        <span className="compras-code-pill">{m.claveProdServ}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                        {m.insumoNombre} ({m.unidadMedidaNombre})
                      </td>
                      <td style={{ fontWeight: 600 }}>x{m.factorConversion}</td>
                      <td className="compras-col-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconOnly
                          leftIcon={<Trash2 size={14} color="var(--color-danger)" />}
                          onClick={() => handleEliminar(m.id)}
                          title="Eliminar mapeo"
                          aria-label="Eliminar"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
