import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type ProvisionarRestaurantePayload,
  useProvisionarRestauranteMutation,
} from "../../services/onboardingApi";
import { Paso1Identidad } from "./steps/Paso1Identidad";
import { Paso2Distribucion } from "./steps/Paso2Distribucion";
import { Paso3Menu } from "./steps/Paso3Menu";
import { Paso4Personal } from "./steps/Paso4Personal";
import { Paso5Lanzamiento } from "./steps/Paso5Lanzamiento";
import { useToast } from "../../components/ui/toast";
import Icon from "../../components/ui/icons/Icon";
import "./onboardingWizard.css";

const PASOS = [
  { id: 1, label: "Identidad" },
  { id: 2, label: "Salón & Cocina" },
  { id: 3, label: "Menú" },
  { id: 4, label: "Personal" },
  { id: 5, label: "Lanzamiento" },
];

export default function OnboardingWizardPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [pasoActual, setPasoActual] = useState(1);

  const [provisionar, { isLoading }] = useProvisionarRestauranteMutation();

  const [payload, setPayload] = useState<ProvisionarRestaurantePayload>({
    datosEmpresa: {
      nombre: "",
      rfc: "",
      nombreSucursal: "Sucursal Matriz",
      direccion: "",
      zonaHoraria: "America/Mexico_City",
      moneda: "MXN",
      tasaIva: 16.0,
    },
    estacionesCocina: [
      { nombre: "Cocina Caliente & Fría", minutosAmbar: 8, minutosRojo: 15 },
      { nombre: "Barra & Bebidas", minutosAmbar: 4, minutosRojo: 8 },
    ],
    areasYMesas: [
      {
        nombreArea: "Salón Principal",
        orden: 1,
        prefijoMesa: "M",
        cantidadMesas: 6,
        asientosPorMesa: 4,
      },
      {
        nombreArea: "Terraza",
        orden: 2,
        prefijoMesa: "T",
        cantidadMesas: 4,
        asientosPorMesa: 4,
      },
    ],
    menu: {
      nombreMenu: "Menú Principal",
      categorias: ["Entradas", "Platos Fuertes", "Bebidas", "Postres"],
      productos: [
        {
          nombre: "Platillo Especial de la Casa",
          nombreCategoria: "Platos Fuertes",
          precio: 150.0,
          estacionCocina: "Cocina Caliente & Fría",
        },
        {
          nombre: "Bebida Refrescante",
          nombreCategoria: "Bebidas",
          precio: 45.0,
          estacionCocina: "Barra & Bebidas",
        },
      ],
      gruposModificador: [],
    },
    personal: [
      {
        nombreCompleto: "Mesero de Turno",
        rol: "Mesero",
        pin: "1234",
      },
    ],
    pinSupervisorAdmin: "9999",
    abrirTurnoInicial: true,
    fondoCajaInicial: 1000.0,
  });

  const validarPasoActual = (): boolean => {
    if (pasoActual === 1) {
      if (!payload.datosEmpresa.nombre.trim()) {
        addToast({ message: "Por favor ingresa el nombre de tu restaurante.", variant: "error" });
        return false;
      }
      if (!payload.datosEmpresa.nombreSucursal.trim()) {
        addToast({ message: "Por favor ingresa el nombre de tu sucursal.", variant: "error" });
        return false;
      }
    }

    if (pasoActual === 2) {
      if (payload.areasYMesas.length === 0) {
        addToast({ message: "Debes configurar al menos un área o zona de comedor.", variant: "error" });
        return false;
      }
      if (payload.estacionesCocina.length === 0) {
        addToast({ message: "Debes configurar al menos una estación de cocina.", variant: "error" });
        return false;
      }
    }

    if (pasoActual === 3) {
      if (payload.menu.categorias.length === 0) {
        addToast({ message: "Debes tener al menos una categoría en el menú.", variant: "error" });
        return false;
      }
    }

    if (pasoActual === 4) {
      for (const p of payload.personal) {
        if (p.nombreCompleto.trim() && (!p.pin || p.pin.length !== 4)) {
          addToast({
            message: `El empleado "${p.nombreCompleto}" debe tener un PIN numérico de exactamente 4 dígitos.`,
            variant: "error",
          });
          return false;
        }
      }
    }

    return true;
  };

  const irSiguiente = () => {
    if (validarPasoActual()) {
      setPasoActual((p) => Math.min(5, p + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const irAnterior = () => {
    setPasoActual((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalizar = async () => {
    if (!validarPasoActual()) return;

    try {
      const result = await provisionar(payload).unwrap();
      addToast({
        message: "¡Restaurante configurado exitosamente! Bienvenido a MesaFacil.",
        variant: "success",
      });
      // Redireccionar al POS de inmediato
      navigate(result.rutaRedirect || "/ventas/pos");
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Ocurrió un error al aprovisionar el restaurante.";
      addToast({
        message: errorMsg,
        variant: "error",
      });
    }
  };

  return (
    <div className="onboarding-container">
      {/* Encabezado */}
      <header className="onboarding-header">
        <div className="onboarding-badge">
          <Icon name="Sparkles" /> Puesta en Marcha en 5 Minutos
        </div>
        <h1 className="onboarding-title">Bienvenido a MesaFacil</h1>
        <p className="onboarding-subtitle">
          Configuremos lo indispensable para que tu restaurante comience a operar y cobrar hoy mismo.
        </p>
      </header>

      {/* Stepper */}
      <nav className="onboarding-stepper" aria-label="Progreso de configuración">
        {PASOS.map((paso, idx) => {
          const isActive = pasoActual === paso.id;
          const isCompleted = pasoActual > paso.id;

          return (
            <React.Fragment key={paso.id}>
              {idx > 0 && (
                <div
                  className={`onboarding-step-line ${isCompleted ? "completed" : ""}`}
                />
              )}
              <button
                type="button"
                className={`onboarding-step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                onClick={() => isCompleted && setPasoActual(paso.id)}
                disabled={!isCompleted && !isActive}
              >
                <div className="onboarding-step-circle">
                  {isCompleted ? <Icon name="Check" /> : paso.id}
                </div>
                <span className="onboarding-step-label">{paso.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Tarjeta de Contenido */}
      <main className="onboarding-card">
        {pasoActual === 1 && (
          <Paso1Identidad
            datos={payload.datosEmpresa}
            onChange={(nuevos) =>
              setPayload((p) => ({
                ...p,
                datosEmpresa: { ...p.datosEmpresa, ...nuevos },
              }))
            }
          />
        )}

        {pasoActual === 2 && (
          <Paso2Distribucion
            areas={payload.areasYMesas}
            estaciones={payload.estacionesCocina}
            onUpdateAreas={(areasYMesas) => setPayload((p) => ({ ...p, areasYMesas }))}
            onUpdateEstaciones={(estacionesCocina) => setPayload((p) => ({ ...p, estacionesCocina }))}
          />
        )}

        {pasoActual === 3 && (
          <Paso3Menu
            menu={payload.menu}
            estaciones={payload.estacionesCocina}
            onUpdateMenu={(menu) => setPayload((p) => ({ ...p, menu }))}
          />
        )}

        {pasoActual === 4 && (
          <Paso4Personal
            personal={payload.personal}
            pinSupervisorAdmin={payload.pinSupervisorAdmin || ""}
            onUpdatePersonal={(personal) => setPayload((p) => ({ ...p, personal }))}
            onUpdatePinSupervisor={(pinSupervisorAdmin) => setPayload((p) => ({ ...p, pinSupervisorAdmin }))}
          />
        )}

        {pasoActual === 5 && (
          <Paso5Lanzamiento
            payload={payload}
            onUpdatePayload={(updates) => setPayload((p) => ({ ...p, ...updates }))}
            isSubmitting={isLoading}
            onFinalizar={handleFinalizar}
          />
        )}

        {/* Acciones de Navegación */}
        <footer className="onboarding-actions">
          {pasoActual > 1 ? (
            <button
              type="button"
              className="onboarding-btn-secondary"
              onClick={irAnterior}
              disabled={isLoading}
            >
              <Icon name="ArrowLeft" /> Anterior
            </button>
          ) : (
            <div />
          )}

          {pasoActual < 5 && (
            <button
              type="button"
              className="onboarding-btn-primary"
              onClick={irSiguiente}
            >
              Siguiente <Icon name="ArrowRight" />
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
