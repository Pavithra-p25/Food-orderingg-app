import { useCallback, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import * as restaurantService from "../../services/restaurantService";
import type { Restaurant } from "../../types/RestaurantTypes";

const nowISO = () => new Date().toISOString(); //return current date and time in iso format

//data transfer object , user does not send id , dates , status (system controlled), so removed using omit
export type CreateRestaurantDTO = Omit<
  Restaurant,
  "id" | "createdAt" | "updatedAt" | "isActive"
>;

//user may update only some fields , so fields are optional (partial)
type UpdateRestaurantDTO = Partial<CreateRestaurantDTO>;
export const useRestaurants = () => {
  const { showBoundary } = useErrorBoundary();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await restaurantService.getRestaurants();
      return data ?? [];
    } catch (err: any) {
      const errorObj = new Error("Failed to get restaurants");
      // Trigger global ErrorBoundary for  fetch errors
      showBoundary(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [showBoundary]);

  const getRestaurantDetails = useCallback(
    async (id: string) => {
      try {
        const data = await restaurantService.getRestaurantById(id);
        return data ?? null;
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
        showBoundary(error);
        return null;
      }
    },
    [showBoundary],
  );

  const addRestaurant = useCallback(async (formData: CreateRestaurantDTO) => {
    try {
      const now = nowISO();

      const payload = {
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
  }, []);

  const updateRestaurant = useCallback(
    async (id: string, formData: UpdateRestaurantDTO) => {
      try {
        return await restaurantService.updateRestaurant(id, {
          ...formData,
          updatedAt: nowISO(),
        });
      } catch (error) {
        console.error("Failed to update restaurant:", error);
        throw error;
      }
    },
    [],
  );

  const softDeleteRestaurant = useCallback(async (id: string) => {
    try {
      return await restaurantService.softDeleteRestaurant(id, {
        isActive: false,
        updatedAt: nowISO(),
      });
    } catch (error) {
      console.error("Failed to soft delete restaurant:", error);
      throw error;
    }
  }, []);

  const activateRestaurant = useCallback(async (id: string) => {
    try {
      return await restaurantService.activateRestaurant(id, {
        isActive: true,
        updatedAt: nowISO(),
      });
    } catch (error) {
      console.error("Failed to activate restaurant:", error);
      throw error;
    }
  }, []);

  const deleteRestaurant = useCallback(async (id: string) => {
    try {
      return await restaurantService.deleteRestaurant(id);
    } catch (error) {
      console.error("Failed to delete restaurant permanently:", error);
      throw error;
    }
  }, []);

  return {
    getAllRestaurants,
    getRestaurantDetails,
    addRestaurant,
    loading,
    error,
    updateRestaurant,
    softDeleteRestaurant,
    activateRestaurant,
    deleteRestaurant,
  };
};

export default useRestaurants;
