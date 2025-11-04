import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const exist = state.items.find((i) => i.id === action.payload.id);
      if (exist) {
        exist.quantity += 1;
      }
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer; 


