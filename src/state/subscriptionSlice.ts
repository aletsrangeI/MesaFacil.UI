import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SuspensionDetails {
  errorCode: string;
  message: string;
  contactoWhatsApp?: string;
  fechaFinVigencia?: string;
  motivo?: string;
}

export interface SubscriptionState {
  isSuspended: boolean;
  suspensionDetails: SuspensionDetails | null;
  enPeriodoGracia: boolean;
  diasRestantesGracia: number;
}

const initialState: SubscriptionState = {
  isSuspended: false,
  suspensionDetails: null,
  enPeriodoGracia: false,
  diasRestantesGracia: 0,
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionSuspended: (
      state,
      action: PayloadAction<SuspensionDetails>
    ) => {
      state.isSuspended = true;
      state.suspensionDetails = action.payload;
    },
    clearSubscriptionSuspended: (state) => {
      state.isSuspended = false;
      state.suspensionDetails = null;
    },
    setGracePeriodInfo: (
      state,
      action: PayloadAction<{ enPeriodoGracia: boolean; diasRestantes: number }>
    ) => {
      state.enPeriodoGracia = action.payload.enPeriodoGracia;
      state.diasRestantesGracia = action.payload.diasRestantes;
    },
  },
});

export const {
  setSubscriptionSuspended,
  clearSubscriptionSuspended,
  setGracePeriodInfo,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
