import "./styles/tokens.css";
import "./styles/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { hydrateFromStorage, pruneIfExpired } from "./state/authSlice";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/routes/AppRouter";

store.dispatch(hydrateFromStorage());
store.dispatch(pruneIfExpired());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
