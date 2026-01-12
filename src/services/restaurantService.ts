import { apiService } from "./apiService";
import type { Restaurant } from "../types/RestaurantTypes";

// get all restaurants
export const getRestaurants = async (): Promise<Restaurant[]> => {
  return await apiService.get<Restaurant[]>("/restaurants");
};

export const getRestaurantById = async (id: string): Promise<Restaurant> => {
  return await apiService.get<Restaurant>(`/restaurants/${id}`);
};

// create new restaurant
export const createRestaurant = async (
  payload: Omit<Restaurant, "id">
): Promise<Restaurant> => {
  return await apiService.post<Restaurant>("/restaurants", payload);
};

export const updateRestaurant = async (
  id: string,
  payload: Partial<Restaurant>
): Promise<Restaurant> => {
  return await apiService.put<Restaurant>(`/restaurants/${id}`, payload);
};

export const softDeleteRestaurant = async (
  id: string,
  payload: Pick<Restaurant, "isActive" | "updatedAt">
): Promise<Restaurant> => {
  return await apiService.patch<Restaurant>(
    `/restaurants/${id}`,
    payload
  );
};

export const activateRestaurant = async (
  id: string,
  payload: Pick<Restaurant, "isActive" | "updatedAt">
): Promise<Restaurant> => {
  return await apiService.patch<Restaurant>(
    `/restaurants/${id}`,
    payload
  );
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  return await apiService.delete(`/restaurants/${id}`);
};
