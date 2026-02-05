import { useErrorBoundary } from "react-error-boundary";
import type { User } from "../types/userTypes";
import { userService } from "../services/userService";

export const useUser = () => {
  const { showBoundary } = useErrorBoundary();

  const fetchUsers = async () => {
    try {
      return await userService.fetchUsers();
    } catch (err: any) {
      const errorObj = new Error( "Failed to Load user");
      // Trigger global ErrorBoundary for fetch errors
      showBoundary(errorObj);
     throw errorObj;
    }
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
