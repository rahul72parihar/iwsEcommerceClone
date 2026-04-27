import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import catalogReducer from './slices/catalogSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    catalog: catalogReducer,
  },

});

