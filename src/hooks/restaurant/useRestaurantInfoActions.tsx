import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import type { UseFormTrigger, UseFieldArrayReturn } from "react-hook-form";
import React from "react";

/*  MENU HANDLERS  */
export const useMenuActions = (
  trigger: UseFormTrigger<RestaurantInfoValues>,
  menuItemsArray: UseFieldArrayReturn<RestaurantInfoValues, "menuItems">,
) => {
  const [menuEditable, setMenuEditable] = React.useState<boolean[]>(
    menuItemsArray.fields.map(() => true),
  );

  const addMenuItem = async () => {
    const valid = await trigger("menuItems");
    if (!valid) return;

    menuItemsArray.append({
      itemName: "",
      category: "",
      price: 0,
      file: null,
    });

    setMenuEditable((prev) => [...prev, true]);
  };

  const saveMenuItem = async (index: number) => {
    const valid = await trigger([
      `menuItems.${index}.itemName`,
      `menuItems.${index}.category`,
      `menuItems.${index}.price`,
    ]);

    if (valid) {
      setMenuEditable((prev) =>
        prev.map((v, i) => (i === index ? false : v)),
      );
    }
  };

  const editMenuItem = (index: number) => {
    setMenuEditable((prev) =>
      prev.map((v, i) => (i === index ? true : v)),
    );
  };

  const removeMenuItem = (index: number) => {
    menuItemsArray.remove(index);
    setMenuEditable((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    menuEditable,
    addMenuItem,
    saveMenuItem,
    editMenuItem,
    removeMenuItem,
  };
};

/*  BRANCH HANDLERS  */
export const useBranchActions = (
  trigger: UseFormTrigger<RestaurantInfoValues>,
  branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">,
) => {
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);

  const addBranch = async () => {
    if (branchArray.fields.length >= 3) return;

    const valid = await trigger("branches");
    if (!valid) return;

    branchArray.append({
      branchName: "",
      branchCode: "",
      complianceDetails: [
        { licenseType: "", licenseNumber: "", validFrom: "", validTill: "" },
      ],
    });

    setExpandedBranches((prev) => [...prev, branchArray.fields.length]);
  };

  const removeBranch = (index: number) => {
    branchArray.remove(index);
    setExpandedBranches((prev) => prev.filter((i) => i !== index));
  };

  return {
    expandedBranches,
    setExpandedBranches,
    addBranch,
    removeBranch,
  };
};

/* FORM ACTIONS  */
export const useFormActions = (
  reset: (values?: RestaurantInfoValues) => void,
  defaultValues: RestaurantInfoValues,
) => {
  const [resetSnackbarOpen, setResetSnackbarOpen] = React.useState(false);

  const handleReset = () => {
    reset(defaultValues);
    setResetSnackbarOpen(true);
  };

  const onSubmit = (data: RestaurantInfoValues) => {
    console.log("FINAL SUBMIT DATA:", data);
  };

  return {
    handleReset,
    resetSnackbarOpen,
    setResetSnackbarOpen,
    onSubmit,
  };
};
