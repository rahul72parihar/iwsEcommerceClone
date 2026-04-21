import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: false,
    cartItems: 0,
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
  },
});

export const { toggleSidebar, openSidebar, closeSidebar, setCartCount } = uiSlice.actions;
export default uiSlice.reducer;

