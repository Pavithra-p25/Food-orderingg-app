import { useState, useEffect } from "react";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import {
  createRestaurantInfo,
  getRestaurantInfoList,
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
    } catch (err) {
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

  /* AUTO FETCH ON LOAD */
  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  return {
    restaurantInfoList,
    loading,
    error,
    addRestaurantInfo,
    fetchRestaurantInfo,
  };
};
