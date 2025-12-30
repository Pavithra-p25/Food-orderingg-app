// src/schemas/restaurantSchema.ts
import * as yup from "yup";
import type { RestaurantValues, RestaurantType} from "../types/restaurantTypes";


// Define schema
export const restaurantSchema: yup.ObjectSchema<RestaurantValues> = yup.object({
  // Login tab
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),

  // Restaurant tab
  restaurantName: yup.string().required("Restaurant name is required"),
  restaurantType: yup
  .mixed<RestaurantType>()
  .oneOf(["Veg", "Non-Veg", "Both"], "Invalid restaurant type")
  .required("Restaurant type is required"),
   category: yup.string().required("Category is required"),
   averageDeliveryTime: yup.string().notRequired(),

  // Contact tab
  ownerName: yup.string().required("Owner name is required"),
  supportEmail: yup.string().email("Invalid email").required("Support email is required"),
  phone: yup.string().required("Phone is required"),
  alternatePhone: yup.string().optional(),

  // Location tab
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pincode: yup.string().optional(),
  country: yup.string().required("Country is required"),

  // Optional fields
  openingTime: yup.string().optional(),
  closingTime: yup.string().optional(),
  website: yup.string().url("Must be a valid URL").optional(),
}) as yup.ObjectSchema<RestaurantValues>;
