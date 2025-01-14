import { axiosInstance } from "./axiosInstance";
import { API_CONFIG } from "../config/api.config";

export const logIn = async ({ username, password }) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.auth.login, { username, password });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const signUp = async ({ username, password }) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.auth.register, { username, password });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const logOut = async () => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.auth.logout);
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

export const downloadImage = async (imageUrl) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.images.download,
      { image_url: imageUrl },
      {
        responseType: 'blob'
      });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchFavorites = async () => {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.user.getFavorites);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const fetchFavorite = async (imageUrl) => {
  try {
    const encodedUrl = encodeURIComponent(imageUrl);
    const response = await axiosInstance.get(`${API_CONFIG.endpoints.user.getFavorites}/${encodedUrl}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const addToFavorites = async (imageUrl) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.user.addFavorites, { image_url: imageUrl });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const removeFromFavorites = async (imageUrl) => {
  try {
    const encodedUrl = encodeURIComponent(imageUrl);
    const response = await axiosInstance.delete(`${API_CONFIG.endpoints.user.deleteFavorites}/${encodedUrl}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};