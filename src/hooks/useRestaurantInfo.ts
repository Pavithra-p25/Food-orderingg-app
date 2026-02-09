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
import { handleError } from "../utils/HandleError";
import { useDialogSnackbar } from "../context/DialogSnackbarContext";


export const useRestaurantInfo = () => {
  const [restaurantInfoList, setRestaurantInfoList] = useState<
    RestaurantInfoValues[]
  >([]);
  const [loading, setLoading] = useState(false);
 
  const { showBoundary } = useErrorBoundary();
  const {showSnackbar} = useDialogSnackbar();

  /* GET ALL */
    const fetchRestaurantInfo = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getRestaurantInfoList();
      setRestaurantInfoList(data ?? []);
    } catch (err: any) {
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to fetch restaurant information",
        showSnackbar,
      });
    } finally {
      setLoading(false);
    }
  }, [showBoundary, showSnackbar]);

  /* CREATE */
  const addRestaurantInfo = async (data: RestaurantInfoValues) => {
    try {
      setLoading(true);
      await createRestaurantInfo(data);
      await fetchRestaurantInfo();
    } catch (err: any) {
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to save restaurant info",
        showSnackbar,
      });
      throw err;
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
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to update restaurant info",
        showSnackbar,
      });
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
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to delete restaurant info",
        showSnackbar,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    restaurantInfoList,
    loading,
    addRestaurantInfo,
    fetchRestaurantInfo,
    editRestaurantInfo,
    removeRestaurantInfo,
  };
};
