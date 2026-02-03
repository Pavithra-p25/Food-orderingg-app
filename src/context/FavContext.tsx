import React, { createContext, useContext, useEffect, useState } from "react";
import type { FavoriteItem } from "../types/userTypes";
import useFavorites from "../hooks/useFavorites";

type FavContextType = {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
};

const FavContext = createContext<FavContextType | null>(null);

export const FavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string } | null>(null);

  // load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  const {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
  } = useFavorites(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    }
  }, [user?.id]);

  return (
    <FavContext.Provider
      value={{
        favorites,
        addToFavorites: addFavorite,
        removeFromFavorites: removeFavorite,
      }}
    >
      {children}
    </FavContext.Provider>
  );
};

export const useCartFav = () => {
  const context = useContext(FavContext);
  if (!context) {
    throw new Error("useCartFav must be used inside FavProvider");
  }
  return context;
};
