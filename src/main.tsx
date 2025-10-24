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
import { ConfirmProvider } from "./components/ui/toast/feedback";

store.dispatch(hydrateFromStorage());
store.dispatch(pruneIfExpired());

function SessionTimersGate() {
  useSessionTimers();
  return (
    <BrowserRouter>
      <ConfirmProvider>
        <ToastProvider position="bottom-right" max={4}>
          <AppRouter />
        </ToastProvider>
      </ConfirmProvider>
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
