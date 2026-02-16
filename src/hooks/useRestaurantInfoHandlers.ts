import React from "react";
import type { UseFormReset } from "react-hook-form";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import { defaultRestaurantValues } from "../pages/restaurantinfo/data/RestaurantInfoDefault";
import { useRestaurantInfo } from "./useRestaurantInfo";
import { useDialogSnackbar } from "../context/DialogSnackbarContext";

export const useRestaurantInfoHandlers = (
  reset: UseFormReset<RestaurantInfoValues>,
   branchCount: number
) => {
  const { addRestaurantInfo, fetchRestaurantInfo } = useRestaurantInfo();

  // Accordion state
  const [expandedRestaurant, setExpandedRestaurant] = React.useState(true);
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);
  const [expandAll, setExpandAll] = React.useState(false);
  const { showSnackbar } = useDialogSnackbar(); 
 

  const handleBranchAdded = (newIndex: number) => {
    setExpandedBranches((prev) => [...prev, newIndex]);
  };

  const handleToggleExpandAll = () => {
  const newValue = !expandAll;
  setExpandAll(newValue);

  if (newValue) {
    setExpandedRestaurant(true);
    setExpandedBranches(
      Array.from({ length: branchCount }, (_, i) => i)
    );
  } else {
    setExpandedRestaurant(false);
    setExpandedBranches([]);
  }
};

  // Reset form
  const handleReset = () => {
    reset(defaultRestaurantValues);
    showSnackbar("Form reset successfully", "success");
  };

  // Form submit
  const handleSubmitForm = async (data: RestaurantInfoValues) => {
    try {
      await addRestaurantInfo(data);
      await fetchRestaurantInfo();
      showSnackbar("Form submitted successfully!", "success"); 
      reset(defaultRestaurantValues);
    } catch {
      showSnackbar("Submission failed!", "error");
    }
  };

  return {
    expandedRestaurant,
    setExpandedRestaurant,
    expandedBranches,
    setExpandedBranches,
    expandAll,
    setExpandAll,
    handleBranchAdded,
    handleReset,
    handleSubmitForm,
    handleToggleExpandAll,
  };
};
