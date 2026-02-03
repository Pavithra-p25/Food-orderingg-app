import { useState } from "react";
import type { FavoriteItem } from "../types/userTypes";
import { favService } from "../services/favService";

export const useFavorites = (userId?: string) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const fetchFavorites = async () => {
    if (!userId) return;

    const favs = await favService.getFavorites(userId);
    setFavorites(favs);
  };

  const addFavorite = async (item: FavoriteItem) => {
    if (!userId) return;

    const updatedFavs = favorites.some((f) => f.id === item.id)
      ? favorites
      : [...favorites, item];

    setFavorites(updatedFavs);
    await favService.updateFavorites(userId, updatedFavs);
  };

  const removeFavorite = async (id: string) => {
    if (!userId) return;

    const updatedFavs = favorites.filter((item) => item.id !== id);

    setFavorites(updatedFavs);
    await favService.updateFavorites(userId, updatedFavs);
  };

  return {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
  };
};

export default useFavorites;
