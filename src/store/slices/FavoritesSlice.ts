import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FavoriteItem } from "../../types/userTypes";
import { fetchFavorites } from "./FavoritesThunks";

type FavoritesState = {
  items: FavoriteItem[];
  loading: boolean;
  error: string | null;
};

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error:null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    //instant ui actions
    addFavorite(state, action: PayloadAction<FavoriteItem>) {
      state.items.push(action.payload);
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      //api call started
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      //api call success
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      //api call failed - throw error
      .addCase(fetchFavorites.rejected, (state,action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to load favorites";
      });
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer; //used in store
