import type { RestaurantValues } from "../../types/restaurantTypes";

export const FIELD_LABELS: Record<keyof RestaurantValues, string> = {
  email: "Email / Username",
  password: "Password",
  confirmPassword: "Confirm Password",
  restaurantName: "Restaurant Name",
  restaurantType: "Restaurant Type",
  category: "Category",
  ownerName: "Owner Name",
  supportEmail: "Support Email",
  phone: "Phone",
  alternatePhone: "Alternate Phone",
  address: "Address",
  city: "City",
  state: "State",
  pincode: "Pincode",
  country: "Country",
  openingTime: "Opening Time",
  closingTime: "Closing Time",
  website: "Website",
  logo: "Restaurant Logo",
};
