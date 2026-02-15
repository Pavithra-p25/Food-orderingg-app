import * as yup from "yup";
import type { Restaurant, RestaurantType } from "../types/RestaurantTypes";
import { ERROR_MESSAGES } from "../config/constants/ErrorMessages";

export const restaurantSchema: yup.ObjectSchema<Restaurant> = yup.object({
  // Login tab
  email: yup
    .string()
    .email(ERROR_MESSAGES.email.invalid)
    .required(ERROR_MESSAGES.email.required),

  password: yup
    .string()
    .min(6, ERROR_MESSAGES.password.min)
    .matches(/^\S*$/, "Password should not contain spaces")
    .required(ERROR_MESSAGES.password.required),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], ERROR_MESSAGES.password.match)
    .matches(/^\S*$/, "Confirm Password should not contain spaces")
    .required(ERROR_MESSAGES.password.confirmPasswordRequired),

  // Restaurant tab
  restaurantName: yup
    .string()
    .required(ERROR_MESSAGES.restaurant.nameRequired)
    .trim()
    .min(3, "Restaurant name must be at least 3 characters")
    .max(30, "Restaurant name must not exceed 30 characters")
    .matches(
      /^[A-Za-z0-9 &-]+$/,
      "Restaurant name contains invalid characters",
    ),
  restaurantType: yup
    .array()
    .of(yup.mixed<RestaurantType>().oneOf(["Veg", "Non-Veg"]))
    .min(1, ERROR_MESSAGES.restaurant.typeRequired)
    .required(ERROR_MESSAGES.restaurant.typeRequired),

  category: yup.string().required(ERROR_MESSAGES.restaurant.categoryRequired),

  averageDeliveryTime: yup.string().optional(),

  // Contact tab
  ownerName: yup
    .string()
    .required(ERROR_MESSAGES.contact.ownerNameRequired)
    .trim()
    .min(3, "Owner name must be at least 3 characters")
    .max(30, "Owner name must not exceed 30 characters")
    .matches(/^[A-Za-z ]+$/, "Owner name should contain only letters"),

  supportEmail: yup
    .string()
    .email(ERROR_MESSAGES.email.invalid)
    .required(ERROR_MESSAGES.contact.supportEmailRequired),

  phone: yup
    .string()
    .required(ERROR_MESSAGES.contact.phoneRequired)
    .matches(/^[0-9]+$/, "Phone number should contain only numbers")
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),

  alternatePhone: yup
    .string()
    .optional()
    .matches(/^[0-9]+$/, "Phone number should contain only numbers")
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),

  // Location tab
  address: yup.string().required(ERROR_MESSAGES.location.addressRequired),

  city: yup
    .string()
    .required(ERROR_MESSAGES.location.cityRequired)
    .trim()
    .min(3, "City name must be at least 3 characters")
    .max(30, "City name must not exceed 30 characters")
    .matches(/^[A-Za-z ]+$/, "City name should contain only letters"),

  state: yup
    .string()
    .required(ERROR_MESSAGES.location.stateRequired)
    .trim()
    .min(3, "City name must be at least 3 characters")
    .max(30, "City name must not exceed 30 characters")
    .matches(/^[A-Za-z ]+$/, "City name should contain only letters"),

  pincode: yup.string().required(ERROR_MESSAGES.location.pincodeRequired),

  country: yup
  .string()
  .required(ERROR_MESSAGES.location.countryRequired)
  .trim()
  .min(3, "Country name must be at least 3 characters")
  .max(50, "Country name must not exceed 50 characters")
  .matches(/^[A-Za-z ]+$/, "Country name should contain only letters"),


  acceptTerms: yup
    .boolean()
    .oneOf([true], ERROR_MESSAGES.checkbox.acceptTermsRequired),

  // Optional fields
  openingTime: yup.string().optional(),
  closingTime: yup.string().optional(),
  website: yup.string().url(ERROR_MESSAGES.url.invalid).optional(),
}) as yup.ObjectSchema<Restaurant>;
