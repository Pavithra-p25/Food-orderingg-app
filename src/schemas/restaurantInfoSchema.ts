import * as yup from "yup";
import { REQUIRED_ERROR } from "../config/constants/ErrorMessages";

export const restaurantInfoSchema = yup.object({
  restaurantName: yup
    .string()
    .required(`Restaurant name ${REQUIRED_ERROR}`)
    .min(3, "Restaurant name must be at least 3 characters")
    .max(20, "Restaurant name cannot exceed 20 characters"),

  ownerName: yup
    .string()
    .required(`Owner name ${REQUIRED_ERROR}`)
    .min(3, "Owner name must be at least 3 characters")
    .max(20, "Owner name cannot exceed 20 characters"),

  menuItems: yup
    .array()
    .of(
      yup.object({
        itemName: yup.string().required(`Item name ${REQUIRED_ERROR}`),
        category: yup.string().required(`Category ${REQUIRED_ERROR}`),
        price: yup
          .number()
          .typeError("Price must be a number")
          .required("Price is required"),
        file: yup.mixed<File>().nullable().defined(),
      }),
    )
    .required("At least one menu item is required")
    .min(1, "At least one menu item is required"),

  branches: yup
    .array()
    .required()
    .of(
      yup.object({
        branchName: yup
          .string()
          .required(`Branch name ${REQUIRED_ERROR}`)
          .min(3, "Restaurant name must be at least 3 characters")
          .max(20, "Restaurant name cannot exceed 20 characters"),
        branchCode: yup.string().required(`Branch code ${REQUIRED_ERROR}`),
        complianceDetails: yup
          .array()
          .of(
            yup.object({
              licenseType: yup
                .string()
                .required(`License type ${REQUIRED_ERROR}`),
              licenseNumber: yup
                .string()
                .required(`License number ${REQUIRED_ERROR}`),
              validFrom: yup
                .string()
                .required(`Valid from date ${REQUIRED_ERROR}`),
              validTill: yup
                .string()
                .required(`Valid till ${REQUIRED_ERROR}`)
                .test(
                  "is-after-validFrom",
                  "Valid till must be after valid from",
                  function (value) {
                    const { validFrom } = this.parent;

                    if (!validFrom || !value) return true; // let required handle empty

                    return new Date(value) > new Date(validFrom);
                  },
                ),
            }),
          )
          .required(`At least one license ${REQUIRED_ERROR}`)
          .min(1, "At least one license is required"),
      }),
    ),
});
