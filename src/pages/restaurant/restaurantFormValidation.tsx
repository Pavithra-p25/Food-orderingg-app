import type { RestaurantFormValues } from "./restaurantFormTypes";


// Field labels
export const FIELD_LABELS: Record<keyof RestaurantFormValues, string> = {
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
};

// for required message
export const REQUIRED_MSG = (field: keyof RestaurantFormValues) =>
  `${FIELD_LABELS[field]} is required`;

// Validation rules for react-hook-form
export const VALIDATION_RULES: Record<
  keyof RestaurantFormValues,
  { required?: string }
> = {
  email: { required: REQUIRED_MSG("email") },
  password: { required: REQUIRED_MSG("password") },
  confirmPassword: { required: REQUIRED_MSG("confirmPassword") },
  restaurantName: { required: REQUIRED_MSG("restaurantName") },
  restaurantType: { required: REQUIRED_MSG("restaurantType") },
  category: { required: REQUIRED_MSG("category") },
  ownerName: { required: REQUIRED_MSG("ownerName") },
  supportEmail: { required: REQUIRED_MSG("supportEmail") },
  phone: { required: REQUIRED_MSG("phone") },
  alternatePhone: {},
  address: { required: REQUIRED_MSG("address") },
  city: { required: REQUIRED_MSG("city") },
  state: { required: REQUIRED_MSG("state") },
  pincode: {},
  country: {},
};
