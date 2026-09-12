import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  cartId: number;
  id: number;
  nombre: string;
  idVariante: number;
  varianteNombre: string;
  precioTotal: number;
  modificadores: any[];
  cantidad: number;
  notas: string;
  signature: string;
  [key: string]: any; // To allow other product properties that might be needed
}

const STORAGE_KEY = 'mf_pos_cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore JSON parsing or storage issues
  }
  return [];
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    if (cart.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  } catch {
    // Ignore quota or storage issues
  }
};

const initialState: CartItem[] = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.find(i => i.signature === action.payload.signature && i.notas === action.payload.notas);
      if (existing) {
        existing.cantidad += (action.payload.cantidad || 1);
      } else {
        state.push(action.payload);
      }
      saveCartToStorage(state);
    },
    updateQuantity: (state, action: PayloadAction<{ cartId: number, delta: number }>) => {
      const item = state.find(i => i.cartId === action.payload.cartId);
      if (item) {
        item.cantidad = Math.max(1, item.cantidad + action.payload.delta);
      }
      saveCartToStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const filtered = state.filter(i => i.cartId !== action.payload);
      saveCartToStorage(filtered);
      return filtered;
    },
    clearCart: () => {
      saveCartToStorage([]);
      return [];
    },
    updateItemNote: (state, action: PayloadAction<{ cartId: number, newNotas: string }>) => {
      const itemIndex = state.findIndex(i => i.cartId === action.payload.cartId);
      if (itemIndex === -1) return;

      const item = state[itemIndex];
      const newNotas = action.payload.newNotas;
      
      // Look for another item with exactly the same signature and the new note
      const matchingIndex = state.findIndex(i => 
        i.cartId !== item.cartId && 
        i.signature === item.signature && 
        (i.notas || "") === newNotas
      );

      if (matchingIndex !== -1) {
        // Merge with existing matching item
        state[matchingIndex].cantidad += item.cantidad;
        state.splice(itemIndex, 1);
      } else {
        // Just update the note on the current item
        item.notas = newNotas;
      }
      saveCartToStorage(state);
    }
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, updateItemNote } = cartSlice.actions;

export const selectCart = (state: { cart: CartItem[] }) => state.cart;

export default cartSlice.reducer;
