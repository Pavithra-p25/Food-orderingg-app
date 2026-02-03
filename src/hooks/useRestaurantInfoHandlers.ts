import React from "react";
import type { UseFormReset } from "react-hook-form";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import { defaultRestaurantValues } from "../pages/restaurantinfo/data/RestaurantInfoDefault";
import { useRestaurantInfo } from "./useRestaurantInfo";
import { useDialogSnackbar } from "../context/DialogSnackbarContext";

export const useRestaurantInfoHandlers = (
  reset: UseFormReset<RestaurantInfoValues>
  
) => {
  const { addRestaurantInfo, fetchRestaurantInfo } = useRestaurantInfo();

  // Accordion state
  const [expandedRestaurant, setExpandedRestaurant] = React.useState(false);
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);
  const [expandAll, setExpandAll] = React.useState(false);
  const { showSnackbar } = useDialogSnackbar(); 

  const handleBranchAdded = (newIndex: number) => {
    setExpandedBranches((prev) => [...prev, newIndex]);
  };

  // Expand/collapse all accordions
  const handleExpandAll = (branchCount: number) => {
    if (expandAll) {
      setExpandedRestaurant(true);
      setExpandedBranches(Array.from({ length: branchCount }, (_, i) => i));
    } else {
      setExpandedRestaurant(false);
      setExpandedBranches([]);
    }
  };

  React.useEffect(() => {
    handleExpandAll(0);
  }, [expandAll]);

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
  };
};
