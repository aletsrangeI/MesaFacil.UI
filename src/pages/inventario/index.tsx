import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button/Button";
import { useSucursalesGetAllQuery } from "../../services/generated/api";
import {
  useGetCatalogosBaseInventarioQuery,
  useGetInsumosQuery,
} from "../../services/inventarioApi";
import { ExistenciasTab } from "./ExistenciasTab";
import { InsumosTab } from "./InsumosTab";
import { KardexTab } from "./KardexTab";
import { TraspasosTab } from "./TraspasosTab";
import { ConteoFisicoTab } from "./ConteoFisicoTab";
import { MovimientoRapidoModal } from "./MovimientoRapidoModal";
import { RecetasTab } from "./recetas/RecetasTab";
import "./inventario.css";
import {
  Boxes,
  Layers,
  BookOpen,
  ArrowRightLeft,
  ClipboardCheck,
  PlusCircle,
  ChefHat,
  Truck,
} from "lucide-react";

export type InventarioTabKey =
  | "existencias"
  | "recetas"
  | "insumos"
  | "kardex"
  | "traspasos"
  | "conteo";

export default function InventarioPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as InventarioTabKey | null;
  const validTabs: InventarioTabKey[] = ["existencias", "recetas", "insumos", "kardex", "traspasos", "conteo"];

  const [activeTab, setActiveTab] = useState<InventarioTabKey>(
    tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "existencias"
  );

  useEffect(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (key: InventarioTabKey) => {
    setActiveTab(key);
    setSearchParams({ tab: key });
  };
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>();

  // Catálogos base (unidades, categorías, almacenes, sucursales)
  const { data: catalogos } = useGetCatalogosBaseInventarioQuery(
    selectedSucursalId ? { idSucursal: selectedSucursalId } : undefined
  );

  // Sucursales disponibles
  const { data: sucursalesResp } = useSucursalesGetAllQuery();
  const sucursales = useMemo(() => {
    const fromApi = Array.isArray(sucursalesResp?.data)
      ? sucursalesResp.data
          .filter((s): s is typeof s & { id: number } => typeof s.id === "number")
          .map((s) => ({
            id: s.id,
            nombre: s.nombre ?? `Sucursal #${s.id}`,
            codigo: undefined as string | undefined,
          }))
      : [];
    if (fromApi.length > 0) return fromApi;
    return (catalogos?.sucursales ?? []).map((s) => ({
      id: s.id,
      nombre: s.nombre || `Sucursal #${s.id}`,
      codigo: s.codigo,
    }));
  }, [sucursalesResp, catalogos?.sucursales]);

  // ID de sucursal efectivo
  const currentSucursalId = selectedSucursalId || (sucursales.length > 0 ? sucursales[0].id : undefined);

  const unidades = catalogos?.unidadesMedida ?? [];
  const categorias = catalogos?.categorias ?? [];
  const almacenes = catalogos?.almacenes ?? [];
  const tiposAlmacen = catalogos?.tiposAlmacen ?? [];
  const motivosMovimiento = catalogos?.motivosMovimiento ?? [];

  // Insumos generales
  const { data: insumos = [] } = useGetInsumosQuery();

  // Control modal movimiento rápido
  const [isMovimientoModalOpen, setIsMovimientoModalOpen] = useState(false);
  const [movimientoInsumoId, setMovimientoInsumoId] = useState<number | undefined>();
  const [movimientoAlmacenId, setMovimientoAlmacenId] = useState<number | undefined>();

  // Kárdex pre-seleccionado
  const [kardexInsumoId] = useState<number | undefined>();

  const handleOpenMovimiento = (insumoId?: number, almacenId?: number) => {
    setMovimientoInsumoId(insumoId);
    setMovimientoAlmacenId(almacenId);
    setIsMovimientoModalOpen(true);
  };

  return (
    <div className="inv-container">
      {/* Header General del Módulo */}
      <div className="inv-header">
        <div className="inv-header-title">
          <h1>Control de Inventario & Materias Primas</h1>
          <p>
            Administración multi-almacén, existencias en tiempo real, costeo promedio ponderado y kárdex operativo.
          </p>
        </div>

        <div className="inv-header-actions">
          {sucursales.length > 0 && (
            <select
              className="inv-select"
              value={currentSucursalId || ""}
              onChange={(e) => setSelectedSucursalId(Number(e.target.value))}
            >
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          )}

          <Button
            variant="secondary"
            onClick={() => navigate("/compras")}
            leftIcon={<Truck size={16} />}
          >
            Entradas & Facturas CFDI
          </Button>

          <Button
            variant="primary"
            onClick={() => handleOpenMovimiento()}
            leftIcon={<PlusCircle size={16} />}
          >
            Movimiento Rápido
          </Button>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="inv-tabs">
        <button
          type="button"
          className={`inv-tab-btn ${activeTab === "existencias" ? "is-active" : ""}`}
          onClick={() => handleTabChange("existencias")}
        >
          <Boxes size={18} />
          <span>Existencias y Almacén</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === "recetas" ? "is-active" : ""}`}
          onClick={() => handleTabChange("recetas")}
        >
          <ChefHat size={18} />
          <span>Recetas & Escandallos</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === "insumos" ? "is-active" : ""}`}
          onClick={() => handleTabChange("insumos")}
        >
          <Layers size={18} />
          <span>Catálogo de Insumos</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === "kardex" ? "is-active" : ""}`}
          onClick={() => handleTabChange("kardex")}
        >
          <BookOpen size={18} />
          <span>Kárdex Transaccional</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === "traspasos" ? "is-active" : ""}`}
          onClick={() => handleTabChange("traspasos")}
        >
          <ArrowRightLeft size={18} />
          <span>Traspasos</span>
        </button>

        <button
          type="button"
          className={`inv-tab-btn ${activeTab === "conteo" ? "is-active" : ""}`}
          onClick={() => handleTabChange("conteo")}
        >
          <ClipboardCheck size={18} />
          <span>Conteo Físico & Ajuste</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "existencias" && (
        <ExistenciasTab
          almacenes={almacenes}
          categorias={categorias}
          sucursales={sucursales}
          tiposAlmacen={tiposAlmacen}
          idSucursalActual={currentSucursalId}
          onOpenMovimiento={(insumoId, almacenId) => handleOpenMovimiento(insumoId, almacenId)}
          onGoToTraspasos={() => setActiveTab("traspasos")}
        />
      )}

      {activeTab === "recetas" && (
        <RecetasTab
          insumos={insumos}
          unidadesMedida={unidades}
        />
      )}

      {activeTab === "insumos" && (
        <InsumosTab
          unidades={unidades}
          categorias={categorias}
          almacenes={almacenes}
          onOpenMovimiento={(insumoId) => handleOpenMovimiento(insumoId)}
        />
      )}

      {activeTab === "kardex" && (
        <KardexTab
          insumos={insumos}
          almacenes={almacenes}
          preselectedInsumoId={kardexInsumoId}
        />
      )}

      {activeTab === "traspasos" && (
        <TraspasosTab almacenes={almacenes} insumos={insumos} />
      )}

      {activeTab === "conteo" && <ConteoFisicoTab almacenes={almacenes} />}

      {/* Modal de Movimiento Rápido */}
      <MovimientoRapidoModal
        isOpen={isMovimientoModalOpen}
        onClose={() => setIsMovimientoModalOpen(false)}
        insumos={insumos}
        almacenes={almacenes}
        motivosMovimiento={motivosMovimiento}
        initialInsumoId={movimientoInsumoId}
        initialAlmacenId={movimientoAlmacenId}
      />
    </div>
  );
}
