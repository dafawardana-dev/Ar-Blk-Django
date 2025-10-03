import api from "./api.js";

// It's generally better to export an object containing the methods.
export const ArsipService = {

  getAll: (params) => api.get("/arsip/", { params }),
  create: (data) => api.post("/arsip/", data),
  update: (id, data) => api.put(`/arsip/${id}/`, data),
  delete: (id) => api.delete(`/arsip/${id}/`),
};
