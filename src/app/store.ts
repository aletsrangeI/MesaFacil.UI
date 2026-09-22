import { configureStore, isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { emptySplitApi } from "../services/baseApi";
import authReducer, { logout } from "../state/authSlice";
import authListener from "../state/auth.listeners";
import cartReducer from "../state/cartSlice";
import subscriptionReducer, { setSubscriptionSuspended } from "../state/subscriptionSlice";

const rtkQueryStatusMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const status =
      (action as any)?.payload?.status ??
      (action as any)?.error?.status ??
      (action as any)?.meta?.baseQueryMeta?.response?.status;

    if (status === 401) {
      dispatch(logout());
    } else if (status === 402) {
      const data = (action as any)?.payload?.data;
      dispatch(
        setSubscriptionSuspended({
          errorCode: data?.errorCode || "SUBSCRIPTION_SUSPENDED",
          message:
            data?.message ||
            "El servicio de MesaFácil se encuentra temporalmente suspendido por falta de pago.",
          contactoWhatsApp: data?.contactoWhatsApp,
          fechaFinVigencia: data?.fechaFinVigencia,
          motivo: data?.motivo,
        })
      );
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    subscription: subscriptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(authListener.middleware)
      .concat(emptySplitApi.middleware)
      .concat(rtkQueryStatusMiddleware),
  devTools: import.meta.env.MODE !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
