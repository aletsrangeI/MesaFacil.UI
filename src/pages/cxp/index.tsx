import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  BarChart3,
  Building2,
  Truck,
} from "lucide-react";
import { CxPDashboardTab } from "./CxPDashboardTab";
import { AntiguedadSaldosTab } from "./AntiguedadSaldosTab";
import { EstadoCuentaProveedorTab } from "./EstadoCuentaProveedorTab";
import { Button } from "../../components/ui/button/Button";
import "./cxp.css";

export type CxPTabKey = "cuentas" | "antiguedad" | "estados-cuenta";
const VALID_TABS: readonly CxPTabKey[] = ["cuentas", "antiguedad", "estados-cuenta"];

export default function CxPPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as CxPTabKey | null;
  const initialProvId = searchParams.get("proveedorId")
    ? parseInt(searchParams.get("proveedorId")!, 10)
    : undefined;

  const [activeTab, setActiveTab] = useState<CxPTabKey>(
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "cuentas"
  );
  const [selectedProveedorId, setSelectedProveedorId] = useState<number | undefined>(
    initialProvId
  );

  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (key: CxPTabKey) => {
    setActiveTab(key);
    setSearchParams({ tab: key });
  };

  const handleGoToEstadoCuenta = (idProveedor: number) => {
    setSelectedProveedorId(idProveedor);
    setActiveTab("estados-cuenta");
    setSearchParams({ tab: "estados-cuenta", proveedorId: idProveedor.toString() });
  };

  return (
    <div className="cxp-container">
      {/* Header Principal */}
      <div className="cxp-header">
        <div className="cxp-header-title">
          <div className="cxp-header-icon">
            <CreditCard size={24} />
          </div>
          <div className="cxp-header-text">
            <h1>Cuentas por Pagar (CxP) & Programación de Egresos</h1>
            <p>
              Control de pasivos a proveedores, semáforo de vencimientos, abonos vinculados a caja chica y reporte de antigüedad.
            </p>
          </div>
        </div>

        <div className="cxp-header-actions">
          <Button
            variant="secondary"
            onClick={() => navigate("/compras")}
            leftIcon={<Truck size={16} />}
          >
            Facturas & Compras
          </Button>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="cxp-tabs-bar">
        <button
          type="button"
          onClick={() => handleTabChange("cuentas")}
          className={`cxp-tab-btn ${activeTab === "cuentas" ? "is-active" : ""}`}
        >
          <CreditCard size={16} />
          Compromisos & Semáforo de Vencimiento
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("antiguedad")}
          className={`cxp-tab-btn ${activeTab === "antiguedad" ? "is-active" : ""}`}
        >
          <BarChart3 size={16} />
          Reporte de Antigüedad de Saldos
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("estados-cuenta")}
          className={`cxp-tab-btn ${activeTab === "estados-cuenta" ? "is-active" : ""}`}
        >
          <Building2 size={16} />
          Estados de Cuenta por Proveedor
        </button>
      </div>

      {/* Contenido según Pestaña Activa */}
      {activeTab === "cuentas" && <CxPDashboardTab />}
      {activeTab === "antiguedad" && (
        <AntiguedadSaldosTab onSelectProveedor={handleGoToEstadoCuenta} />
      )}
      {activeTab === "estados-cuenta" && (
        <EstadoCuentaProveedorTab initialProveedorId={selectedProveedorId} />
      )}
    </div>
  );
}
