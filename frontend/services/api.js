// Production/Dev API base (Render/Netlify vs local)
const API_BASE = window.API_BASE || '/api';

// Dummy API endpoints
export const apiService = {
  getProducts: async (category = null, limit = 12) => {
    try {
      const url = category 
        ? `${API_BASE}/products/${category}?limit=${limit}`
        : `${API_BASE}/products?limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: [], status: 'error', error: error.message };
    }
  },
  getAllBanners: async () => {
    try {
      console.log("API BANNER ALL TRIGGERED")
      const response = await fetch(`${API_BASE}/banners/`);
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: [], status: 'error', error: error.message };
    }
  },

  getCategoryBanners: async (category) => {
    try {
      console.log("API CATEGORY BANNER TRIGGERED", category);
      const response = await fetch(`${API_BASE}/banners/${category}`);
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: [], status: 'error', error: error.message };
    }
  },
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: [], status: 'error', error: error.message };
    }
  },

  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/products/id/${id}`);
      console.log("Response frontend api - > ", response);
      const data = await response.json();
      console.log("PRODUCT FOUND ", data);
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      console.log("PRODUCT NOT FOUND")
      return { data: null, status: 'error', error: error.message };
    }
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


