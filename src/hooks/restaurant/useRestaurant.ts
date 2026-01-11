import * as restaurantService from "../../services/restaurantService";
import type { Restaurant } from "../../types/RestaurantTypes";

const nowISO = () => new Date().toISOString();

export const useRestaurants = () => {
  const getAllRestaurants = async () => {
    try {
      const data = await restaurantService.getRestaurants();
      return data ?? [];
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      return [];
    }
  };

  const getRestaurantDetails = async (id: string) => {
    try {
      const data = await restaurantService.getRestaurantById(id);
      return data ?? null;
    } catch (error) {
      console.error("Failed to fetch restaurant details:", error);
      return null;
    }
  };

  const addRestaurant = async (formData: Restaurant) => {
    try {
      const now = nowISO();

      const payload: Restaurant = {
        ...formData,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      return await restaurantService.createRestaurant(payload);
    } catch (error) {
      console.error("Failed to save restaurant:", error);
      throw error;
    }
  };

  
  const updateRestaurant = async (id: string, formData: Restaurant) => {
    try {
      return await restaurantService.updateRestaurant(id, {
        ...formData,
        updatedAt: nowISO(),
      });
    } catch (error) {
      console.error("Failed to update restaurant:", error);
      throw error;
    }
  };

  
  const softDeleteRestaurant = async (id: string) => {
    try {
      return await restaurantService.softDeleteRestaurant(id, {
        isActive: false,
        updatedAt: nowISO(),
      });
    } catch (error) {
      console.error("Failed to soft delete restaurant:", error);
      throw error;
    }
  };

  
  const activateRestaurant = async (id: string) => {
    try {
      return await restaurantService.activateRestaurant(id, {
        isActive: true,
        updatedAt: nowISO(),
      });
    } catch (error) {
      console.error("Failed to activate restaurant:", error);
      throw error;
    }
  };

  return {
    getAllRestaurants,
    getRestaurantDetails,
    addRestaurant,
    updateRestaurant,
    softDeleteRestaurant,
    activateRestaurant,
  };
};

export default useRestaurants;
