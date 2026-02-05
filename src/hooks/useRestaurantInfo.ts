import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useCallback } from "react";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import {
  createRestaurantInfo,
  deleteRestaurantInfo,
  getRestaurantInfoList,
  updateRestaurantInfo,
} from "../services/restaurantInfoService";

export const useRestaurantInfo = () => {
  const [restaurantInfoList, setRestaurantInfoList] = useState<
    RestaurantInfoValues[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showBoundary } = useErrorBoundary();

  /* GET ALL */
  const fetchRestaurantInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRestaurantInfoList();
      setRestaurantInfoList(data ?? []);
    } catch (err: any) {
      //  SERVER DOWN -FULL PAGE
      if (err?.isServerDown) {
        showBoundary(err);
        return;
      }

      //  API / DOMAIN ERROR- SNACKBAR
      setError(
        new Error(
          err?.customMessage || "Failed to fetch restaurant information",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [showBoundary]);

  /* CREATE */
  const addRestaurantInfo = async (data: RestaurantInfoValues) => {
    try {
      setLoading(true);
      await createRestaurantInfo(data);
      await fetchRestaurantInfo();
    } catch (err: any) {
      setError(err.message || "Failed to save restaurant info");
      throw err; // form pages may still want to handle this
    } finally {
      setLoading(false);
    }
  };

  /* UPDATE */
  const editRestaurantInfo = async (
    id: string | number,
    data: RestaurantInfoValues,
  ) => {
    try {
      setLoading(true);
      const updated = await updateRestaurantInfo(id, data);

      setRestaurantInfoList((prev) =>
        prev.map((r) => (String(r.id) === String(id) ? updated : r)),
      );
    } catch (err: any) {
      setError(err.message || "Failed to update restaurant info");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* DELETE */
  const removeRestaurantInfo = async (id: string | number) => {
    try {
      setLoading(true);
      await deleteRestaurantInfo(id);

      setRestaurantInfoList((prev) =>
        prev.filter((r) => String(r.id) !== String(id)),
      );
    } catch (err: any) {
      setError(err.message || "Failed to delete restaurant info");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    restaurantInfoList,
    loading,
    error,
    addRestaurantInfo,
    fetchRestaurantInfo,
    editRestaurantInfo,
    removeRestaurantInfo,
  };
};
