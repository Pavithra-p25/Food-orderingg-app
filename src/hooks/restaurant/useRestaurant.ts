import { useCallback, useState } from "react";
import * as restaurantService from "../../services/restaurantService";
import type { Restaurant } from "../../types/RestaurantTypes";
import { useErrorBoundary } from "react-error-boundary";
import { handleError } from "../../utils/HandleError";

const nowISO = () => new Date().toISOString(); //return current date and time in iso format

//data transfer object , user does not send id , dates , status (system controlled), so removed using omit
export type CreateRestaurantDTO = Omit<
  Restaurant,
  "id" | "createdAt" | "updatedAt" | "isActive"
>;

//user may update only some fields , so fields are optional (partial)
type UpdateRestaurantDTO = Partial<CreateRestaurantDTO>;
export const useRestaurants = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { showBoundary } = useErrorBoundary();
  const getAllRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await restaurantService.getRestaurants();
      return data ?? [];
    } catch (err: any) {
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to fetch restaurant list",
      });
      return[];
    } finally {
      setLoading(false);
    }
  }, [showBoundary]);

  const getRestaurantDetails = useCallback(
    async (id: string) => {
      try {
        const data = await restaurantService.getRestaurantById(id);
        return data ?? null;
      } catch (err: any) {
        handleError({
          error: err,
          showBoundary,
          fallbackMessage: "Failed to fetch restaurant details",
        });

        return null;
      }
    },
    [showBoundary],
  );

 const addRestaurant = useCallback(
  async (formData: CreateRestaurantDTO): Promise<Restaurant | null> => {
    try {
      const now = nowISO();
      return await restaurantService.createRestaurant({
        ...formData,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    } catch (err: any) {
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to create restaurant",
      });
      return null;
    }
  },
  [showBoundary],
);


  const updateRestaurant = useCallback(
    async (id: string, formData: UpdateRestaurantDTO) => {
      try {
        return await restaurantService.updateRestaurant(id, {
          ...formData,
          updatedAt: nowISO(),
        });
      } catch (err: any) {
        handleError({
          error: err,
          showBoundary,
          fallbackMessage: "Failed to update restaurant",
        });
      }
    },
    [showBoundary],
  );

  const softDeleteRestaurant = useCallback(
    async (id: string) => {
      try {
        return await restaurantService.softDeleteRestaurant(id, {
          isActive: false,
          updatedAt: nowISO(),
        });
      } catch (err: any) {
        handleError({
          error: err,
          showBoundary,
          fallbackMessage: "Failed to deactivate restaurant",
        });
      }
    },
    [showBoundary],
  );

  const activateRestaurant = useCallback(
    async (id: string) => {
      try {
        return await restaurantService.activateRestaurant(id, {
          isActive: true,
          updatedAt: nowISO(),
        });
      } catch (err: any) {
        handleError({
          error: err,
          showBoundary,
          fallbackMessage: "Failed to activate restaurant",
        });
      }
    },
    [showBoundary],
  );

  const deleteRestaurant = useCallback(
    async (id: string) => {
      try {
        return await restaurantService.deleteRestaurant(id);
      } catch (err: any) {
        handleError({
          error: err,
          showBoundary,
          fallbackMessage: "Failed to delete restaurant",
        });
      }
    },
    [showBoundary],
  );

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
