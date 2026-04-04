// src/services/api.js

import axios from "axios";

// =========================
// 🌐 BASE URL FROM ENV
// =========================
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
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
    console.error("API Error:", error.response?.data || error.message);

    // 🔥 Auto logout if unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;