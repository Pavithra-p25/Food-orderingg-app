
import type { User } from "../types/types";
import { userService } from "../services/userService";

export const useUser = () => {
  const fetchUsers = () => {
    return userService.fetchUsers();
  };

  const addUser = (user: Omit<User, "id">) => {
    return userService.addUser(user);
  };

  return {
    fetchUsers,
    addUser,
  };
};

export default useUser;
