import type {
  UseFormRegister,
  FieldErrors,
  Control,
} from "react-hook-form";
import type { RestaurantValues } from "../../types/restaurantTypes";

export type TabProps = {
  register: UseFormRegister<RestaurantValues>;
  errors: FieldErrors<RestaurantValues>;
  control?: Control<RestaurantValues>; // optional (only RestaurantTab needs it)
};
