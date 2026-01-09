import { apiService } from "./apiService";
import type { Restaurant } from "../types/RestaurantTypes";


// api functions 
export const getRestaurants = async (): Promise<Restaurant[]> => {
  const data = await apiService.get<Restaurant[]>("/restaurants");
  return data;
};

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
  const data = await apiService.get<Restaurant>(`/restaurants/${id}`);
  return data;
};

// new registered restaurant
export const createRestaurant = async (
  payload: Restaurant
): Promise<Restaurant> => {
  const data = await apiService.post<Restaurant>("/restaurants", payload);
  return data;
};

// update existing restaurant
export const updateRestaurant = async (
  id: number,
  payload: Restaurant
): Promise<Restaurant> => {
  const data = await apiService.put<Restaurant>(`/restaurants/${id}`, payload);
  return data;
};

//deactivate / soft delete -  isActive: false
export const softDeleteRestaurant = async (
  id: number,
  payload: Partial<Restaurant>
): Promise<Restaurant> => {
  const data = await apiService.patch<Restaurant>(
    `/restaurants/${id}`,
    payload
  );
  return data;
};

//restore / enable - isActive: true
export const activateRestaurant = async (
  id: number,
  payload: Partial<Restaurant>
): Promise<Restaurant> => {
  const data = await apiService.patch<Restaurant>(
    `/restaurants/${id}`,
    payload
  );
  return data;
};

