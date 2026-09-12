import { useState, useMemo, useRef, useEffect } from "react";
import {
  useParseXmlCfdiMutation,
  useRegistrarCompraMutation,
  useGetProveedoresQuery,
  type CfdiParseResult,
  type RegistrarCompraPayload,
} from "../../services/comprasApi";
import {
  useGetCatalogosBaseInventarioQuery,
  useGetInsumosQuery,
} from "../../services/inventarioApi";
import { useSucursalesGetAllQuery } from "../../services/generated/api";
import { useToast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button/Button";
import {
  UploadCloud,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  CheckCheck,
  ShieldAlert,
  HelpCircle,
  Copy,
  Layers,
} from "lucide-react";

interface PartidaMapeoRow {
  renglon: number;
  claveProdServ: string;
  descripcionOriginal: string;
  unidadSAT: string;
  cantidad: number;
  valorUnitario: number;
  importe: number;
  descuento: number;
  tasaIVA: number;
  importeIVA: number;
  tasaIEPS: number;
  importeIEPS: number;
  importeTotal: number;
  idInsumo: number;
  factorConversion: number;
  sugeridoPorMapeo: boolean;
}

export function RecepcionCompraTab({
  onCompraRegistrada,
}: {
  onCompraRegistrada?: () => void;
}) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modo, setModo] = useState<"xml" | "manual">("xml");
  const [isDragging, setIsDragging] = useState(false);

  // Queries
  const { data: catalogos } = useGetCatalogosBaseInventarioQuery();
  const { data: sucursalesResp } = useSucursalesGetAllQuery();
  const { data: insumos = [] } = useGetInsumosQuery();
  const { data: proveedores = [] } = useGetProveedoresQuery();

  const almacenes = useMemo(() => catalogos?.almacenes ?? [], [catalogos?.almacenes]);

  // Sucursales combinando endpoint de gestión y catálogos base
  const sucursales = useMemo(() => {
    const apiData = (sucursalesResp as { data?: Array<{ id: number; nombre?: string; codigo?: string }> })?.data;
    const fromApi = Array.isArray(apiData)
      ? apiData
          .filter((s) => typeof s.id === "number")
          .map((s) => ({
            id: s.id,
            nombre: s.nombre ?? `Sucursal #${s.id}`,
            codigo: s.codigo ?? `SUC-${s.id}`,
          }))
      : [];
    if (fromApi.length > 0) return fromApi;

    return (catalogos?.sucursales ?? []).map((s) => ({
      id: s.id,
      nombre: s.nombre || `Sucursal #${s.id}`,
      codigo: s.codigo,
    }));
  }, [sucursalesResp, catalogos?.sucursales]);

  // Mutations
  const [parseXmlCfdi] = useParseXmlCfdiMutation();
  const [registrarCompra, { isLoading: isGuardando }] = useRegistrarCompraMutation();

  // CFDI Parsed State
  const [cfdiData, setCfdiData] = useState<CfdiParseResult | null>(null);

  // Common Header State
  const [idSucursal, setIdSucursal] = useState<number>(0);
  const [idAlmacen, setIdAlmacen] = useState<number>(0);

  // Sincronizar automáticamente la primera sucursal cuando carguen los catálogos
  useEffect(() => {
    if (!idSucursal && sucursales.length > 0) {
      setIdSucursal(sucursales[0].id);
    }
  }, [sucursales, idSucursal]);

  // Sincronizar automáticamente el almacén cuando cambie la sucursal o carguen los almacenes
  useEffect(() => {
    const almacenesDisponibles = almacenes.filter(
      (a) => !idSucursal || a.idSucursal === idSucursal
    );
    if (almacenesDisponibles.length > 0) {
      const existe = almacenesDisponibles.some((a) => a.id === idAlmacen);
      if (!existe) {
        const principal = almacenesDisponibles.find((a) => a.esPrincipal) || almacenesDisponibles[0];
        setIdAlmacen(principal.id);
      }
    }
  }, [idSucursal, almacenes, idAlmacen]);

  const [idProveedor, setIdProveedor] = useState<number>(0);
  const [serie, setSerie] = useState("");
  const [folio, setFolio] = useState("");
  const [fechaEmision, setFechaEmision] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [esCredito, setEsCredito] = useState(false);
  const [diasCredito, setDiasCredito] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [guardarMapeos, setGuardarMapeos] = useState(true);

  // Items / Grid State
  const [partidas, setPartidas] = useState<PartidaMapeoRow[]>([]);

  // Calculate Due Date
  const fechaVencimientoCalculada = useMemo(() => {
    if (!esCredito || diasCredito <= 0) return undefined;
    const d = new Date(fechaEmision);
    d.setDate(d.getDate() + diasCredito);
    return d.toISOString().substring(0, 10);
  }, [fechaEmision, esCredito, diasCredito]);

  // Handle Drag & Drop / File Upload
  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await procesarArchivoXml(file);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await procesarArchivoXml(file);
      e.target.value = "";
    }
  };

  const procesarArchivoXml = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xml")) {
      addToast({ variant: "error", message: "Solo se admiten archivos XML de comprobante fiscal SAT." });
      return;
    }

    try {
      addToast({ variant: "info", message: "Analizando comprobante CFDI 4.0/3.3..." });
      const xmlContent = await file.text();
      const parseResult = await parseXmlCfdi({ xmlContent, nombreArchivo: file.name }).unwrap();
      setCfdiData(parseResult);

      if (parseResult.proveedorExistenteId) {
        setIdProveedor(parseResult.proveedorExistenteId);
      } else {
        setIdProveedor(0);
      }

      setSerie(parseResult.serie || "");
      setFolio(parseResult.folio || "");
      if (parseResult.fechaEmision) {
        setFechaEmision(parseResult.fechaEmision.substring(0, 10));
      }

      const esMetodoPPD = parseResult.metodoPago === "PPD";
      setEsCredito(esMetodoPPD);
      if (esMetodoPPD) {
        setDiasCredito(30);
      }

      const rows: PartidaMapeoRow[] = parseResult.conceptos.map((c) => {
        let insumoAsignado = c.idInsumoSugerido || 0;
        const factor = c.factorConversionSugerido || 1.0;

        if (!insumoAsignado && insumos.length > 0) {
          const matchByName = insumos.find((i) =>
            c.descripcion.toLowerCase().includes(i.nombre.toLowerCase())
          );
          if (matchByName) {
            insumoAsignado = matchByName.id;
          } else {
            insumoAsignado = insumos[0].id;
          }
        }

        return {
          renglon: c.renglon,
          claveProdServ: c.claveProdServ,
          descripcionOriginal: c.descripcion,
          unidadSAT: c.unidad || c.claveUnidad || "PZA",
          cantidad: c.cantidad,
          valorUnitario: c.valorUnitario,
          importe: c.importe,
          descuento: c.descuento || 0,
          tasaIVA: c.tasaIVA || 0,
          importeIVA: c.importeIVA || 0,
          tasaIEPS: c.tasaIEPS || 0,
          importeIEPS: c.importeIEPS || 0,
          importeTotal: c.importeTotal,
          idInsumo: insumoAsignado,
          factorConversion: factor,
          sugeridoPorMapeo: c.sugeridoPorMapeo,
        };
      });

      setPartidas(rows);

      if (parseResult.facturaYaExiste) {
        addToast({
          variant: "error",
          message: parseResult.mensajeValidacion || "Atención: Esta factura fiscal ya fue ingresada.",
        });
      } else {
        addToast({
          variant: "success",
          message: `XML parseado: ${rows.length} conceptos extraídos correctamente.`,
        });
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al procesar el archivo XML fiscal.";
      addToast({
        variant: "error",
        message: errorMsg,
      });
    }
  };

  const handleAddManualItem = () => {
    if (insumos.length === 0) {
      addToast({ variant: "error", message: "No existen insumos registrados en el catálogo." });
      return;
    }
    const nextRenglon = partidas.length + 1;
    const defaultInsumo = insumos[0];
    const nuevaPartida: PartidaMapeoRow = {
      renglon: nextRenglon,
      claveProdServ: "01010101",
      descripcionOriginal: defaultInsumo.nombre,
      unidadSAT: defaultInsumo.unidadMedidaCodigo || "PZA",
      cantidad: 1,
      valorUnitario: defaultInsumo.costoPromedio || 0,
      importe: defaultInsumo.costoPromedio || 0,
      descuento: 0,
      tasaIVA: 0.16,
      importeIVA: (defaultInsumo.costoPromedio || 0) * 0.16,
      tasaIEPS: 0,
      importeIEPS: 0,
      importeTotal: (defaultInsumo.costoPromedio || 0) * 1.16,
      idInsumo: defaultInsumo.id,
      factorConversion: 1,
      sugeridoPorMapeo: false,
    };
    setPartidas([...partidas, nuevaPartida]);
  };

  const handleUpdatePartidaInsumo = (index: number, newIdInsumo: number) => {
    setPartidas((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        return {
          ...p,
          idInsumo: newIdInsumo,
          sugeridoPorMapeo: false,
        };
      })
    );
  };

  const handleUpdatePartidaField = (
    index: number,
    field: "cantidad" | "valorUnitario" | "factorConversion",
    val: number
  ) => {
    setPartidas((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        const updated = { ...p, [field]: val };
        const subtotal = updated.cantidad * updated.valorUnitario;
        const baseConDescuento = Math.max(0, subtotal - updated.descuento);
        const iva = baseConDescuento * updated.tasaIVA;
        const ieps = baseConDescuento * updated.tasaIEPS;
        return {
          ...updated,
          importe: subtotal,
          importeIVA: iva,
          importeIEPS: ieps,
          importeTotal: baseConDescuento + iva + ieps,
        };
      })
    );
  };

  const handleRemovePartida = (index: number) => {
    setPartidas((prev) => prev.filter((_, i) => i !== index));
  };

  const totalesCalculados = useMemo(() => {
    let subtotal = 0;
    let totalIVA = 0;
    let totalIEPS = 0;
    let totalDescuento = 0;
    let total = 0;

    for (const p of partidas) {
      subtotal += p.importe;
      totalDescuento += p.descuento;
      totalIVA += p.importeIVA;
      totalIEPS += p.importeIEPS;
      total += p.importeTotal;
    }

    return { subtotal, totalIVA, totalIEPS, totalDescuento, total };
  }, [partidas]);

  const handleGuardarCompra = async (aprobarDirectamente: boolean) => {
    if (!folio.trim()) {
      addToast({ variant: "error", message: "El folio del comprobante o remisión es requerido." });
      return;
    }
    if (!idSucursal) {
      addToast({ variant: "error", message: "Selecciona una sucursal destino." });
      return;
    }
    if (!idAlmacen) {
      addToast({ variant: "error", message: "Selecciona un almacén para la entrada de inventario." });
      return;
    }
    if (!idProveedor && !cfdiData?.esProveedorNuevo) {
      addToast({ variant: "error", message: "Selecciona un proveedor válido." });
      return;
    }
    if (partidas.length === 0) {
      addToast({ variant: "error", message: "Debes agregar al menos una partida a la compra." });
      return;
    }

    const detallesPayload = partidas.map((p) => {
      const insumo = insumos.find((i) => i.id === p.idInsumo);
      return {
        idInsumo: p.idInsumo,
        cantidad: p.cantidad,
        idUnidadMedida: insumo?.idUnidadMedidaBase || 1,
        factorConversion: p.factorConversion || 1.0,
        costoUnitario: p.valorUnitario,
        importe: p.importe,
        descuento: p.descuento,
        tasaIVA: p.tasaIVA,
        importeIVA: p.importeIVA,
        tasaIEPS: p.tasaIEPS,
        importeIEPS: p.importeIEPS,
        importeTotal: p.importeTotal,
        descripcionOriginal: p.descripcionOriginal,
        claveProdServ: p.claveProdServ,
        unidadSAT: p.unidadSAT,
      };
    });

    const payload: RegistrarCompraPayload = {
      idSucursal,
      idAlmacen,
      idProveedor: idProveedor || 0,
      proveedorNuevo:
        cfdiData?.esProveedorNuevo && cfdiData?.rfcEmisor && cfdiData?.nombreEmisor
          ? {
              rfc: cfdiData.rfcEmisor,
              razonSocial: cfdiData.nombreEmisor,
              regimenFiscal: cfdiData.regimenFiscalEmisor,
              diasCredito: esCredito ? diasCredito : 0,
            }
          : undefined,
      uuid: cfdiData?.uuid,
      serie: serie || undefined,
      folio,
      fechaEmision: new Date(fechaEmision).toISOString(),
      esCredito,
      diasCredito: esCredito ? diasCredito : 0,
      fechaVencimiento: fechaVencimientoCalculada
        ? new Date(fechaVencimientoCalculada).toISOString()
        : undefined,
      subtotal: totalesCalculados.subtotal,
      totalDescuento: totalesCalculados.totalDescuento,
      totalIVA: totalesCalculados.totalIVA,
      totalIEPS: totalesCalculados.totalIEPS,
      total: totalesCalculados.total,
      observaciones: observaciones || undefined,
      aplicarDirecto: aprobarDirectamente,
      guardarMapeos: guardarMapeos,
      detalles: detallesPayload,
    };

    try {
      const res = await registrarCompra(payload).unwrap();
      addToast({
        variant: "success",
        message: aprobarDirectamente
          ? `¡Compra aplicada! Inventario actualizado en almacén #${idAlmacen} y Kárdex generado.`
          : `Compra #${res.id} guardada como Borrador.`,
      });

      setCfdiData(null);
      setPartidas([]);
      setFolio("");
      setSerie("");
      setObservaciones("");
      if (onCompraRegistrada) onCompraRegistrada();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Error al procesar el registro de la compra.";
      addToast({
        variant: "error",
        message: errorMsg,
      });
    }
  };

  return (
    <div className="compras-stack">
      {/* Switch de Modo: XML vs Manual */}
      <div className="compras-mode-bar">
        <div className="compras-button-group">
          <Button
            type="button"
            variant={modo === "xml" ? "primary" : "secondary"}
            onClick={() => setModo("xml")}
            leftIcon={<UploadCloud size={16} />}
          >
            Cargar Factura XML (CFDI 4.0 / 3.3)
          </Button>

          <Button
            type="button"
            variant={modo === "manual" ? "primary" : "secondary"}
            onClick={() => setModo("manual")}
            leftIcon={<FileText size={16} />}
          >
            Captura Manual / Remisión
          </Button>
        </div>

        <div className="compras-info-tip">
          <HelpCircle size={16} />
          <span>El ingreso de compras actualiza el Kárdex y recalcula el Costo Promedio Ponderado</span>
        </div>
      </div>

      {/* Zona Drag & Drop para XML (si modo XML) */}
      {modo === "xml" && !cfdiData && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`compras-dropzone ${isDragging ? "drag-active" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml,text/xml"
            onChange={handleFileInputChange}
            className="compras-file-input-hidden"
          />
          <UploadCloud size={48} className="compras-dropzone-icon compras-pulse" />
          <div>
            <h3 className="compras-dropzone-title">
              Arrastra aquí el archivo XML de tu proveedor
            </h3>
            <p className="compras-dropzone-desc">
              O haz clic para seleccionarlo desde tu equipo (Compatible con SAT CFDI 4.0 y 3.3)
            </p>
          </div>
          <div className="compras-badge compras-badge--info">
            <span>Extracción automática de RFC, UUID, partidas, impuestos y empatado con insumos</span>
          </div>
        </div>
      )}

      {/* Alerta de duplicidad fiscal si aplica */}
      {cfdiData?.facturaYaExiste && (
        <div className="compras-alert compras-alert--danger">
          <ShieldAlert size={20} className="compras-alert-icon" />
          <div className="compras-alert-body">
            <h4 className="compras-alert-title">
              ¡Factura Fiscal Ya Registrada en el Sistema!
            </h4>
            <p className="compras-alert-text">
              {cfdiData.mensajeValidacion ||
                `El UUID ${cfdiData.uuid} ya fue procesado en el historial de compras.`}
            </p>
          </div>
        </div>
      )}

      {/* Datos Generales de la Compra / Factura */}
      {(cfdiData || modo === "manual") && (
        <div className="compras-section">
          <div className="compras-section-header">
            <div>
              <h2 className="compras-section-title">
                <Building2 size={20} />
                Datos del Comprobante y Almacén Destino
              </h2>
            </div>
            {cfdiData && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setCfdiData(null);
                  setPartidas([]);
                }}
              >
                Cargar Otro XML
              </Button>
            )}
          </div>

          <div className="compras-form-grid">
            {/* Proveedor */}
            <div className="compras-form-group">
              <label className="compras-form-label">Proveedor *</label>
              {cfdiData?.esProveedorNuevo ? (
                <div className="compras-alert compras-alert--warning" style={{ padding: "0.6rem 0.85rem" }}>
                  <div className="compras-alert-body">
                    <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "#92400e" }}>Proveedor Nuevo en CFDI:</div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{cfdiData.nombreEmisor}</div>
                    <div className="compras-code-pill" style={{ marginTop: 2 }}>{cfdiData.rfcEmisor}</div>
                    <span className="compras-text-subtle">Se dará de alta automáticamente al guardar</span>
                  </div>
                </div>
              ) : (
                <select
                  value={idProveedor}
                  onChange={(e) => setIdProveedor(parseInt(e.target.value) || 0)}
                  className="compras-form-select"
                >
                  <option value={0}>-- Selecciona un proveedor --</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.razonSocial} ({p.rfc})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Sucursal */}
            <div className="compras-form-group">
              <label className="compras-form-label">Sucursal Destino *</label>
              <select
                value={idSucursal || ""}
                onChange={(e) => setIdSucursal(parseInt(e.target.value) || 0)}
                className="compras-form-select"
              >
                {sucursales.length === 0 && <option value="">Cargando sucursales...</option>}
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Almacén */}
            <div className="compras-form-group">
              <label className="compras-form-label">Almacén Receptor *</label>
              <select
                value={idAlmacen || ""}
                onChange={(e) => setIdAlmacen(parseInt(e.target.value) || 0)}
                className="compras-form-select"
              >
                {almacenes.filter((a) => !idSucursal || a.idSucursal === idSucursal).length === 0 ? (
                  <option value="">(No hay almacenes configurados)</option>
                ) : (
                  almacenes
                    .filter((a) => !idSucursal || a.idSucursal === idSucursal)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre} {a.esPrincipal ? "(Principal)" : ""}
                      </option>
                    ))
                )}
              </select>
            </div>

            {/* Folio y Serie */}
            <div className="compras-form-group">
              <label className="compras-form-label">Folio / Serie *</label>
              <div className="compras-inline-row">
                <input
                  type="text"
                  placeholder="Serie"
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
                  className="compras-form-input"
                  style={{ width: 80 }}
                />
                <input
                  type="text"
                  required
                  placeholder="Folio"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  className="compras-form-input"
                  style={{ flex: 1, fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Fecha Emisión */}
            <div className="compras-form-group">
              <label className="compras-form-label">Fecha de Emisión *</label>
              <input
                type="date"
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
                className="compras-form-input"
              />
            </div>

            {/* Crédito Toggle */}
            <div className="compras-form-group">
              <label className="compras-form-label">Tipo de Compra</label>
              <div className="compras-inline-row" style={{ paddingTop: "0.5rem" }}>
                <label className="compras-form-check">
                  <input
                    type="radio"
                    name="tipoCompra"
                    checked={!esCredito}
                    onChange={() => {
                      setEsCredito(false);
                      setDiasCredito(0);
                    }}
                  />
                  De Contado
                </label>
                <label className="compras-form-check">
                  <input
                    type="radio"
                    name="tipoCompra"
                    checked={esCredito}
                    onChange={() => setEsCredito(true)}
                  />
                  A Crédito
                </label>
              </div>
            </div>

            {/* Días y Vencimiento si es crédito */}
            {esCredito && (
              <>
                <div className="compras-form-group">
                  <label className="compras-form-label">Plazo de Crédito (Días)</label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={diasCredito}
                    onChange={(e) => setDiasCredito(parseInt(e.target.value) || 0)}
                    className="compras-form-input"
                  />
                </div>
                <div className="compras-form-group">
                  <label className="compras-form-label">Vence el:</label>
                  <div className="compras-code-pill" style={{ height: 44, display: "flex", alignItems: "center", color: "var(--color-primary)" }}>
                    {fechaVencimientoCalculada || "Calculando..."}
                  </div>
                </div>
              </>
            )}

            {/* UUID si viene de XML */}
            {cfdiData?.uuid && (
              <div className="compras-form-group--full">
                <label className="compras-form-label" style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Folio Fiscal SAT (UUID)</label>
                <div className="compras-inline-row" style={{ marginTop: "0.25rem" }}>
                  <span className="compras-code-pill" style={{ flex: 1, padding: "0.5rem 0.75rem" }}>{cfdiData.uuid}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(cfdiData.uuid || "");
                      addToast({ variant: "success", message: "UUID copiado al portapapeles" });
                    }}
                    className="compras-icon-btn"
                    title={cfdiData.uuid}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Asistente de Mapeo Inteligente & Tabla de Partidas */}
      {(cfdiData || modo === "manual") && (
        <div className="compras-section">
          <div className="compras-section-header">
            <div>
              <h2 className="compras-section-title">
                <Layers size={20} />
                Asistente de Mapeo Inteligente & Partidas de Compra
              </h2>
              <p className="compras-section-desc">
                Verifica la asociación de cada renglón facturado con el insumo correspondiente en el almacén.
              </p>
            </div>

            {modo === "manual" && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={handleAddManualItem}
              >
                Agregar Partida
              </Button>
            )}
          </div>

          <div className="compras-table-card">
            <div className="compras-table-wrapper">
              <table className="compras-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Concepto Facturado (SAT)</th>
                    <th style={{ minWidth: 220 }}>Insumo Interno (MesaFácil)</th>
                    <th style={{ width: 90 }}>Cant.</th>
                    <th style={{ width: 100 }}>Factor</th>
                    <th style={{ width: 110 }}>Ingreso</th>
                    <th style={{ width: 110 }}>Costo Unit.</th>
                    <th style={{ width: 90 }}>IVA</th>
                    <th className="compras-col-right" style={{ width: 110 }}>Importe Total</th>
                    <th style={{ width: 44 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {partidas.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="compras-table-empty">
                        No hay partidas registradas en esta factura.
                      </td>
                    </tr>
                  ) : (
                    partidas.map((p, idx) => {
                      const insumoSeleccionado = insumos.find((i) => i.id === p.idInsumo);
                      const stockResultante = p.cantidad * (p.factorConversion || 1);

                      return (
                        <tr key={idx}>
                          <td style={{ fontFamily: "SFMono-Regular, Consolas, monospace", color: "var(--color-text-muted)" }}>
                            {p.renglon}
                          </td>

                          <td>
                            <div style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--color-text)" }}>
                              {p.descripcionOriginal}
                            </div>
                            <div className="compras-text-subtle">
                              Clave SAT: {p.claveProdServ} | {p.unidadSAT}
                            </div>
                            {p.sugeridoPorMapeo ? (
                              <span className="compras-badge compras-badge--success" style={{ marginTop: 4 }}>
                                <CheckCircle2 size={10} /> Auto-identificado
                              </span>
                            ) : (
                              <span className="compras-badge compras-badge--warning" style={{ marginTop: 4 }}>
                                <AlertCircle size={10} /> Confirmar insumo
                              </span>
                            )}
                          </td>

                          <td>
                            <select
                              value={p.idInsumo}
                              onChange={(e) =>
                                handleUpdatePartidaInsumo(idx, parseInt(e.target.value) || 0)
                              }
                              className="compras-cell-select"
                            >
                              {insumos.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.codigo} - {i.nombre} ({i.unidadMedidaCodigo})
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={p.cantidad}
                              onChange={(e) =>
                                handleUpdatePartidaField(idx, "cantidad", parseFloat(e.target.value) || 0)
                              }
                              className="compras-cell-input compras-cell-input--center"
                            />
                          </td>

                          <td>
                            <div className="compras-inline-row" style={{ gap: 4 }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>x</span>
                              <input
                                type="number"
                                min="0.0001"
                                step="0.01"
                                value={p.factorConversion}
                                onChange={(e) =>
                                  handleUpdatePartidaField(
                                    idx,
                                    "factorConversion",
                                    parseFloat(e.target.value) || 1
                                  )
                                }
                                className="compras-cell-input compras-cell-input--center"
                              />
                            </div>
                          </td>

                          <td>
                            <span className="compras-code-pill" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                              {stockResultante.toLocaleString("es-MX", { maximumFractionDigits: 2 })}{" "}
                              {insumoSeleccionado?.unidadMedidaCodigo || "PZA"}
                            </span>
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={p.valorUnitario}
                              onChange={(e) =>
                                handleUpdatePartidaField(
                                  idx,
                                  "valorUnitario",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="compras-cell-input compras-cell-input--right"
                            />
                          </td>

                          <td>
                            <div style={{ fontSize: "0.75rem", textAlign: "center", fontFamily: "SFMono-Regular, Consolas, monospace" }}>
                              {(p.tasaIVA * 100).toFixed(0)}%
                              <div className="compras-text-subtle">
                                ${p.importeIVA.toFixed(2)}
                              </div>
                            </div>
                          </td>

                          <td className="compras-col-right" style={{ fontFamily: "SFMono-Regular, Consolas, monospace", fontWeight: 700, fontSize: "0.825rem" }}>
                            ${p.importeTotal.toFixed(2)}
                          </td>

                          <td className="compras-col-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              iconOnly
                              leftIcon={<Trash2 size={14} color="var(--color-danger)" />}
                              onClick={() => handleRemovePartida(idx)}
                              aria-label="Eliminar partida"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Opciones de Mapeo y Resumen Financiero */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", paddingTop: "0.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <label className="compras-form-check">
                <input
                  type="checkbox"
                  checked={guardarMapeos}
                  onChange={(e) => setGuardarMapeos(e.target.checked)}
                />
                Recordar estas asociaciones (Mapeo Inteligente) para futuras facturas de este proveedor
              </label>

              <div className="compras-form-group">
                <label className="compras-form-label">Notas u Observaciones de la Entrada</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej. Mercancía recibida en buen estado. Sellos de seguridad intactos..."
                  className="compras-form-textarea"
                />
              </div>
            </div>

            {/* Liquidación e Impuestos */}
            <div className="compras-resumen">
              <div className="compras-resumen-row">
                <span>Subtotal Partidas:</span>
                <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${totalesCalculados.subtotal.toFixed(2)}</span>
              </div>
              {totalesCalculados.totalDescuento > 0 && (
                <div className="compras-resumen-row compras-resumen-row--danger">
                  <span>Descuentos:</span>
                  <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>-${totalesCalculados.totalDescuento.toFixed(2)}</span>
                </div>
              )}
              <div className="compras-resumen-row">
                <span>IVA:</span>
                <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${totalesCalculados.totalIVA.toFixed(2)}</span>
              </div>
              {totalesCalculados.totalIEPS > 0 && (
                <div className="compras-resumen-row">
                  <span>IEPS:</span>
                  <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${totalesCalculados.totalIEPS.toFixed(2)}</span>
                </div>
              )}
              <div className="compras-resumen-row compras-resumen-row--total">
                <span>Total Factura:</span>
                <span style={{ fontFamily: "SFMono-Regular, Consolas, monospace" }}>${totalesCalculados.total.toFixed(2)} MXN</span>
              </div>
            </div>
          </div>

          <div className="compras-form-actions">
            <Button
              type="button"
              variant="secondary"
              leftIcon={<Save size={16} />}
              disabled={isGuardando}
              onClick={() => handleGuardarCompra(false)}
            >
              Guardar como Borrador
            </Button>

            <Button
              type="button"
              variant="primary"
              leftIcon={<CheckCheck size={16} />}
              disabled={isGuardando || Boolean(cfdiData?.facturaYaExiste)}
              onClick={() => handleGuardarCompra(true)}
              style={{ backgroundColor: "var(--color-success, #3c8d40)" }}
            >
              Aprobar e Ingresar a Almacén
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
