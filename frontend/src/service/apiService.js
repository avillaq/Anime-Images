import { axiosInstance } from "./axiosInstance";
import { API_CONFIG } from "../config/api.config";

export const login = async ({ username, password }) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.auth.login, { username, password });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const register = async ({ username, password }) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.auth.register, { username, password });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const fetchRandomImage = async (type, tag) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.images.getRandom, { type, tag });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const fetchTags = async () => {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.images.tags);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// TODO: Implement more API service functions 