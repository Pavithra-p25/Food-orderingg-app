import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  DialogContent,
  Stack,
} from "@mui/material";

import MyButton from "../../components/newcomponents/button/MyButton";
import { useForm} from "react-hook-form";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import type { Restaurant } from "../../types/RestaurantTypes";
import RestaurantForm from "../restaurant/RestaurantForm";
import { restaurantDefaultValues } from "./restaurantDefaultValues";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";

import RestaurantSearchForm from "./RestaurantSearchForm";
import RestaurantTable from "./RestaurantTable";

type PendingAction = "delete" | "restore" | null;

const RestaurantSearch: React.FC = () => {
  const methods = useForm<Restaurant>({
    defaultValues: {
      ...restaurantDefaultValues,
    },
  });

  const { control, handleSubmit, reset } = methods;

  const [results, setResults] = useState<Restaurant[]>([]); // search results
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]); // all data

  

  const { getAllRestaurants, softDeleteRestaurant, activateRestaurant } =
    useRestaurants();

  const [openAddForm, setOpenAddForm] = useState(false);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Edit state
  const [editingRestaurant, setEditingRestaurant] =
    useState<Restaurant | null>(null);

  // Confirmation dialog states
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Restaurant | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setAllRestaurants(data);
        setResults(data); // show all (active + inactive)
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleReset = () => {
    reset(restaurantDefaultValues);
    setResults(allRestaurants); // show all again
  };

  const onSubmit = async (data: any) => {
    try {
      const filtered = allRestaurants.filter((res: Restaurant) => {
        return (
          (!data.restaurantName ||
            (res.restaurantName ?? "")
              .toLowerCase()
              .includes(data.restaurantName.toLowerCase().trim())) &&
          (!data.category ||
            (res.category ?? "").toLowerCase().trim() ===
              data.category.toLowerCase().trim()) &&
          (!data.restaurantType ||
            (res.restaurantType ?? "").toLowerCase().trim() ===
              data.restaurantType.toLowerCase().trim()) &&
          (!data.city ||
            (res.city ?? "")
              .toLowerCase()
              .includes(data.city.toLowerCase().trim())) &&
          (!data.state ||
            (res.state ?? "")
              .toLowerCase()
              .includes(data.state.toLowerCase().trim())) &&
          (!data.phone ||
            (res.phone ?? "")
              .toLowerCase()
              .includes(data.phone.toLowerCase().trim())) &&
          (!data.email ||
            (res.email ?? "")
              .toLowerCase()
              .includes(data.email.toLowerCase().trim()))
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      setResults([]);
    }
  };

  // Delete
  const handleDeleteClick = (restaurant: Restaurant) => {
    setPendingDelete(restaurant);
    setPendingAction("delete");
    setShowConfirm(true);
  };

  // Restore
  const handleRestoreClick = (restaurant: Restaurant) => {
    setPendingDelete(restaurant);
    setPendingAction("restore");
    setShowConfirm(true);
  };

  const handleConfirmYes = async () => {
    if (!pendingDelete || !pendingAction) return;

    try {
      if (pendingAction === "delete") {
        await softDeleteRestaurant(pendingDelete.id);

        setAllRestaurants((prev) =>
          prev.map((r) =>
            r.id === pendingDelete.id ? { ...r, isActive: false } : r
          )
        );

        setResults((prev) =>
          prev.map((r) =>
            r.id === pendingDelete.id ? { ...r, isActive: false } : r
          )
        );

        setSnackbarMessage(
          `"${pendingDelete.restaurantName}" deleted successfully`
        );
        setSnackbarSeverity("success");
      } else if (pendingAction === "restore") {
        await activateRestaurant(pendingDelete.id);

        setAllRestaurants((prev) =>
          prev.map((r) =>
            r.id === pendingDelete.id ? { ...r, isActive: true } : r
          )
        );

        setResults((prev) =>
          prev.map((r) =>
            r.id === pendingDelete.id ? { ...r, isActive: true } : r
          )
        );

        setSnackbarMessage(
          `"${pendingDelete.restaurantName}" reactivated successfully`
        );
        setSnackbarSeverity("success");
      }
    } catch (error) {
      setSnackbarMessage(
        pendingAction === "delete"
          ? "Failed to delete restaurant"
          : "Failed to reactive restaurant"
      );
      setSnackbarSeverity("error");
    } finally {
      setPendingDelete(null);
      setPendingAction(null);
      setShowConfirm(false);
      setSnackbarOpen(true);
    }
  };

  const handleConfirmNo = () => {
    setPendingDelete(null);
    setPendingAction(null);
    setShowConfirm(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* SEARCH FORM CONTAINER */}
        <Grid size={12}>
          <RestaurantSearchForm
            methods={methods}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            handleReset={handleReset}
            onAdd={() => {
              setEditingRestaurant(null); // reset so form is empty
              setOpenAddForm(true);
            }}
          />
        </Grid>

        {/* RESULTS TABLE */}
        <Grid size={12}>
          <RestaurantTable
            results={results}
            onEdit={(r) => {
              setEditingRestaurant(r);
              setOpenAddForm(true);
            }}
            onDelete={handleDeleteClick}
            onRestore={handleRestoreClick}
          />
        </Grid>
      </Grid>

      {/* ADD - EDIT RESTAURANT POPUP */}
      <RestaurantForm
        show={openAddForm}
        onClose={() => {
          setOpenAddForm(false);
          setEditingRestaurant(null);
        }}
        restaurant={editingRestaurant}
        onSave={(updated) => {
          setAllRestaurants((prev) => {
            const index = prev.findIndex((r) => r.id === updated.id);
            if (index > -1) {
              const copy = [...prev];
              copy[index] = updated;
              return copy;
            }
            return [...prev, updated];
          });

          setResults((prev) => {
            const index = prev.findIndex((r) => r.id === updated.id);
            if (index > -1) {
              const copy = [...prev];
              copy[index] = updated;
              return copy;
            }
            return [...prev, updated];
          });
        }}
      />

      {/* Confirmation Dialog */}
      <MyDialog open={showConfirm} onClose={handleConfirmNo} maxWidth="xs">
        <DialogContent sx={{ textAlign: "center" }}>
          {pendingAction === "delete"
            ? `Are you sure you want to delete "${pendingDelete?.restaurantName}"?`
            : `Are you sure you want to reactive "${pendingDelete?.restaurantName}"?`}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <MyButton variant="outlined" onClick={handleConfirmNo}>
              No
            </MyButton>
            <MyButton variant="contained" onClick={handleConfirmYes}>
              Yes
            </MyButton>
          </Stack>
        </DialogContent>
      </MyDialog>

      {/* Snackbar */}
      <MySnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
        position={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default RestaurantSearch;
