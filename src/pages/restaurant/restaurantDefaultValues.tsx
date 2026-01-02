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
  closingTime: "",
  website:"",
  logo: undefined,

  // Contact Tab 
  ownerName: "",
  supportEmail: "",
  phone: "",
  alternatePhone:"",

  // Location Tab 
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  acceptTerms: false,
};
