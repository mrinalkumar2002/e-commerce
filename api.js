// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1900/api", // ensure this is your backend base
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[api] Token attached (ok)");
  } else {
    console.log("[api] NO TOKEN");
  }
  return config;
}, (err) => Promise.reject(err));

export default api;






