import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RecepcionCompraTab } from "./RecepcionCompraTab";
import { HistorialComprasTab } from "./HistorialComprasTab";
import { ProveedoresTab } from "./ProveedoresTab";
import "./compras.css";
import { Button } from "../../components/ui/button/Button";
import {
  UploadCloud,
  FileText,
  Building2,
  Truck,
  Boxes,
  CreditCard,
} from "lucide-react";

export type ComprasTabKey = "recepcion" | "historial" | "proveedores";
const VALID_TABS: readonly ComprasTabKey[] = ["recepcion", "historial", "proveedores"];

export default function ComprasPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as ComprasTabKey | null;

  const [activeTab, setActiveTab] = useState<ComprasTabKey>(
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "recepcion"
  );

  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (key: ComprasTabKey) => {
    setActiveTab(key);
    setSearchParams({ tab: key });
  };

  return (
    <div className="compras-container">
      {/* Header Principal */}
      <div className="compras-header">
        <div className="compras-header-title">
          <div className="compras-header-icon">
            <Truck size={24} />
          </div>
          <div className="compras-header-text">
            <h1>Proveedores, Entradas de Compra & Facturas CFDI</h1>
            <p>
              Recepción formal de inventario, ingesta inteligente de XML del SAT, recálculo de costos y directorio fiscal.
            </p>
          </div>
        </div>

        <div className="compras-header-actions">
          <Button
            variant="secondary"
            onClick={() => navigate("/cxp")}
            leftIcon={<CreditCard size={16} />}
          >
            Cuentas por Pagar (CxP)
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/inventario")}
            leftIcon={<Boxes size={16} />}
          >
            Volver a Inventario
          </Button>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="compras-tabs-bar">
        <button
          type="button"
          onClick={() => handleTabChange("recepcion")}
          className={`compras-tab-btn ${activeTab === "recepcion" ? "is-active" : ""}`}
        >
          <UploadCloud size={16} />
          Recepción & Ingesta XML (CFDI 4.0)
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("historial")}
          className={`compras-tab-btn ${activeTab === "historial" ? "is-active" : ""}`}
        >
          <FileText size={16} />
          Historial de Facturas & Compras
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("proveedores")}
          className={`compras-tab-btn ${activeTab === "proveedores" ? "is-active" : ""}`}
        >
          <Building2 size={16} />
          Directorio de Proveedores & Mapeos SAT
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {activeTab === "recepcion" && (
        <RecepcionCompraTab onCompraRegistrada={() => handleTabChange("historial")} />
      )}

      {activeTab === "historial" && <HistorialComprasTab />}

      {activeTab === "proveedores" && <ProveedoresTab />}
    </div>
  );
}
