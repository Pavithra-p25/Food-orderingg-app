import type { FieldErrors, Control } from "react-hook-form";

/* Tab Types*/

export type RestaurantTabKey = "login" | "restaurant" | "contact" | "location";

export type TabStatus = "neutral" | "error" | "success";

export type RestaurantTabStatusMap = Record<RestaurantTabKey, TabStatus>;

/* Restaurant Types */

export type RestaurantType = "Veg" | "Non-Veg" | "Both" | "";

export type Login = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type RestaurantData = {
  restaurantName: string;
  restaurantType?: RestaurantType;
  category: string;
  openingTime?: string;
  closingTime?: string;
  averageDeliveryTime: string;
  website?: string;
  logo?: FileList;
};

export type Contact = {
  ownerName: string;
  supportEmail: string;
  phone: string;
  alternatePhone?: string;
};

export type Location = {
  address: string;
  city: string;
  state: string;
  pincode?: string;
  country: string;
};

export type Restaurant =
  Login &
  RestaurantData &
  Contact &
  Location;

export type RestaurantErrors = Partial<Record<keyof Restaurant, string>>;

export type TabProps = {
  errors: FieldErrors<Restaurant>;
  control: Control<Restaurant>;
};
