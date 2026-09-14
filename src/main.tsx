import "./styles/tokens.css";
import "./styles/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { hydrateFromStorage, pruneIfExpired } from "./state/authSlice";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/routes/AppRouter";
import { useSessionTimers } from "./session/useSessionTimers";
import { ToastProvider } from "./components/ui/toast";
import { ConfirmProvider } from "./components/ui/confirm-dialog";

// Spec 019: Emparejamiento por QR para terminales/móviles en la misma LAN
try {
  if (typeof window !== "undefined" && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const pairAuth = params.get("pair_auth");
    if (pairAuth) {
      const jsonStr = decodeURIComponent(escape(atob(pairAuth)));
      const parsed = JSON.parse(jsonStr);
      if (parsed && (parsed.accessToken || parsed.token)) {
        localStorage.setItem("mf_auth", JSON.stringify(parsed));
        params.delete("pair_auth");
        const newQuery = params.toString() ? `?${params.toString()}` : "";
        window.history.replaceState(null, "", `${window.location.pathname}${newQuery}`);
        // Si estaba en raíz o en login, dirigir al POS de inmediato
        if (window.location.pathname === "/" || window.location.pathname === "/login") {
          window.location.pathname = "/ventas/pos";
        }
      }
    }
  }
} catch (err) {
  console.warn("[Spec 019] Error al procesar token de emparejamiento QR:", err);
}

import { useOfflineSync } from "./hooks/useOfflineSync";

store.dispatch(hydrateFromStorage());
store.dispatch(pruneIfExpired());

function OfflineSyncGate() {
  useOfflineSync();
  return null;
}

function SessionTimersGate() {
  useSessionTimers();
  return (
    <BrowserRouter>
      <ToastProvider position="bottom-right" max={4}>
        <ConfirmProvider>
          <OfflineSyncGate />
          <AppRouter />
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SessionTimersGate />
    </Provider>
  </React.StrictMode>
);

