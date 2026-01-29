import React from "react";
import { useFieldArray } from "react-hook-form";
import type {
  Control,
  UseFieldArrayReturn,
  UseFormTrigger,
} from "react-hook-form";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import { MAX_BRANCHES, MAX_COMPLIANCE , canAddItem} from "../config/constants/RestaurantConstant";


/*   BRANCH HANDLERS */
export const useBranchAccordionHandlers = (
  
  branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">,
  trigger: UseFormTrigger<RestaurantInfoValues>,
  onBranchAdded: (index: number) => void,
) => {
  const addBranch = async () => {
   if (!canAddItem(branchArray.fields.length, MAX_BRANCHES)) return;
  const valid = await trigger("branches");
    if (valid) {
      const newIndex = branchArray.fields.length;
      branchArray.append({
        branchName: "",
        branchCode: "",
        complianceDetails: [
          {
            licenseType: "",
            licenseNumber: "",
            validFrom: "",
            validTill: "",
          },
        ],
      });
      onBranchAdded(newIndex);
    }
  };

  const removeBranch = (index: number) => {
    branchArray.remove(index);
  };

  return {
    addBranch,
    removeBranch,
  };
};


/* COMPLIANCE HANDLERS */
export const useComplianceAccordionHandlers = (
  control: Control<RestaurantInfoValues>,
  branchIndex: number,
  trigger: UseFormTrigger<RestaurantInfoValues>,
) => {
  const complianceArray = useFieldArray({
    control,
    name: `branches.${branchIndex}.complianceDetails`,
  });

  const [complianceEditable, setComplianceEditable] = React.useState<boolean[]>(
    complianceArray.fields.map(() => true),
  );

  const addLicense = async () => {
      if (!canAddItem(complianceArray.fields.length, MAX_COMPLIANCE)) return;

    const valid = await trigger(
      `branches.${branchIndex}.complianceDetails`,
    );

    if (valid) {
      complianceArray.append({
        licenseType: "",
        licenseNumber: "",
        validFrom: "",
        validTill: "",
      });
      setComplianceEditable((prev) => [...prev, true]);
    }
  };

  const saveLicense = async (index: number) => {
    const valid = await trigger([
      `branches.${branchIndex}.complianceDetails.${index}.licenseType`,
      `branches.${branchIndex}.complianceDetails.${index}.licenseNumber`,
      `branches.${branchIndex}.complianceDetails.${index}.validFrom`,
      `branches.${branchIndex}.complianceDetails.${index}.validTill`,
    ]);

    if (valid) {
      setComplianceEditable((prev) =>
        prev.map((v, i) => (i === index ? false : v)),
      );
    }
  };

  const editLicense = (index: number) => {
    setComplianceEditable((prev) =>
      prev.map((v, i) => (i === index ? true : v)),
    );
  };

  const removeLicense = (index: number) => {
    complianceArray.remove(index);
    setComplianceEditable((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  
  return {
    complianceArray,
    complianceEditable,
    addLicense,
    saveLicense,
    editLicense,
    removeLicense,
  };
};
