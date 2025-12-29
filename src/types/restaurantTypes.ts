import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";

// Keys for the tabs
export type RestaurantTabKey = "login" | "restaurant" | "contact" | "location";

// Status for each tab
export type TabStatus = "neutral" | "error" | "success";

// Map to keep track of each tab's status
export type RestaurantTabStatusMap = Record<RestaurantTabKey, TabStatus>;

// Allowed restaurant types
export type RestaurantType = "Veg" | "Non-Veg" | "Both";
export const RESTAURANT_TYPES: RestaurantType[] = ["Veg", "Non-Veg", "Both"];

// Login tab fields
export type LoginValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

// Restaurant tab fields
export type RestaurantTabValues = {
  restaurantName: string;
  restaurantType: RestaurantType;
  category: string;
  openingTime?: string;
  closingTime?: string;
  website?: string;
  logo: FileList;
};

// Contact tab fields
export type ContactValues = {
  ownerName: string;
  supportEmail: string;
  phone: string;
  alternatePhone?: string;
};

// Location tab fields
export type LocationValues = {
  address: string;
  city: string;
  state: string;
  pincode?: string;
  country: string;
};

// Combined form type
export type RestaurantValues = LoginValues &
  RestaurantTabValues &
  ContactValues &
  LocationValues;

// Form errors type
export type RestaurantFormErrors = Partial<Record<keyof RestaurantValues, string>>;

// Props passed to all tab components
export type TabProps = {
  register: UseFormRegister<RestaurantValues>;
  errors: FieldErrors<RestaurantValues>;
  control?: Control<RestaurantValues>; // optional, only used in tabs that need Controller
};
