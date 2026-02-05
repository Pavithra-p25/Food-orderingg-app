import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import {
  createRestaurantInfo,
  deleteRestaurantInfo,
  getRestaurantInfoList,
  updateRestaurantInfo,
} from "../services/restaurantInfoService";

export const useRestaurantInfo = () => {
  const { showBoundary } = useErrorBoundary();
  const [restaurantInfoList, setRestaurantInfoList] = useState<
    RestaurantInfoValues[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /* GET ALL */
  const fetchRestaurantInfo = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantInfoList();
      setRestaurantInfoList(data);
    } catch (err: any) {
      const errorObj = new Error("Failed to fetch restaurant info");

      setError(errorObj);
      showBoundary(errorObj);
    } finally {
      setLoading(false);
    }
  };

  /* CREATE */
  const addRestaurantInfo = async (data: RestaurantInfoValues) => {
    try {
      setLoading(true);
      await createRestaurantInfo(data);
      await fetchRestaurantInfo(); // refresh list
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Failed to save restaurant info");
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
        prev.map((r) => (r.id === id ? updated : r)),
      );
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Failed to update restaurant info");
    } finally {
      setLoading(false);
    }
  };

  /* DELETE */
  const removeRestaurantInfo = async (id: string | number) => {
    try {
      setLoading(true);
      await deleteRestaurantInfo(id);

      // update UI
      setRestaurantInfoList((prev) =>
        prev.filter((r) => String(r.id) !== String(id)),
      );

     
      await fetchRestaurantInfo();
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
