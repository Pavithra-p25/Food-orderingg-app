import { useErrorBoundary } from "react-error-boundary";
import type { User } from "../types/userTypes";
import { userService } from "../services/userService";
import { handleError } from "../utils/HandleError";
import { useDialogSnackbar } from "../context/DialogSnackbarContext";

export const useUser = () => {
  const { showBoundary } = useErrorBoundary();
  const { showSnackbar } = useDialogSnackbar();

   const fetchUsers = async () => {
    try {
      return await userService.fetchUsers();
    } catch (err: any) {
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to load users",
        showSnackbar,
      });
      throw err;
    }
  };

  const addUser = async (user: Omit<User, "id">) => {
    try {
      return await userService.addUser(user);
    } catch (err: any) {
      handleError({
        error: err,
        showBoundary,
        fallbackMessage: "Failed to add user",
        showSnackbar,
      });
      throw err;
    }
  };

  return {
    fetchUsers,
    addUser,
  };
};

export default useUser;
