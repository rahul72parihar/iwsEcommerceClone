import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';

export const fetchCatalog = createAsyncThunk(
  'catalog/fetchCatalog',
  async (_, { rejectWithValue }) => {
    try {
      const [catRes, subRes] = await Promise.all([
        apiService.adminGetCategories(),
        apiService.adminGetSubcategories(),
      ]);

      if (catRes.status !== 'success') {
        return rejectWithValue(catRes.error || 'Failed to load categories');
      }
      if (subRes.status !== 'success') {
        return rejectWithValue(subRes.error || 'Failed to load subcategories');
      }

      return {
        categories: catRes.data || [],
        subcategories: subRes.data || [],
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    categories: [],
    subcategories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCatalogError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearCatalogError } = catalogSlice.actions;
export default catalogSlice.reducer;

