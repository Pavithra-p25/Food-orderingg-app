import * as restaurantService  from "../../services/restaurantService";
import type { Restaurant } from "../../types/RestaurantTypes";

export const useRestaurants = () => {
  const getAllRestaurants = async () => {
    try {
      const data = await restaurantService.getRestaurants();
      return data ?? []; // if data is null/undefined, return empty array
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      return []; 
    }
  };

  const getRestaurantDetails = async (id: number | string) => {
    try {
      const data = await restaurantService.getRestaurantById(Number(id));
      return data ?? null; // if no data, return null
    } catch (error) {
      console.error("Failed to fetch restaurant details:", error);
      return null; 
    }
  };
 
//add new restaurant
  const addRestaurant = async (formData: Restaurant) => {
    try {
      const data = await restaurantService.createRestaurant(formData);
      return data;
    } catch (error) {
      console.error("Failed to save restaurant:", error);
      throw error;
    }
  };

 //  update restaurant
  const updateRestaurant = async (id: number, formData: Restaurant) => {
    try {
      return await restaurantService.updateRestaurant(id, formData);
    } catch (error) {
      console.error("Failed to update restaurant:", error);
      throw error;
    }
  };

   const softDeleteRestaurant = async (id: number) => {
    try {
      return await restaurantService.softDeleteRestaurant(id, {
        isActive: false,
      });
    } catch (error) {
      console.error("Failed to soft delete restaurant:", error);
      throw error;
    }
  };

  return {
    getAllRestaurants,
    getRestaurantDetails,
    addRestaurant,
    updateRestaurant,
    softDeleteRestaurant
  };
};

export default useRestaurants;
