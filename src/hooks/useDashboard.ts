import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { handleError } from "../utils/HandleError";
import { dashboardService } from "../services/dashboardService";
import type { User, Restaurant } from "../services/dashboardService";
type UseDashboardParams = {
  showSnackbar: (msg: string, type: "error" | "success") => void;
};

export const useDashboard = ({ showSnackbar }: UseDashboardParams) => {
  const { showBoundary } = useErrorBoundary();

  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

     const [usersData, restaurantData] = await Promise.all([
  dashboardService.getUsers(),
  dashboardService.getRestaurants(),
]);

console.log("Restaurants fetched:", restaurantData); 

      setUsers(usersData);
      setRestaurants(restaurantData);
    } catch (error: any) {
      handleError({
        error,
        showBoundary,
        fallbackMessage: "Failed to load dashboard data",
        showSnackbar,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalUsers = users.length;
  const totalRestaurants = restaurants.length;
 const activeRestaurants = restaurants.filter(
  (r) =>
    r.isActive === true ||
    (r.status?.trim().toLowerCase() === "active")
).length;

  const inactiveRestaurants =
  totalRestaurants - activeRestaurants;

  return {
    totalUsers,
    totalRestaurants,
    activeRestaurants,
    loading,
    inactiveRestaurants,
    refetch: fetchDashboardData,
  };
};