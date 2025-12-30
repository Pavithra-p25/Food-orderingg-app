import type { FieldErrors, Control } from "react-hook-form";

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

export const DELIVERY_TIME_OPTIONS = [
  "20 - 30 mins",
  "30 - 40 mins",
  "40 - 50 mins",
  "50 - 60 mins",
];

// Restaurant tab fields
export type RestaurantTabValues = {
  restaurantName: string;
  restaurantType: RestaurantType;
  category: string;
  openingTime?: string;
  closingTime?: string;
  averageDeliveryTime: string;
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
export type RestaurantFormErrors = Partial<Record<keyof RestaurantValues, string>>; //partial makes  fields optional

// Props passed to all tab components
export type TabProps = {
  errors: FieldErrors<RestaurantValues>; // showing validation errors
  control: Control<RestaurantValues>; // optional, only used in tabs that need Controller
};
