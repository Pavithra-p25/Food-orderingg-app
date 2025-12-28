import { apiService } from "../services/apiService";
import type { User } from "../types/types";

export const userService = {
  fetchUsers: async (): Promise<User[]> => {
    return await apiService.get<User[]>("/users");
  },

  addUser: async (user: User): Promise<User> => {
    return await apiService.post<User>("/users", user);
  },
};
