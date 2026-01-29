import React from "react";
import type { UseFormReset } from "react-hook-form";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import { defaultRestaurantValues } from "../pages/restaurant/data/RestaurantInfoDefault";
import { useRestaurantInfo } from "./useRestaurantInfo";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

export const useRestaurantInfoHandlers = (
  reset: UseFormReset<RestaurantInfoValues>
  
) => {
  const { addRestaurantInfo, fetchRestaurantInfo } = useRestaurantInfo();

  // Accordion state
  const [expandedRestaurant, setExpandedRestaurant] = React.useState(false);
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);
  const [expandAll, setExpandAll] = React.useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

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
    setSnackbar({
      open: true,
      message: "Form reset successfully",
      severity: "success",
    });
  };

  // Form submit
  const handleSubmitForm = async (data: RestaurantInfoValues) => {
    try {
      await addRestaurantInfo(data);
      await fetchRestaurantInfo();
      setSnackbar({
        open: true,
        message: "Form submitted successfully!",
        severity: "success",
      });
      reset(defaultRestaurantValues);
    } catch {
      setSnackbar({
        open: true,
        message: "Submission failed!",
        severity: "error",
      });
    }
  };

  return {
    expandedRestaurant,
    setExpandedRestaurant,
    expandedBranches,
    setExpandedBranches,
    expandAll,
    setExpandAll,
    snackbar,
    setSnackbar,
    handleBranchAdded,
    handleReset,
    handleSubmitForm,
  };
};
