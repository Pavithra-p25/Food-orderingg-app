import * as Yup from "yup";

// Contact Schema
export const contactSchema = Yup.object().shape({
  name: Yup.string().required("Contact Name is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone must be numeric")
    .required("Phone is required"),
  email: Yup.string().email("Invalid email").notRequired(), // email optional
});

// Branch Schema
export const branchSchema = Yup.object().shape({
  branchName: Yup.string().required("Branch Name is required"),
  branchCode: Yup.string().required("Branch Code is required"),
  branchContacts: Yup.array()
    .of(contactSchema)
    .min(1, "At least 1 contact required"),
});

// Combined Restaurant Info Schema
export const restaurantInfoSchema = Yup.object().shape({
  restaurantName: Yup.string().required("Restaurant Name is required"),
  ownerName: Yup.string().required("Owner Name is required"),
  restaurantContacts: Yup.array()
    .of(contactSchema)
    .min(1, "At least 1 contact required"),
  branches: Yup.array()
    .of(branchSchema)
    .min(1, "At least 1 branch required"),
});
