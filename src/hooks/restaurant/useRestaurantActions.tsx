import { useState } from "react";
import type { Restaurant } from "../../types/RestaurantTypes";

type PendingAction = "delete" | "restore" | null;

export const useRestaurantActions = (
  softDeleteRestaurant: (id: string) => Promise<any>, //api call to deactivate restuarant 
  activateRestaurant: (id: string) => Promise<any> // to activate 
) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false); //snack bar is opened/not
  const [snackbarMessage, setSnackbarMessage] = useState(""); //snackbar message 
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info"); //snackbar color /type

  const [showConfirm, setShowConfirm] = useState(false); //confirm popup visibility
  const [pendingIds, setPendingIds] = useState<string[]>([]); //show selected restaurant ids
  const [pendingAction, setPendingAction] = useState<PendingAction>(null); //which action delete / restore

  const handleDeleteClick = (ids: string[]) => {
    setPendingIds(ids);
    setPendingAction("delete");
    setShowConfirm(true);
  };

  const handleRestoreClick = (ids: string[]) => {
    setPendingIds(ids);
    setPendingAction("restore");
    setShowConfirm(true);
  };
 
  //updating the state in parent component , dont need to refetch again there 
  const handleConfirmYes = async (
    setAllRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>, 
    setResults: React.Dispatch<React.SetStateAction<Restaurant[]>>
  ) => {
    if (!pendingAction || pendingIds.length === 0) return; //stop execute if nothing selected

    try {
      if (pendingAction === "delete") {
        await Promise.all(pendingIds.map((id) => softDeleteRestaurant(id))); //call api for selected data 
 
        //loop through all restuarant and update status for selected only 
        setAllRestaurants((prev) =>
          prev.map((r) =>
            pendingIds.includes(r.id.toString())
              ? { ...r, isActive: false }
              : r
          )
        );

        setResults((prev) =>
          prev.map((r) =>
            pendingIds.includes(r.id.toString())
              ? { ...r, isActive: false }
              : r
          )
        );

        setSnackbarMessage(
          pendingIds.length === 1
            ? "Restaurant deleted successfully"
            : `${pendingIds.length} restaurants deleted successfully`
        );
      }

      if (pendingAction === "restore") {
        await Promise.all(pendingIds.map((id) => activateRestaurant(id)));

        setAllRestaurants((prev) =>
          prev.map((r) =>
            pendingIds.includes(r.id.toString())
              ? { ...r, isActive: true }
              : r
          )
        );

        setResults((prev) =>
          prev.map((r) =>
            pendingIds.includes(r.id.toString())
              ? { ...r, isActive: true }
              : r
          )
        );

        setSnackbarMessage(
          pendingIds.length === 1
            ? "Restaurant restored successfully"
            : `${pendingIds.length} restaurants restored successfully`
        );
      }

      setSnackbarSeverity("success");
    } catch {
      setSnackbarMessage(
        pendingAction === "delete"
          ? "Failed to delete restaurant(s)"
          : "Failed to restore restaurant(s)"
      );
      setSnackbarSeverity("error");
    } finally {
      setShowConfirm(false);
      setPendingIds([]);
      setPendingAction(null);
      setSnackbarOpen(true);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    setPendingIds([]);
    setPendingAction(null);
  };

  return {
    // state
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showConfirm,
    pendingAction,
    pendingIds,

    // handlers
    handleDeleteClick,
    handleRestoreClick,
    handleConfirmYes,
    handleConfirmNo,

    // snackbar
    setSnackbarOpen,
  };
};
