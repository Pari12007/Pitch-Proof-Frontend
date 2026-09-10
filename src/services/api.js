import axios from "axios";

const DEFAULT_API_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://pitch-proof-backend.onrender.com";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || DEFAULT_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
