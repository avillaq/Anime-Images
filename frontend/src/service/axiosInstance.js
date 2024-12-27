import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { access_token } = useAuthStore();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);