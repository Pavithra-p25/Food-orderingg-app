import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import type { Dispatch, SetStateAction } from "react";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";
import { useRestaurantInfo } from "../useRestaurantInfo";

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

const { showDialog, showSnackbar } = useDialogSnackbar();

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
// Delete with confirmation dialog
  const handleDelete = (restaurant: RestaurantInfoValues) => {
    showDialog({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete "${restaurant.restaurantName}"?`,
      confirmText: "Yes",
      cancelText: "No",
      maxWidth: "xs",
      onConfirm: async () => {
        try {
          if (!restaurant.id) throw new Error("Missing ID");
          await removeRestaurantInfo(restaurant.id);
          await fetchRestaurantInfo();
          showSnackbar("Restaurant deleted successfully", "success");
        } catch (err) {
          showSnackbar("Failed to delete restaurant", "error");
        }
      },
    });
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
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};
