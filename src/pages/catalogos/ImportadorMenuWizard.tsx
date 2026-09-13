// src/pages/catalogos/ImportadorMenuWizard.tsx
//
// Asistente de importación masiva de menú/catálogos desde Excel/CSV (spec 022).
// Modal de 3 pasos: (1) selección de archivo + modo + descarga de plantilla,
// (2) previsualización de calidad (conteos, errores bloqueantes, advertencias),
// (3) confirmación e ingesta atómica contra el backend.
import { useMemo, useRef, useState } from "react";
import { Modal } from "../../components/modal/Modal";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import { useToast } from "../../components/ui/toast";
import { useSucursalesGetAllQuery } from "../../services/generated/api";
import {
  descargarPlantillaMenu,
  useConfirmarImportacionMenuMutation,
  usePreviewImportacionMenuMutation,
  type ModoImportacionMenu,
  type PreviewImportacionMenuResponse,
} from "../../services/importadorMenuApi";

import "./importadorMenuWizard.css";

export interface ImportadorMenuWizardProps {
  open: boolean;
  onClose: () => void;
  onImportacionCompletada?: () => void;
}

type Paso = 1 | 2 | 3;

const PASOS: { id: Paso; titulo: string }[] = [
  { id: 1, titulo: "Archivo" },
  { id: 2, titulo: "Previsualización" },
  { id: 3, titulo: "Confirmación" },
];

