import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      access_token: null,
      isAuthenticated: false,
      favorites: new Set(),
      setAccessToken: (access_token) => {
        set({
          access_token,
          isAuthenticated: true,
          favorites: new Set()
        });
      },
      setLogout: () =>
        set({
          access_token: null,
          isAuthenticated: false,
        }),
      addFavorite: (imageUrl) =>
        set(state => ({
          favorites: new Set([...state.favorites, imageUrl])
        })),
      removeFavorite: (imageUrl) =>
        set(state => {
          const newFavorites = new Set(state.favorites);
          newFavorites.delete(imageUrl);
          return { favorites: newFavorites };
        }),
      hasFavorite: (imageUrl) => get().favorites.has(imageUrl),
      setFavorites: (favorites) =>
        set({
          favorites: new Set(favorites)
        })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        access_token: state.access_token,
        isAuthenticated: state.isAuthenticated,
        favorites: Array.from(state.favorites)
      }),
    }
  )
);