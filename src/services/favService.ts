import { apiService } from "./apiService";
import type { FavoriteItem } from "../types/userTypes";

export const favService = {
  // get user favorites
  getFavorites: async (userId: string): Promise<FavoriteItem[]> => {
    const user = await apiService.get<any>(`/users/${userId}`);
    return user.favorites || [];
  },

  // update user favorites
  updateFavorites: async (
    userId: string,
    favorites: FavoriteItem[]
  ): Promise<void> => {
    await apiService.patch(`/users/${userId}`, {
      favorites,
    });
  },
};
