import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: false,
    cartItems: 0,
    toasts: [],
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    setCartCount: (state, action) => {
      state.cartItems = action.payload;
    },
    addToast: (state, action) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state) => {
      state.toasts.shift();
    },
  },
});


export const { toggleSidebar, openSidebar, closeSidebar, setCartCount, addToast, removeToast } = uiSlice.actions;

export default uiSlice.reducer;

