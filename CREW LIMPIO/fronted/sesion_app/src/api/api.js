import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔹 Interceptor para manejar errores globales (opcional pero recomendado)
api.interceptors.response.use(
  response => response,
  error => {
    console.error("Error en API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;