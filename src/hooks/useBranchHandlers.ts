import React from "react";
import { useFieldArray } from "react-hook-form";
import type {
  Control,
  UseFieldArrayReturn,
  UseFormTrigger,
} from "react-hook-form";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import { MAX_BRANCHES, MAX_COMPLIANCE } from "../config/constants/RestaurantConstant";
import { canAddItem } from "../utils/canAddItem";

/*   BRANCH HANDLERS */
export const useBranchAccordionHandlers = (
  
  branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">,
  trigger: UseFormTrigger<RestaurantInfoValues>,
  onBranchAdded: (index: number) => void,
) => {
 const addBranch = async (setComplianceEditable: (editable: boolean[]) => void) => {
  if (!canAddItem(branchArray.fields.length, MAX_BRANCHES)) return;

  const valid = await trigger(`branches.${branchArray.fields.length - 1}`);
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

    // force first license of new branch editable
    setTimeout(() => {
      setComplianceEditable([true]); // only for this new branch
      onBranchAdded(newIndex);
    }, 0);
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
  isEditMode: boolean,
  forceEditableForNew: boolean = false // <-- new flag
) => {
  const complianceArray = useFieldArray({
    control,
    name: `branches.${branchIndex}.complianceDetails`,
  });

  const [complianceEditable, setComplianceEditable] = React.useState<boolean[]>(
    () => complianceArray.fields.map(() => forceEditableForNew || !isEditMode)
  );

  // Sync editable state whenever fields change
  React.useEffect(() => {
    setComplianceEditable((prev) =>
      complianceArray.fields.map((_, index) =>
        prev[index] !== undefined ? prev[index] : true
      )
    );
  }, [complianceArray.fields.length]);

  const addLicense = async () => {
    if (!canAddItem(complianceArray.fields.length, MAX_COMPLIANCE)) return;

    const valid = await trigger(
      `branches.${branchIndex}.complianceDetails`
    );

    if (valid) {
      complianceArray.append({
        licenseType: "",
        licenseNumber: "",
        validFrom: "",
        validTill: "",
      });

      // Make new license editable
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
        prev.map((v, i) => (i === index ? false : v))
      );
    }
  };

  const editLicense = (index: number) => {
    setComplianceEditable((prev) =>
      prev.map((v, i) => (i === index ? true : v))
    );
  };

  const removeLicense = (index: number) => {
    complianceArray.remove(index);
    setComplianceEditable((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return {
    complianceArray,
    complianceEditable,
    addLicense,
    saveLicense,
    editLicense,
    removeLicense,
    setComplianceEditable,
  };
};
