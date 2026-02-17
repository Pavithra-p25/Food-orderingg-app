import React from "react";
import type { UseFormReset, FormState } from "react-hook-form";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { defaultRestaurantValues } from "../../pages/restaurantinfo/data/RestaurantInfoDefault";
import { useRestaurantInfo } from "./useRestaurantInfo";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";

interface UseRestaurantInfoHandlersProps {
  reset: UseFormReset<RestaurantInfoValues>;
  formState: FormState<RestaurantInfoValues>;
  branchCount: number;
  initialData?: RestaurantInfoValues; // For edit mode
}

export const useRestaurantInfoHandlers = ({
  reset,
  formState,
  branchCount,
  initialData,
}: UseRestaurantInfoHandlersProps) => {
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
      setExpandedBranches(Array.from({ length: branchCount }, (_, i) => i));
    } else {
      setExpandedRestaurant(false);
      setExpandedBranches([]);
    }
  };

  // Reset form
 // Reset form — only dirty fields
const handleReset = () => {
  const dirty = Object.keys(formState.dirtyFields);

  if (dirty.length === 0) {
    showSnackbar("No changes made", "info");
    return;
  }

  const valuesToReset: Partial<RestaurantInfoValues> = {};

  dirty.forEach((key) => {
    valuesToReset[key as keyof RestaurantInfoValues] = initialData
      ? (initialData as any)[key]
      : defaultRestaurantValues[key as keyof RestaurantInfoValues];
  });

  reset(valuesToReset);
  showSnackbar("Changes reverted", "success");
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
