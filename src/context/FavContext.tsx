import React, { createContext, useContext, useEffect, useState } from "react";
import type { FavoriteItem } from "../types/userTypes";

type FavContextType = {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
};

const FavContext = createContext<FavContextType | null>(null);
export const FavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Detect logged-in user on mount or when user changes
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  // Load favorites whenever user changes
  useEffect(() => {
    if (!user?.id) return;

    const savedFav = localStorage.getItem(`fav_${user.id}`);
    setFavorites(savedFav ? JSON.parse(savedFav) : []);
  }, [user]);

  // Save favorites whenever favorites change
  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(`fav_${user.id}`, JSON.stringify(favorites));
  }, [favorites, user]);

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item]
    );
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <FavContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavContext.Provider>
  );
};

export const useCartFav = () => {
  const context = useContext(FavContext);
  if (!context) {
    throw new Error("useCartFav must be used inside CartFavProvider");
  }
  return context;
};
