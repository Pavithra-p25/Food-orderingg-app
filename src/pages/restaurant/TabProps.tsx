import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import type { RestaurantFormValues } from "./restaurantFormTypes";

export interface TabProps {
  register: UseFormRegister<RestaurantFormValues>;
  errors: FieldErrors<RestaurantFormValues>;
}
