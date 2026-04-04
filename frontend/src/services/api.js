// src/services/api.js

import axios from "axios";

// =========================
// 🌐 BASE URL (SAFE)
// =========================
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://eoffice-97mv.onrender.com"; // fallback

// =========================
// 🚀 AXIOS INSTANCE
// =========================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// 🔐 REQUEST INTERCEPTOR
// =========================
API.interceptors.request.use(
  (config) => {
    try {
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;

      // ✅ Handle both cases
      const token = user?.access_token || user?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token parse error:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// ❌ RESPONSE INTERCEPTOR
// =========================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data ||
      error.message;

    console.error("API Error:", message);

    // 🔥 Auto logout if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("user");

      // prevent infinite reload loop
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

// =========================
// 📦 EXPORT
// =========================
export default API;