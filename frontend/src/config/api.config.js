export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
  endpoints: {
    auth: {
      login: "/auth/login/",
      logout: "/auth/logout/",
      register: "/auth/register/",
      refresh: "/auth/refresh/",
    },
    user: {
      getFavorites: "/user/favorites/",
      addFavorites: "/user/favorites/",
      deleteFavorites: "/user/favorites/",
    },
    images: {
      tags: "/images/tags/",
      getRandom: "/images/random/",
      download: "/images/download/",
    }
  }
};