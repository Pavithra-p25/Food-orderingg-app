// REQUIRED
export const validateRequired = (
  value: string,
  fieldName: string
): string => {
  if (value === undefined || value === null || !value.trim()) {
    return `${fieldName} is required`;
  }
  return "";
};

// EMAIL
const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateEmail = (email: string): string => {
  const requiredError = validateRequired(email, "Email");
  if (requiredError) return requiredError;

  if (!EMAIL_REGEX.test(email.trim())) {
    return "Enter a valid email";
  }
  return "";
};

// PHONE
const PHONE_REGEX: RegExp = /^[0-9]{10}$/;
export const validatePhone = (phone: string): string => {
  const requiredError = validateRequired(phone, "Phone number");
  if (requiredError) return requiredError;

  if (!PHONE_REGEX.test(phone.trim())) {
    return "Phone must be 10 digits";
  }
  return "";
};
