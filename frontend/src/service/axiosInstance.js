import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_CONFIG } from "../config/api.config";

const refreshInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
});

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (useAuthStore) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && error.response?.data?.error === "ExpiredRefreshError") {
        const { setLogout } = useAuthStore.getState();
        setLogout();
        console.log("ExpiredRefreshError");
      }
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.request.use(
    async (config) => {
      const { access_token, setAccessToken } = useAuthStore.getState();
  
      if (access_token) {
        const tokenData = jwtDecode(access_token);
        const isExpired = tokenData.exp * 1000 < Date.now();
        
        if (isExpired) {
          if (!isRefreshing) {
            isRefreshing = true;
            
            try {
              const response = await refreshInstance.post(
                API_CONFIG.endpoints.auth.refresh,
                {},
                { headers: { Authorization: `Bearer ${access_token}` }}
              );
              const newToken = response.data.access_token;
              setAccessToken(newToken);
              processQueue(null, newToken);
              return { ...config, headers: { ...config.headers, Authorization: `Bearer ${newToken}` }};
            } catch (error) {
              console.log(error);
              processQueue(error, null);
              return Promise.reject(error);
            } finally {
              isRefreshing = false;
            }
          }

          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` }};
          }).catch(err => {
            return Promise.reject(err);
          });
        }
        
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};