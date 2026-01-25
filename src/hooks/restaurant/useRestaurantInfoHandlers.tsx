import { useState } from "react";
import type {
  UseFieldArrayReturn,
  UseFormTrigger,
} from "react-hook-form";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";

export const useRestaurantInfoHandlers = (
  trigger: UseFormTrigger<RestaurantInfoValues>,
  menuItemsArray: UseFieldArrayReturn<RestaurantInfoValues, "menuItems">,
  branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">,
) => {
  // ===== MENU ITEMS HANDLERS =====
  const [menuEditable, setMenuEditable] = useState<boolean[]>(
    menuItemsArray.fields.map(() => true),
  );

  const addMenuItem = async () => {
    if (menuItemsArray.fields.length >= 3) return;
    const valid = await trigger("menuItems");
    if (valid) {
      menuItemsArray.append({ itemName: "", category: "", price: 0, file: null });
      setMenuEditable((prev) => [...prev, true]);
    }
  };

  const handleSaveMenuItem = async (index: number) => {
    const valid = await trigger([
      `menuItems.${index}.itemName`,
      `menuItems.${index}.category`,
      `menuItems.${index}.price`,
    ]);

    if (valid) {
      setMenuEditable((prev) => prev.map((v, i) => (i === index ? false : v)));
    }
  };

  const handleEditMenuItem = (index: number) => {
    setMenuEditable((prev) => prev.map((v, i) => (i === index ? true : v)));
  };

  // ===== BRANCH & COMPLIANCE HANDLERS =====
  const [complianceEditable, setComplianceEditable] = useState<boolean[][]>(
    branchArray.fields.map((branch) =>
      branch.complianceDetails.map(() => true),
    ),
  );

  const addBranch = async () => {
    if (branchArray.fields.length >= 3) return;
    const valid = await trigger("branches");
    if (valid) {
      branchArray.append({
        branchName: "",
        branchCode: "",
        complianceDetails: [{ licenseType: "", licenseNumber: "", validFrom: "", validTill: "" }],
      });
      setComplianceEditable((prev) => [...prev, [true]]);
    }
  };

  const addLicense = async (branchIndex: number) => {
    const complianceArray = branchArray.fields[branchIndex].complianceDetails;
    if (complianceArray.length >= 3) return;
    const valid = await trigger(`branches.${branchIndex}.complianceDetails`);
    if (valid) {
      branchArray.fields[branchIndex].complianceDetails.push({
        licenseType: "",
        licenseNumber: "",
        validFrom: "",
        validTill: "",
      });
      setComplianceEditable((prev) => {
        const newEditable = [...prev];
        newEditable[branchIndex].push(true);
        return newEditable;
      });
    }
  };

  const handleSaveCompliance = async (branchIndex: number, index: number) => {
    const valid = await trigger([
      `branches.${branchIndex}.complianceDetails.${index}.licenseType`,
      `branches.${branchIndex}.complianceDetails.${index}.licenseNumber`,
      `branches.${branchIndex}.complianceDetails.${index}.validFrom`,
      `branches.${branchIndex}.complianceDetails.${index}.validTill`,
    ]);

    if (valid) {
      setComplianceEditable((prev) => {
        const newEditable = [...prev];
        newEditable[branchIndex][index] = false;
        return newEditable;
      });
    }
  };

  const handleEditCompliance = (branchIndex: number, index: number) => {
    setComplianceEditable((prev) => {
      const newEditable = [...prev];
      newEditable[branchIndex][index] = true;
      return newEditable;
    });
  };

  return {
    // MENU HANDLERS
    menuEditable,
    addMenuItem,
    handleSaveMenuItem,
    handleEditMenuItem,

    // BRANCH & COMPLIANCE HANDLERS
    complianceEditable,
    addBranch,
    addLicense,
    handleSaveCompliance,
    handleEditCompliance,
    setComplianceEditable, // export to handle delete
    setMenuEditable, // export to handle delete
  };
};
