import { createAsyncThunk } from "@reduxjs/toolkit"; 
//used for api calls , it automatically create pending , fulfilled, rejected actions , no manual create
import { favService } from "../../services/favService";
import type { FavoriteItem } from "../../types/userTypes";

//fetch favorites
export const fetchFavorites = createAsyncThunk(
  "favorites/fetch", // redux dispatch - favorites/fetch/pending 
  async (userId: string) => {
    return await favService.getFavorites(userId); // call api - favorites/fetch/fulfilled , stored in redux
  }
);

export const saveFavorites = createAsyncThunk(
  "favorites/save",
  async ({
    userId,
    favorites,
  }: {
    userId: string;
    favorites: FavoriteItem[];
  }) => {
    await favService.updateFavorites(userId, favorites);
    return favorites;
  }
);