export default function ImportadorMenuWizard({
  open,
  onClose,
  onImportacionCompletada,
}: ImportadorMenuWizardProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paso, setPaso] = useState<Paso>(1);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [modo, setModo] = useState<ModoImportacionMenu>("Merge");
  const [sucursalId, setSucursalId] = useState<number | "">("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDescargandoPlantilla, setIsDescargandoPlantilla] = useState(false);
  const [preview, setPreview] = useState<PreviewImportacionMenuResponse | null>(null);
  const [resultado, setResultado] = useState<"exito" | "error" | null>(null);
  const [mensajeResultado, setMensajeResultado] = useState<string | null>(null);

  const { data: sucursalesResp, isLoading: isLoadingSucursales } = useSucursalesGetAllQuery();
  const sucursales = useMemo(() => {
    const raw = (sucursalesResp as any)?.data ?? sucursalesResp;
    return Array.isArray(raw) ? raw : [];
  }, [sucursalesResp]);

  const [previewImportacion, { isLoading: isPreviewing }] = usePreviewImportacionMenuMutation();
  const [confirmarImportacion, { isLoading: isConfirmando }] = useConfirmarImportacionMenuMutation();

  const resetState = () => {
    setPaso(1);
    setArchivo(null);
    setModo("Merge");
    setSucursalId("");
    setPreview(null);
    setResultado(null);
    setMensajeResultado(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleArchivoSeleccionado = (file: File | null) => {
    if (!file) return;
    const extensionValida = /\.(xlsx|csv)$/i.test(file.name);
    if (!extensionValida) {
      addToast({ message: "Solo se aceptan archivos .xlsx o .csv", variant: "error" });
      return;
    }
    setArchivo(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleArchivoSeleccionado(file);
  };

  const handleDescargarPlantilla = async () => {
    setIsDescargandoPlantilla(true);
    try {
      await descargarPlantillaMenu();
    } catch (err: any) {
      addToast({ message: err?.message || "No fue posible descargar la plantilla.", variant: "error" });
    } finally {
      setIsDescargandoPlantilla(false);
    }
  };

  const handleAnalizar = async () => {
    if (!archivo || sucursalId === "") return;
    try {
      const resp = await previewImportacion({
        archivo,
        modo,
        sucursalId: Number(sucursalId),
      }).unwrap();
      setPreview(resp.data);
      setPaso(2);
    } catch (err: any) {
      addToast({
        message: err?.data?.message || err?.message || "No fue posible analizar el archivo.",
        variant: "error",
      });
    }
  };

  const handleConfirmar = async () => {
    if (!preview || sucursalId === "") return;
    try {
      const resp = await confirmarImportacion({
        tokenPreview: preview.tokenPreview,
        modo,
        sucursalId: Number(sucursalId),
      }).unwrap();
      setResultado("exito");
      setMensajeResultado(
        resp?.message ||
          `Importación completada: ${resp.data.productosCreados} productos creados, ${resp.data.productosActualizados} actualizados.`
      );
      onImportacionCompletada?.();
    } catch (err: any) {
      setResultado("error");
      setMensajeResultado(err?.data?.message || err?.message || "Ocurrió un error al confirmar la importación.");
    }
  };

  const irAConfirmacion = () => setPaso(3);

  const puedeAnalizar = Boolean(archivo) && sucursalId !== "" && !isPreviewing;
  const puedeContinuarAPaso3 = Boolean(preview?.esValido);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importar Menú desde Excel / CSV"
      description="Migra tu carta completa en minutos usando la plantilla oficial de MesaFácil."
      size="lg"
      closeOnOverlay={!isPreviewing && !isConfirmando}
    >
      <div className="importador-menu-wizard">
        <ol className="importador-menu-wizard__steps" aria-label="Pasos del asistente">
          {PASOS.map((p) => (
            <li
              key={p.id}
              className={[
                "importador-menu-wizard__step",
                p.id === paso && "is-active",
                p.id < paso && "is-done",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="importador-menu-wizard__step-badge">
                {p.id < paso ? <Icon name="Check" size={14} /> : p.id}
              </span>
              <span className="importador-menu-wizard__step-label">{p.titulo}</span>
            </li>
          ))}
        </ol>

        {paso === 1 && (
          <div className="importador-menu-wizard__panel">
            <div className="importador-menu-wizard__template-box">
              <div>
                <h3>Plantilla oficial</h3>
                <p>
                  Descarga <strong>Plantilla_Menu_MesaFacil.xlsx</strong> con las pestañas de
                  Menú/Productos y Modificadores/Opciones ya preparadas.
                </p>
              </div>
              <Button
                variant="secondary"
                leftIcon={<Icon name="Download" />}
                onClick={handleDescargarPlantilla}
                isLoading={isDescargandoPlantilla}
              >
                Descargar plantilla oficial
              </Button>
            </div>

            <div
              className={[
                "importador-menu-wizard__dropzone",
                isDragOver && "is-dragover",
                archivo && "has-file",
              ]
                .filter(Boolean)
                .join(" ")}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                hidden
                onChange={(e) => handleArchivoSeleccionado(e.target.files?.[0] ?? null)}
              />
              {archivo ? (
                <div className="importador-menu-wizard__file-chip">
                  <Icon name="FileSpreadsheet" size={28} />
                  <div>
                    <strong>{archivo.name}</strong>
                    <span>{(archivo.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button
                    type="button"
                    className="importador-menu-wizard__file-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setArchivo(null);
                    }}
                    aria-label="Quitar archivo"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Icon name="UploadCloud" size={32} />
                  <p>
                    Arrastra tu archivo <strong>.xlsx</strong> o <strong>.csv</strong> aquí, o haz
                    clic para seleccionarlo.
                  </p>
                </>
              )}
            </div>

            <div className="importador-menu-wizard__fields-row">
              <label className="importador-menu-wizard__field">
                <span>Sucursal destino</span>
                <select
                  value={sucursalId}
                  onChange={(e) => setSucursalId(e.target.value ? Number(e.target.value) : "")}
                  disabled={isLoadingSucursales}
                >
                  <option value="">Selecciona una sucursal...</option>
                  {sucursales.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre ?? s.descripcion ?? `Sucursal ${s.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <div className="importador-menu-wizard__field">
                <span>Modo de importación</span>
                <div className="importador-menu-wizard__modo-options">
                  <label
                    className={[
                      "importador-menu-wizard__modo-option",
                      modo === "Merge" && "is-selected",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <input
                      type="radio"
                      name="modo-importacion"
                      value="Merge"
                      checked={modo === "Merge"}
                      onChange={() => setModo("Merge")}
                    />
                    <div>
                      <strong>Fusión / Agregar</strong>
                      <span>Conserva lo existente y agrega o actualiza productos.</span>
                    </div>
                  </label>
                  <label
                    className={[
                      "importador-menu-wizard__modo-option",
                      modo === "Overwrite" && "is-selected",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <input
                      type="radio"
                      name="modo-importacion"
                      value="Overwrite"
                      checked={modo === "Overwrite"}
                      onChange={() => setModo("Overwrite")}
                    />
                    <div>
                      <strong>Reemplazo total</strong>
                      <span>Da de baja la carta actual de la sucursal y carga una nueva.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {paso === 2 && preview && (
          <div className="importador-menu-wizard__panel">
            <div className="importador-menu-wizard__counts">
              <div className="importador-menu-wizard__count-card">
                <span className="importador-menu-wizard__count-value">{preview.totalRenglones}</span>
                <span className="importador-menu-wizard__count-label">Renglones totales</span>
              </div>
              <div className="importador-menu-wizard__count-card">
                <span className="importador-menu-wizard__count-value">{preview.categoriasNuevas}</span>
                <span className="importador-menu-wizard__count-label">Categorías nuevas</span>
              </div>
              <div className="importador-menu-wizard__count-card">
                <span className="importador-menu-wizard__count-value">{preview.productosNuevos}</span>
                <span className="importador-menu-wizard__count-label">Productos nuevos</span>
              </div>
              <div className="importador-menu-wizard__count-card">
                <span className="importador-menu-wizard__count-value">{preview.productosActualizar}</span>
                <span className="importador-menu-wizard__count-label">Productos a actualizar</span>
              </div>
              <div className="importador-menu-wizard__count-card">
                <span className="importador-menu-wizard__count-value">
                  {preview.gruposModificadoresDetectados}
                </span>
                <span className="importador-menu-wizard__count-label">Grupos de modificadores</span>
              </div>
            </div>

            <div
              className={[
                "importador-menu-wizard__validity-banner",
                preview.esValido ? "is-valid" : "is-invalid",
              ].join(" ")}
            >
              <Icon name={preview.esValido ? "CheckCircle2" : "AlertTriangle"} size={20} />
              <span>
                {preview.esValido
                  ? "El archivo es válido y está listo para importarse."
                  : "El archivo tiene errores bloqueantes. Corrígelos y vuelve a intentar."}
              </span>
            </div>

            {preview.errores.length > 0 && (
              <div className="importador-menu-wizard__issues importador-menu-wizard__issues--error">
                <h4>
                  <Icon name="XCircle" size={16} /> Errores ({preview.errores.length})
                </h4>
                <ul>
                  {preview.errores.map((e, idx) => (
                    <li key={idx}>
                      <span className="importador-menu-wizard__issue-row">Fila {e.fila}</span>
                      <span className="importador-menu-wizard__issue-col">{e.columna}</span>
                      <span>{e.mensaje}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {preview.advertencias.length > 0 && (
              <div className="importador-menu-wizard__issues importador-menu-wizard__issues--warning">
                <h4>
                  <Icon name="AlertTriangle" size={16} /> Advertencias ({preview.advertencias.length})
                </h4>
                <ul>
                  {preview.advertencias.map((a, idx) => (
                    <li key={idx}>
                      <span className="importador-menu-wizard__issue-row">Fila {a.fila}</span>
                      <span className="importador-menu-wizard__issue-col">{a.columna}</span>
                      <span>{a.mensaje}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {paso === 3 && (
          <div className="importador-menu-wizard__panel">
            {!resultado && preview && (
              <div className="importador-menu-wizard__summary">
                <h3>Resumen de la importación</h3>
                <ul>
                  <li>
                    Sucursal: <strong>{sucursales.find((s: any) => s.id === sucursalId)?.nombre ?? sucursalId}</strong>
                  </li>
                  <li>
                    Modo: <strong>{modo === "Merge" ? "Fusión / Agregar" : "Reemplazo total"}</strong>
                  </li>
                  <li>
                    Categorías nuevas: <strong>{preview.categoriasNuevas}</strong>
                  </li>
                  <li>
                    Productos nuevos: <strong>{preview.productosNuevos}</strong>
                  </li>
                  <li>
                    Productos a actualizar: <strong>{preview.productosActualizar}</strong>
                  </li>
                </ul>
                {modo === "Overwrite" && (
                  <p className="importador-menu-wizard__overwrite-warning">
                    <Icon name="AlertTriangle" size={16} />
                    Esta acción dará de baja los productos actuales de la sucursal antes de cargar
                    la carta nueva.
                  </p>
                )}
              </div>
            )}

            {resultado === "exito" && (
              <div className="importador-menu-wizard__result importador-menu-wizard__result--success">
                <Icon name="CheckCircle2" size={40} />
                <h3>Importación completada</h3>
                <p>{mensajeResultado}</p>
              </div>
            )}

            {resultado === "error" && (
              <div className="importador-menu-wizard__result importador-menu-wizard__result--error">
                <Icon name="XCircle" size={40} />
                <h3>No fue posible completar la importación</h3>
                <p>{mensajeResultado}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="importador-menu-wizard__footer">
        {paso === 1 && (
          <>
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              rightIcon={<Icon name="ArrowRight" />}
              onClick={handleAnalizar}
              isLoading={isPreviewing}
              disabled={!puedeAnalizar}
            >
              Analizar archivo
            </Button>
          </>
        )}

        {paso === 2 && (
          <>
            <Button variant="ghost" onClick={() => setPaso(1)}>
              Volver
            </Button>
            <Button
              variant="primary"
              rightIcon={<Icon name="ArrowRight" />}
              onClick={irAConfirmacion}
              disabled={!puedeContinuarAPaso3}
            >
              Continuar
            </Button>
          </>
        )}

        {paso === 3 && !resultado && (
          <>
            <Button variant="ghost" onClick={() => setPaso(2)}>
              Volver
            </Button>
            <Button
              variant="primary"
              leftIcon={<Icon name="Upload" />}
              onClick={handleConfirmar}
              isLoading={isConfirmando}
            >
              Confirmar Importación
            </Button>
          </>
        )}

        {paso === 3 && resultado === "exito" && (
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        )}

        {paso === 3 && resultado === "error" && (
          <>
            <Button variant="ghost" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => setResultado(null)} isLoading={isConfirmando}>
              Reintentar
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
