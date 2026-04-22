import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const loadCart = createAsyncThunk(
  'ui/loadCart',
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(setCartCount(0));
      return 0;
    }

    const API_BASE = window.API_BASE || 'http://localhost:5000/api';
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return rejectWithValue('Failed to load cart');

      const data = await response.json();
      const count = data.cart?.length || data.length || 0;
      dispatch(setCartCount(count));
      return count;
    } catch (error) {
      dispatch(setCartCount(0));
      return rejectWithValue(error.message);
    }
  }
);


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
    resetCartOnLogout: (state) => {
      state.cartItems = 0;
    },

    addToast: (state, action) => {
      // Replace all with new toast - single toast behavior
      state.toasts = [action.payload];
    },

    removeToast: (state) => {
      state.toasts.shift();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        // Optional loading
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(loadCart.rejected, (state) => {
        state.cartItems = 0;
      });
  },
});

export const { toggleSidebar, openSidebar, closeSidebar, setCartCount, addToast, removeToast, resetCartOnLogout } = uiSlice.actions;
export { loadCart };




export default uiSlice.reducer;

