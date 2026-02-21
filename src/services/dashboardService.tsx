import { apiService } from "./apiService"; 

export interface User {
  id: number;
}

export interface Restaurant {
  id: number;
  status?: string;       // might be missing in some records
  isActive?: boolean;    // optional, because some objects have it
}

export const dashboardService = {
  async getUsers(): Promise<User[]> {
    return apiService.get<User[]>("/users");
  },

  async getRestaurants(): Promise<Restaurant[]> {
    return apiService.get<Restaurant[]>("/restaurants");
  },
};