import { configureStore } from "@reduxjs/toolkit"; //to create redux store
import favoritesReducer from "./slices/FavoritesSlice";

//redux store
export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});

//when reducer change , it updates state 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
