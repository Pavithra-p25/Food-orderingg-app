import type { Restaurant } from "../../types/RestaurantTypes";

export const restaurantDefaultValues: Restaurant = {
  // Login Tab 
  email: "",
  password: "",
  confirmPassword: "",

  //  Restaurant Tab 
  restaurantName: "",
  restaurantType: "",          
  category: "",            
  averageDeliveryTime: "", 
  openingTime: "",
  closingTime: undefined,
  website: undefined,
  logo: undefined,

  // Contact Tab 
  ownerName: "",
  supportEmail: "",
  phone: "",
  alternatePhone: undefined,

  // Location Tab 
  address: "",
  city: "",
  state: "",
  pincode: undefined,
  country: "",
};
