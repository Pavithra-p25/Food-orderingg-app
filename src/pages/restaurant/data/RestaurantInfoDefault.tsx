import type { RestaurantInfoValues } from "../../../types/RestaurantInfoTypes";

export const defaultRestaurantValues: RestaurantInfoValues = {
  restaurantName: "",
  ownerName: "",
  menuItems: [
    {
      itemName: "",
      category: "",
      price: 0,
      file: null,
    },
  ],
  branches: [
    {
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
    },
  ],
};
