import { useState } from "react";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import {
  createRestaurantInfo,
  getRestaurantInfoList,
  updateRestaurantInfo,
} from "../services/restaurantInfoService";

export const useRestaurantInfo = () => {
  const [restaurantInfoList, setRestaurantInfoList] = useState<
    RestaurantInfoValues[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* GET ALL */
  const fetchRestaurantInfo = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantInfoList();
      setRestaurantInfoList(data);
    } catch {
      setError("Failed to fetch restaurant info");
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
      setError("Failed to save restaurant info");
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
    } catch {
      setError("Failed to update restaurant info");
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
  };
};
