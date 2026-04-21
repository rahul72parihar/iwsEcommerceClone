// Production/Dev API base (Render/Netlify vs local)
const API_BASE = window.API_BASE || 'http://localhost:5000/api';


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

      const data = await response.json();

      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {

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
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: null, status: 'error', error: error.message };
    }
  },

  login: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: null, status: 'error', error: error.message };
    }
  },

  // Cart API
  getCart: async (token) => {
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: [], status: 'error', error: error.message };
    }
  },

  addToCart: async (productId, quantity = 1, token) => {
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: null, status: 'error', error: error.message };
    }
  },

  removeFromCart: async (productId, token) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return {
        data,
        status: response.ok ? 'success' : 'error'
      };
    } catch (error) {
      return { data: null, status: 'error', error: error.message };
    }
  }
};




