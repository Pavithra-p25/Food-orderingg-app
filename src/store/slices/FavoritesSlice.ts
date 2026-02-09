import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FavoriteItem } from "../../types/userTypes";
import { fetchFavorites } from "./FavoritesThunks";

type FavoritesState = {
  items: FavoriteItem[];
  loading: boolean;
};

const initialState: FavoritesState = {
  items: [],
  loading: false,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<FavoriteItem>) {
      state.items.push(action.payload);
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  },
});

export const { addFavorite, removeFavorite } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
