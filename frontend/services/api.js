// Dummy API service for products
import { hardcodedProductsData } from '../constants/cleanHardcodedProductsData.js';

// Simulate API delay
const API_DELAY = 500;

// Dummy API endpoints
export const apiService = {
  getProducts: (category = null, limit = 12) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let products = hardcodedProductsData;
        if (category) {
          products = products.filter(p => p.category === category);
        }
        products = products.slice(0, limit);
        resolve({
          data: products,
          status: 'success',
          timestamp: Date.now()
        });
      }, API_DELAY);
    });
  },

  getAllProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: hardcodedProductsData,
          status: 'success',
          timestamp: Date.now()
        });
      }, API_DELAY);
    });
  },

  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: ['MEN', 'WOMEN', 'SHOES'],
          status: 'success'
        });
      }, 200);
    });
  }
};

