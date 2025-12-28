import { apiService } from "./apiService";
import type { Restaurant } from "../types/types";

// api functions 
export const getRestaurants = async (): Promise<Restaurant[]> => {
  const data = await apiService.get<Restaurant[]>("/restaurants");
  return data;
};

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
  const data = await apiService.get<Restaurant>(`/restaurants/${id}`);
  return data;
};
