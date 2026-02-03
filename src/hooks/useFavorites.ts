import type { FavoriteItem } from "../types/userTypes";
import { favService } from "../services/favService";

export const useFavorites = () => {
  const fetchFavorites = (userId: string) => {
    return favService.getFavorites(userId);
  };

  const addFavorite = async (
    userId: string,
    favorites: FavoriteItem[],
    item: FavoriteItem
  ) => {
    const updatedFavs = favorites.some((f) => f.id === item.id)
      ? favorites
      : [...favorites, item];

    await favService.updateFavorites(userId, updatedFavs);
    return updatedFavs;
  };

  const removeFavorite = async (
    userId: string,
    favorites: FavoriteItem[],
    id: string
  ) => {
    const updatedFavs = favorites.filter((item) => item.id !== id);

    await favService.updateFavorites(userId, updatedFavs);
    return updatedFavs;
  };

  return {
    fetchFavorites,
    addFavorite,
    removeFavorite,
  };
};

export default useFavorites;
