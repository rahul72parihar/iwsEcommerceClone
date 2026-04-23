// Production/Dev API base (Render/Netlify vs local)
const API_BASE = window.API_BASE || 'http://localhost:5000/api';

// 🔥 helper to normalize backend responses
const normalize = (raw) => raw.products || raw.cart || raw.data || raw;

const fetchJSON = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    let raw;
    try {
      raw = await res.json();
    } catch {
      raw = null;
    }

    const data = normalize(raw);

    return {
      data,
      status: res.ok ? "success" : "error",
    };
  } catch (error) {
    return { data: null, status: "error", error: error.message };
  }
};

const getToken = () => localStorage.getItem("token");

export const apiService = {
  getAllProducts: () => fetchJSON(`${API_BASE}/products`),

  getProducts: (category, limit = 12) =>
    fetchJSON(`${API_BASE}/products?category=${category}&limit=${limit}`),

  getProduct: (id) =>
    fetchJSON(`${API_BASE}/products/id/${id}`), // ✅ fixed URL

  getAllBanners: () => fetchJSON(`${API_BASE}/banners`),

  getCategoryBanners: (category) =>
    fetchJSON(`${API_BASE}/banners/${category}`),

  register: (userData) =>
    fetchJSON(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }),

  login: (userData) =>
    fetchJSON(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }),

  // 🔥 CART (token handled internally)
  getCart: () =>
    fetchJSON(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }),

  addToCart: (productId, quantity = 1) =>
    fetchJSON(`${API_BASE}/cart/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ productId, quantity }),
    }),

  removeFromCart: (productId) =>
    fetchJSON(`${API_BASE}/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    }),

  // Admin endpoints
  adminGetProducts: () =>
    fetchJSON(`${API_BASE}/admin/products`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }),

  adminToggleTrending: (id) =>
    fetchJSON(`${API_BASE}/admin/products/${id}/toggle-trending`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}` 
      },
    }),

  adminUpdateProduct: (id, data) =>
    fetchJSON(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}` 
      },
      body: JSON.stringify(data),
    }),

  adminCreateProduct: (data) =>
    fetchJSON(`${API_BASE}/admin/addProduct`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}` 
      },
      body: JSON.stringify(data),
    }),

  adminDeleteProduct: (id) =>
    fetchJSON(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    }),
};
