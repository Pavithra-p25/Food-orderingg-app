import React, { createContext, useContext, useState, useEffect } from "react";

type Item = {
  id: number;
  name: string;
  price?: number;
  image?: string;
};

type CartFavContextType = {
  cart: Item[];
  favorites: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (id: number) => void;
  addToFavorites: (item: Item) => void;
  removeFromFavorites: (id: number) => void;
};

const CartFavContext = createContext<CartFavContextType | null>(null);

export const CartFavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  const [cart, setCart] = useState<Item[]>([]);
  const [favorites, setFavorites] = useState<Item[]>([]);

  //  Load per-user data
  useEffect(() => {
    if (!userId) return;

    const savedCart = localStorage.getItem(`cart_${userId}`);
    const savedFav = localStorage.getItem(`fav_${userId}`);

    setCart(savedCart ? JSON.parse(savedCart) : []);
    setFavorites(savedFav ? JSON.parse(savedFav) : []);
  }, [userId]);

  //  Save per-user cart
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart, userId]);

  //  Save per-user favorites
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`fav_${userId}`, JSON.stringify(favorites));
    }
  }, [favorites, userId]);

  const addToCart = (item: Item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const addToFavorites = (item: Item) => {
    setFavorites((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item]
    );
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <CartFavContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </CartFavContext.Provider>
  );
};

export const useCartFav = () => {
  const context = useContext(CartFavContext);
  if (!context) {
    throw new Error("useCartFav must be used inside CartFavProvider");
  }
  return context;
};
