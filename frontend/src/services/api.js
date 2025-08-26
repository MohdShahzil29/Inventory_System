import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  search: (name) => api.get(`/products/search?name=${name}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post("/products", product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  import: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/products/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  export: () => api.get("/products/export", { responseType: "blob" }),
  getCategories: () => api.get("/products/categories"),
};

// History API
export const historyAPI = {
  getByProductId: (productId) => api.get(`/history/${productId}`),
  getAll: () => api.get("/history"),
};

export default api;
