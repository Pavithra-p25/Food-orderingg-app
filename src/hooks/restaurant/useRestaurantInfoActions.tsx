import type {
  UseFieldArrayReturn,
  UseFormTrigger,
  Control,
} from "react-hook-form";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { defaultRestaurantValues } from "../../pages/restaurant/data/RestaurantInfoDefault";

type HandlersParams = {
  control: Control<RestaurantInfoValues>;
  trigger: UseFormTrigger<RestaurantInfoValues>;
  reset: (values?: RestaurantInfoValues) => void;
};

export const useFormHandlers = ({

  trigger,
  reset,
}: HandlersParams) => {
  /** MENU ITEMS **/
  const addMenuItem = async (
    menuItemsArray: UseFieldArrayReturn<RestaurantInfoValues, "menuItems">,
    setMenuEditable: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => {
    if (menuItemsArray.fields.length >= 3) return;
    const valid = await trigger("menuItems");
    if (valid) {
      menuItemsArray.append({
        itemName: "",
        category: "",
        price: 0,
        file: null,
      });
      setMenuEditable((prev) => [...prev, true]);
    }
  };

  const handleSaveMenuItem = async (
    index: number,
    setMenuEditable: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => {
    const valid = await trigger([
      `menuItems.${index}.itemName`,
      `menuItems.${index}.category`,
      `menuItems.${index}.price`,
    ]);
    if (valid) setMenuEditable((prev) => prev.map((v, i) => (i === index ? false : v)));
  };

  const handleEditMenuItem = (
    index: number,
    setMenuEditable: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => {
    setMenuEditable((prev) => prev.map((v, i) => (i === index ? true : v)));
  };

  /** BRANCHES **/
  const addBranch = async (
    branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">,
    setExpandedBranches: React.Dispatch<React.SetStateAction<number[]>>,
    onBranchAdded: (newIndex: number) => void
  ) => {
    if (branchArray.fields.length >= 3) return;
    const valid = await trigger("branches");
    if (valid) {
      const newIndex = branchArray.fields.length;
      branchArray.append({
        branchName: "",
        branchCode: "",
        complianceDetails: [{ licenseType: "", licenseNumber: "", validFrom: "", validTill: "" }],
      });
      onBranchAdded(newIndex);
      setExpandedBranches((prev) => [...prev, newIndex]);
    }
  };

  /** COMPLIANCE DETAILS **/
  const addLicense = async (
    branchIndex: number,
    complianceArray: UseFieldArrayReturn<RestaurantInfoValues, `branches.${number}.complianceDetails`>,
    setComplianceEditable: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => {
    if (complianceArray.fields.length >= 3) return;
    const valid = await trigger(`branches.${branchIndex}.complianceDetails`);
    if (valid) {
      complianceArray.append({ licenseType: "", licenseNumber: "", validFrom: "", validTill: "" });
      setComplianceEditable((prev) => [...prev, true]);
    }
  };

  const handleSaveCompliance = async (
    branchIndex: number,
    index: number,
    setComplianceEditable: React.Dispatch<React.SetStateAction<boolean[]>>,
  ) => {
    const valid = await trigger([
      `branches.${branchIndex}.complianceDetails.${index}.licenseType`,
      `branches.${branchIndex}.complianceDetails.${index}.licenseNumber`,
      `branches.${branchIndex}.complianceDetails.${index}.validFrom`,
      `branches.${branchIndex}.complianceDetails.${index}.validTill`,
    ]);
    if (valid) setComplianceEditable((prev) => prev.map((v, i) => (i === index ? false : v)));
  };

  const handleEditCompliance = (
    index: number,
    setComplianceEditable: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => {
    setComplianceEditable((prev) => prev.map((v, i) => (i === index ? true : v)));
  };

  /** RESET FORM **/
  const handleReset = (
    setMenuEditable: React.Dispatch<React.SetStateAction<boolean[]>>,
    setExpandedRestaurant: React.Dispatch<React.SetStateAction<boolean>>,
    setExpandedBranches: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    reset(defaultRestaurantValues);
    // reset states
    setMenuEditable(defaultRestaurantValues.menuItems.map(() => true));
    setExpandedRestaurant(false);
    setExpandedBranches([]);
  };

  /** EXPAND / COLLAPSE ALL **/
  const handleExpandAll = (
    expandAll: boolean,
    setExpandAll: React.Dispatch<React.SetStateAction<boolean>>,
    setExpandedRestaurant: React.Dispatch<React.SetStateAction<boolean>>,
    setExpandedBranches: React.Dispatch<React.SetStateAction<number[]>>,
    branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">
  ) => {
    setExpandAll(!expandAll);
    if (!expandAll) {
      setExpandedRestaurant(true);
      setExpandedBranches(branchArray.fields.map((_, i) => i));
    } else {
      setExpandedRestaurant(false);
      setExpandedBranches([]);
    }
  };

  return {
    addMenuItem,
    handleSaveMenuItem,
    handleEditMenuItem,
    addBranch,
    addLicense,
    handleSaveCompliance,
    handleEditCompliance,
    handleReset,
    handleExpandAll,
  };
};
