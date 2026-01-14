import type { FieldErrors, Control } from "react-hook-form";

/* Tab Types*/

export type RestaurantTabKey = "login" | "restaurant" | "contact" | "location" | "Group by";

export type TabStatus = "neutral" | "error" | "success";

export type RestaurantTabStatusMap = Record<RestaurantTabKey, TabStatus>;

export type RestaurantStatus = "draft" | "active" | "inactive";


/* Restaurant Types */

export type RestaurantType = "Veg" | "Non-Veg" | "Both" | "";

export type Timestamps = {
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};

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
  logo?: string ;
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
  acceptTerms:boolean;
};

export type Restaurant =
  Login &
  RestaurantData &
  Contact &
  Location &
  Timestamps & {
    id:string ;
    status: RestaurantStatus;
    isActive?:boolean; // for new restaurants
  };


export type RestaurantErrors = Partial<Record<keyof Restaurant, string>>;

export type TabProps = {
  errors: FieldErrors<Restaurant>;
  control: Control<Restaurant>;
};
