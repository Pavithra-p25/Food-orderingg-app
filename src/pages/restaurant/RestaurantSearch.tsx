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
// HOOK
import { useRestaurantActions } from "../../hooks/restaurant/useRestaurantActions";

const RestaurantSearch: React.FC = () => {
  const methods = useForm<Restaurant>({
    defaultValues: { ...restaurantDefaultValues },
  });

  const { control, handleSubmit, reset } = methods;

  const [results, setResults] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  //hook for api actions
  const { getAllRestaurants, softDeleteRestaurant, activateRestaurant } =
    useRestaurants();

  const [openAddForm, setOpenAddForm] = useState(false);

  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );

  //ACTIONS HOOK
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showConfirm,
    pendingAction,
    pendingIds,
    handleDeleteClick,
    handleRestoreClick,
    handleConfirmYes,
    handleConfirmNo,
    setSnackbarOpen,
  } = useRestaurantActions(softDeleteRestaurant, activateRestaurant); //pass api functions to action hook to receieve state and handlers

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
    reset(restaurantDefaultValues); //reset search form 
    setResults(allRestaurants); // table
  };

  const onSubmit = async (data: Restaurant) => {
    try {
      const filtered = allRestaurants.filter((res: Restaurant) => {
        const match = (field?: string, value?: string) =>
          value && field?.toLowerCase().includes(value.toLowerCase().trim());

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
          activeTab="all"
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
          activeTab="active"
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
          activeTab="inactive"
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

      {/* CONFIRMATION DIALOG */}
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
            <MyButton
              variant="contained"
              onClick={() => handleConfirmYes(setAllRestaurants, setResults)}
            >
              Yes
            </MyButton>
          </Stack>
        </DialogContent>
      </MyDialog>

      {/* SNACKBAR */}
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
