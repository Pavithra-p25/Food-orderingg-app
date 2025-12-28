//keys for tabs
export type RestaurantTabKey =
  | "login"
  | "restaurant"
  | "contact"
  | "location";

export type TabStatus = "neutral" | "error" | "success";

export type RestaurantTabStatusMap = Record<RestaurantTabKey, TabStatus>;

// type of all form fields
export interface RestaurantFormValues {
  // Login details
  email: string;
  password: string;
  confirmPassword: string;

  // Restaurant details
  restaurantName: string;
  restaurantType: string;
  category: string;

  // Contact info
  ownerName: string;
  supportEmail: string;
  phone: string;
  alternatePhone: string;

  // Location details
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// FORM ERRORS 
export type RestaurantFormErrors = Partial<
  Record<keyof RestaurantFormValues, string>
>;
