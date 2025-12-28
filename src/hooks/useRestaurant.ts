import * as restaurantService  from "../services/restaurantService";

export const useRestaurants = () => {
  const getAllRestaurants = async () => {
    try {
      const data = await restaurantService.getRestaurants();
      return data ?? []; // if data is null/undefined, return empty array
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      return []; 
    }
  };

  const getRestaurantDetails = async (id: number | string) => {
    try {
      const data = await restaurantService.getRestaurantById(Number(id));
      return data ?? null; // if no data, return null
    } catch (error) {
      console.error("Failed to fetch restaurant details:", error);
      return null; 
    }
  };

  return {
    getAllRestaurants,
    getRestaurantDetails,
  };
};

export default useRestaurants;
