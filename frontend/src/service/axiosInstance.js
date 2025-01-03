import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_CONFIG } from "../config/api.config";

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupInterceptors = (useAuthStore) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const { access_token, setAccessToken, setLogout } = useAuthStore.getState();
  
      if (access_token) {
        const tokenData = jwtDecode(access_token);
        const isExpired = tokenData.exp * 1000 < Date.now();
        if (isExpired) {
          try {
            const response = await axios.post("/auth/refresh");
            setAccessToken(response.data.access_token);
            config.headers.Authorization = `Bearer ${response.data.access_token}`;
          } catch (error) {
            setLogout();
            window.location.href = "/login";
          }
        } else {
          config.headers.Authorization = `Bearer ${access_token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}