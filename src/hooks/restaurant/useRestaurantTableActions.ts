import { useState } from "react";
import type { Restaurant } from "../../types/RestaurantTypes";
import { useSnackbar } from "../../context/SnackbarContext";
type PendingAction = "delete" | "restore" | null;

export const useRestaurantTableActions = (
  softDeleteRestaurant: (id: string) => Promise<any>, //api call to deactivate restuarant 
  activateRestaurant: (id: string) => Promise<any> ,// to activate 
  deleteRestaurant: (id: string) => Promise<any>,
 saveDraft?: (restaurant: Restaurant) => Promise<void>
 // optional handler for draft
) => {
  const { showSnackbar } = useSnackbar(); 

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
    allRestaurants: Restaurant[], 
    setAllRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>, 
    setResults: React.Dispatch<React.SetStateAction<Restaurant[]>>
  ) => {
    if (!pendingAction || pendingIds.length === 0) return; //stop execute if nothing selected

    try {
     if (pendingAction === "delete") {
  await Promise.all(
    pendingIds.map(async (id) => {
      const restaurant = allRestaurants.find(
        (r: Restaurant) => r.id === id
      );

      if (!restaurant) return;

      if (restaurant.status === "draft") {
        // Permanent delete for draft
        await deleteRestaurant(id);
      } else {
        // Soft delete for others
        await softDeleteRestaurant(id);
      }
    })
  );

  // Update state
  setAllRestaurants((prev) =>
    prev
      .filter(
        (r) => !(pendingIds.includes(r.id) && r.status === "draft")
      )
      .map((r) =>
        pendingIds.includes(r.id) && r.status !== "draft"
          ? { ...r, isActive: false }
          : r
      )
  );

  setResults((prev) =>
    prev
      .filter(
        (r) => !(pendingIds.includes(r.id) && r.status === "draft")
      )
      .map((r) =>
        pendingIds.includes(r.id) && r.status !== "draft"
          ? { ...r, isActive: false }
          : r
      )
  );

 showSnackbar(
          pendingIds.length === 1
            ? "Restaurant deleted successfully"
            : `${pendingIds.length} restaurants deleted successfully`,
          "success"
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

      showSnackbar(
          pendingIds.length === 1
            ? "Restaurant restored successfully"
            : `${pendingIds.length} restaurants restored successfully`,
          "success"
        );
      }

     
    } catch {
      showSnackbar(
        pendingAction === "delete"
          ? "Failed to delete restaurant(s)"
          : "Failed to restore restaurant(s)",
        "error"
      );
    
    } finally {
      setShowConfirm(false);
      setPendingIds([]);
      setPendingAction(null);
    }
  };

  const handleCloseDraft = async (
  values: Restaurant,
  onClose: () => void,
  skipDraftRef?: React.MutableRefObject<boolean>
) => {
  if (skipDraftRef?.current) {
    skipDraftRef.current = false; // reset for next time
    onClose();
    return;
  }

  const { id, status, isActive, ...rest } = values;
  const hasAnyData = Object.values(rest).some(
    (v) => v !== "" && v !== false && v !== undefined
  );

  if (hasAnyData && saveDraft) {
    await saveDraft({
      ...values,
      id: id || Date.now().toString(),
      status: "draft",
      isActive: false,
      createdAt: values.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  onClose();
};


  const handleConfirmNo = () => {
    setShowConfirm(false);
    setPendingIds([]);
    setPendingAction(null);
  };

  return {
    // state
    showConfirm,
    pendingAction,
    pendingIds,

    // handlers
    handleDeleteClick,
    handleRestoreClick,
    handleConfirmYes,
    handleConfirmNo,
    handleCloseDraft,

  };
};
