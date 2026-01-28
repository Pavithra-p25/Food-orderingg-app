import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import type { Dispatch, SetStateAction } from "react";
import { useRestaurantInfo } from "../../hooks/useRestaurantInfo";

interface HandlersProps {
  setEditingRestaurant: Dispatch<SetStateAction<RestaurantInfoValues | null>>;
  setPreviewRestaurant: Dispatch<SetStateAction<RestaurantInfoValues | null>>;
  setDeleteRestaurant: Dispatch<SetStateAction<RestaurantInfoValues | null>>;
   deleteRestaurant: RestaurantInfoValues | null;
}

export const useRestaurantListHandlers = ({
  setEditingRestaurant,
  setPreviewRestaurant,
  setDeleteRestaurant,
  deleteRestaurant,
}: HandlersProps) => {
  const { fetchRestaurantInfo, removeRestaurantInfo } = useRestaurantInfo();

  const handleEdit = (restaurant: RestaurantInfoValues) => {
    setEditingRestaurant(restaurant);
  };

  const handleEditSuccess = async () => {
    await fetchRestaurantInfo();
    setEditingRestaurant(null);
  };

  const handlePreview = (restaurant: RestaurantInfoValues) => {
    setPreviewRestaurant(restaurant);
  };

  const handlePreviewClose = () => {
    setPreviewRestaurant(null);
  };

  const handleDeleteClick = (restaurant: RestaurantInfoValues) => {
    setDeleteRestaurant(restaurant);
  };

  const handleDeleteCancel = () => {
    setDeleteRestaurant(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRestaurant?.id) return;
    await removeRestaurantInfo(deleteRestaurant.id);
    setDeleteRestaurant(null);
  };

  return {
    handleEdit,
    handleEditSuccess,
    handlePreview,
    handlePreviewClose,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};
