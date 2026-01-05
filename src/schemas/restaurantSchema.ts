import * as yup from "yup";//schema validation library 
import type { Restaurant, RestaurantType} from "../types/RestaurantTypes";
import { ERROR_MESSAGES } from "../config/constants/ErrorMessages";

// Define schema
export const restaurantSchema: yup.ObjectSchema<Restaurant> = yup.object({
  // Login tab
  email: yup
    .string()
    .email(ERROR_MESSAGES.email.invalid)
    .required(ERROR_MESSAGES.email.required),

  password: yup
    .string()
    .min(6, ERROR_MESSAGES.password.min)
    .required(ERROR_MESSAGES.password.required),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], ERROR_MESSAGES.password.match)
    .required(ERROR_MESSAGES.password.confirmPasswordRequired),

  // Restaurant tab
  restaurantName: yup
    .string()
    .required(ERROR_MESSAGES.restaurant.nameRequired),

  restaurantType: yup
    .mixed<RestaurantType>() //mixed can be any type (string number object etc)
    .oneOf(["Veg", "Non-Veg", "Both"], ERROR_MESSAGES.restaurant.typeInvalid)
    .required(ERROR_MESSAGES.restaurant.typeRequired),

  category: yup
    .string()
    .required(ERROR_MESSAGES.restaurant.categoryRequired),

  averageDeliveryTime: yup.string().optional(),

  // Contact tab
  ownerName: yup
    .string()
    .required(ERROR_MESSAGES.contact.ownerNameRequired),

  supportEmail: yup
    .string()
    .email(ERROR_MESSAGES.email.invalid)
    .required(ERROR_MESSAGES.contact.supportEmailRequired),

  phone: yup
    .string()
    .required(ERROR_MESSAGES.contact.phoneRequired),

  alternatePhone: yup.string().optional(),

  // Location tab
  address: yup
    .string()
    .required(ERROR_MESSAGES.location.addressRequired),

  city: yup
    .string()
    .required(ERROR_MESSAGES.location.cityRequired),

  state: yup
    .string()
    .required(ERROR_MESSAGES.location.stateRequired),

  pincode: yup.string().required(ERROR_MESSAGES.location.pincodeRequired),

  country: yup
    .string()
    .required(ERROR_MESSAGES.location.countryRequired),

   acceptTerms: yup
  .boolean()
  .oneOf([true], ERROR_MESSAGES.checkbox.acceptTermsRequired),

  // Optional fields
  openingTime: yup.string().optional(),
  closingTime: yup.string().optional(),
  website: yup
    .string()
    .url(ERROR_MESSAGES.url.invalid)
    .optional(),
}) as yup.ObjectSchema<Restaurant>;
