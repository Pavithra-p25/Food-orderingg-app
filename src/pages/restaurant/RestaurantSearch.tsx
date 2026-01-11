import React, { useState, useEffect } from "react";
import { Container, Grid, DialogContent, Stack } from "@mui/material";
import MyButton from "../../components/newcomponents/button/MyButton";
import { useForm } from "react-hook-form";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import type { Restaurant } from "../../types/RestaurantTypes";
import RestaurantForm from "../restaurant/RestaurantForm";
import { restaurantDefaultValues } from "./restaurantDefaultValues";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";
import MyTab from "../../components/newcomponents/tabs/MyTab";
import RestaurantSearchForm from "./RestaurantSearchForm";
import RestaurantTable from "./RestaurantTable";

type PendingAction = "delete" | "restore" | null;

const RestaurantSearch: React.FC = () => {
  const methods = useForm<Restaurant>({
    defaultValues: { ...restaurantDefaultValues },
  });

  const { control, handleSubmit, reset } = methods;

  const [results, setResults] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);

  const { getAllRestaurants, softDeleteRestaurant, activateRestaurant } =
    useRestaurants();

  const [openAddForm, setOpenAddForm] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setAllRestaurants(data);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleReset = () => {
    reset(restaurantDefaultValues);
    setResults(allRestaurants);
  };

  const onSubmit = async (data: any) => {
    try {
      const filtered = allRestaurants.filter((res: Restaurant) => {
        const match = (field?: string, value?: string) =>
          value && field?.toLowerCase().includes(value.toLowerCase().trim());

        // Return true if any field matches
        return (
          match(res.restaurantName, data.restaurantName) ||
          match(res.category, data.category) ||
          match(res.restaurantType, data.restaurantType) ||
          match(res.city, data.city) ||
          match(res.state, data.state) ||
          match(res.phone, data.phone) ||
          match(res.email, data.email)
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("Failed to filter restaurants:", error);
      setResults([]);
    }
  };

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

  const handleConfirmYes = async () => {
    if (pendingIds.length === 0 || !pendingAction) return;

    try {
      if (pendingAction === "delete") {
        await Promise.all(pendingIds.map((id) => softDeleteRestaurant(id)));

        setAllRestaurants((prev) =>
          prev.map((r) =>
            pendingIds.includes(r.id.toString()) ? { ...r, isActive: false } : r
          )
        );

        setResults((prev) =>
          prev.map((r) =>
            pendingIds.includes(r.id.toString()) ? { ...r, isActive: false } : r
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
            pendingIds.includes(r.id.toString()) ? { ...r, isActive: true } : r
          )
        );

        setResults((prev) =>
          prev.map((r) =>
            pendingIds.includes(r.id.toString()) ? { ...r, isActive: true } : r
          )
        );

        setSnackbarMessage(
          pendingIds.length === 1
            ? "Restaurant restored successfully"
            : `${pendingIds.length} restaurants restored successfully`
        );
      }

      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(
        pendingAction === "delete"
          ? "Failed to delete restaurant(s)"
          : "Failed to restore restaurant(s)"
      );
      setSnackbarSeverity("error");
    } finally {
      setPendingIds([]);
      setPendingAction(null);
      setShowConfirm(false);
      setSnackbarOpen(true);
    }
  };
  const handleConfirmNo = () => {
    setPendingIds([]);
    setPendingAction(null);
    setShowConfirm(false);
  };

  const tabs = [
    {
      key: "all",
      tabName: "All",
      tabContent: (
        <RestaurantTable
          results={results}
          onEdit={(r) => {
            setEditingRestaurant(r);
            setOpenAddForm(true);
          }}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
        />
      ),
    },
    {
      key: "active",
      tabName: "Active",
      tabContent: (
        <RestaurantTable
          results={results.filter((r) => r.isActive)}
          onEdit={(r) => {
            setEditingRestaurant(r);
            setOpenAddForm(true);
          }}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
        />
      ),
    },
    {
      key: "inactive",
      tabName: "Inactive",
      tabContent: (
        <RestaurantTable
          results={results.filter((r) => !r.isActive)}
          onEdit={(r) => {
            setEditingRestaurant(r);
            setOpenAddForm(true);
          }}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
        />
      ),
    },
  ];

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
              setEditingRestaurant(null);
              setOpenAddForm(true);
            }}
          />
        </Grid>

        {/* RESULTS TABLE */}
        <Grid size={12}>
          <MyTab
            tabs={tabs}
            tabStatus={{
              all: "neutral",
              active: "success",
              inactive: "error",
            }}
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
            ? pendingIds.length === 1
              ? "Are you sure you want to delete this restaurant?"
              : `Are you sure you want to delete ${pendingIds.length} restaurants?`
            : pendingIds.length === 1
            ? "Are you sure you want to restore this restaurant?"
            : `Are you sure you want to restore ${pendingIds.length} restaurants?`}

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
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
