import { configureStore, isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { emptySplitApi } from "../services/baseApi";
import authReducer, { logout } from "../state/authSlice";
import authListener from "../state/auth.listeners";
import cartReducer from "../state/cartSlice";

const rtkQuery401Middleware: Middleware = ({ dispatch }) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const status =
      (action as any)?.payload?.status ??
      (action as any)?.error?.status ??
      (action as any)?.meta?.baseQueryMeta?.response?.status;

    if (status === 401) {
      dispatch(logout());
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(authListener.middleware)
      .concat(emptySplitApi.middleware)
      .concat(rtkQuery401Middleware),
  devTools: import.meta.env.MODE !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
