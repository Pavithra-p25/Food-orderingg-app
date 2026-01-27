import * as yup from "yup";
import { REQUIRED_ERROR } from "../config/constants/ErrorMessages";
import { NAME_REGEX } from "../config/constants/ValidationRegex";

export const restaurantInfoSchema = yup.object({
  restaurantName: yup
    .string()
    .required(`Restaurant name ${REQUIRED_ERROR}`)
    .min(3, "Restaurant name must be at least 3 characters")
    .max(30, "Restaurant name cannot exceed 30 characters")
    .matches(NAME_REGEX, "Cannot contain numbers or special characters"),

  ownerName: yup
    .string()
    .required(`Owner name ${REQUIRED_ERROR}`)
    .min(3, "Owner name must be at least 3 characters")
    .max(30, "Owner name cannot exceed 30 characters")
    .matches(NAME_REGEX, "Cannot contain numbers or special characters"),

  menuItems: yup
    .array()
    .of(
      yup.object({
        itemName: yup
          .string()
          .required(`Item name ${REQUIRED_ERROR}`)
          .min(3, "Item name must be at least 3 characters")
          .max(30, "Item name cannot exceed 30 characters"),
        category: yup
          .string()
          .required("Category is required")
          .notOneOf([""], "Category is required"),
        price: yup
          .number()
          .nullable()
          .typeError("Price must be a number")
          .required("Price is required")
          .moreThan(0, "Price must be greater than 0"),
        file: yup
          .mixed<File>()
          .nullable()
          .defined()
          .test("fileSize", "File size must be less than 2MB", (file) => {
            return !file || (file && file.size <= 2 * 1024 * 1024);
          })
          .test("fileType", "Unsupported file format", (file) => {
            return (
              !file ||
              (file &&
                ["image/jpeg", "image/png", "image/jpg"].includes(file.type))
            );
          }),
      }),
    )
    .required("At least one menu item is required")
    .min(1, "At least one menu item is required")
    .test(
      "unique-item-names",
      "Menu item names must be unique",
      (menuItems) => {
        if (!menuItems) return true;
        const names = menuItems.map((item) =>
          item.itemName.toLowerCase().trim(),
        );
        return names.length === new Set(names).size;
      },
    ),

  branches: yup
    .array()
    .required()
    .of(
      yup.object({
        branchName: yup
          .string()
          .required(`Branch name ${REQUIRED_ERROR}`)
          .min(3, "Branch name must be at least 3 characters")
          .max(20, "Branch name cannot exceed 20 characters"),
        branchCode: yup
          .string()
          .required(`Branch code ${REQUIRED_ERROR}`)
          .matches(
            /^[A-Z0-9]{2,6}$/,
            "Branch code must be 2-6 uppercase letters/numbers",
          ),
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
          .min(1, "At least one license is required")
          .test(
            "unique-license-number",
            "License numbers must be unique per branch",
            (licenses) => {
              if (!licenses) return true;
              const numbers = licenses.map((l) =>
                l.licenseNumber.trim().toLowerCase(),
              );
              return numbers.length === new Set(numbers).size;
            },
          ),
      }),
    ),
});
