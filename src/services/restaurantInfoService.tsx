import {apiService} from "./apiService";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";

const RESTAURANT_INFO_URL = "/restaurantinfo";

/* STORE restaurant info */
export const createRestaurantInfo = (
  data: RestaurantInfoValues
) => {
  return apiService.post<RestaurantInfoValues>(
    RESTAURANT_INFO_URL,
    data
  );
};

/* GET all restaurant info */
export const getRestaurantInfoList = () => {
  return apiService.get<RestaurantInfoValues[]>(
    RESTAURANT_INFO_URL
  );
};
