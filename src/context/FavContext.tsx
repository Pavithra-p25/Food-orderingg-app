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
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const { fetchFavorites, addFavorite, removeFavorite } = useFavorites();

  // load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  // load favorites from db.json
  useEffect(() => {
    if (!user?.id) return;

    fetchFavorites(user.id).then(setFavorites);
  }, [user]);

  const addToFavorites = async (item: FavoriteItem) => {
    if (!user) return;

    const updatedFavs = await addFavorite(user.id, favorites, item);
    setFavorites(updatedFavs);
  };

  const removeFromFavorites = async (id: string) => {
    if (!user) return;

    const updatedFavs = await removeFavorite(user.id, favorites, id);
    setFavorites(updatedFavs);
  };

  return (
    <FavContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites }}
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
