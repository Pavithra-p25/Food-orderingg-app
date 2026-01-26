import * as yup from "yup";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../config/constants/regex";

export const signupSchema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters"),

  emailOrUsername: yup
    .string()
    .required("Email or Username is required")
    .test(
      "email-or-username",
      "Enter a valid email or username",
      (value) => {
        if (!value) return false;

        // valid email
        if (EMAIL_REGEX.test(value)) return true;

        // valid username (min 3 chars, letters/numbers/_/. only)
        return /^[a-zA-Z0-9_.]{3,}$/.test(value);
      }
    ),

  password: yup
    .string()
    .required("Password is required")
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 6 characters and contain at least one letter and one number"
    ),

  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
