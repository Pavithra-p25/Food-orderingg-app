// common reusable error message
export const REQUIRED_ERROR = "is required";

// field-wise error messages
export const ERROR_MESSAGES = {
  email: {
    required: `Email ${REQUIRED_ERROR}`,
    invalid: "Invalid email",
  },
  password: {
    required: `Password ${REQUIRED_ERROR}`,
    min: "Password must be at least 6 characters",
    match: "Passwords must match",
  },
  restaurant: {
    nameRequired: `Restaurant name ${REQUIRED_ERROR}`,
    typeRequired: `Restaurant type ${REQUIRED_ERROR}`,
    typeInvalid: "Invalid restaurant type",
    categoryRequired: `Category ${REQUIRED_ERROR}`,
  },
  contact: {
    ownerNameRequired: `Owner name ${REQUIRED_ERROR}`,
    supportEmailRequired: `Support email ${REQUIRED_ERROR}`,
    phoneRequired: `Phone ${REQUIRED_ERROR}`,
  },
  location: {
    addressRequired: `Address ${REQUIRED_ERROR}`,
    cityRequired: `City ${REQUIRED_ERROR}`,
    stateRequired: `State ${REQUIRED_ERROR}`,
    countryRequired: `Country ${REQUIRED_ERROR}`,
  },
  url: {
    invalid: "Must be a valid URL",
  },
};
