import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Paper,
  DialogContent,
  Stack,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MyButton from "../../components/newcomponents/button/MyButton";
import { useForm, FormProvider } from "react-hook-form";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import type { Restaurant } from "../../types/RestaurantTypes";
import RestaurantForm from "../restaurant/RestaurantForm";
import { RESTAURANT_TYPES } from "../../config/constants/RestaurantConst";
import { restaurantDefaultValues } from "./restaurantDefaultValues";
import MyTable from "../../components/newcomponents/table/MyTable";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";

// Allowed restaurant types
const categories = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Fast Food",
  "Dessert",
];

const RestaurantSearch: React.FC = () => {
  const methods = useForm<Restaurant>({
    defaultValues: {
      ...restaurantDefaultValues,
    },
  });

  const { control, handleSubmit, reset } = methods;
  const [results, setResults] = useState<Restaurant[]>([]); //search results
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const { getAllRestaurants } = useRestaurants(); //function from hook
  const [openAddForm, setOpenAddForm] = useState(false); //form popup state

  // Snackbar states for delete
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // edit state
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );

  //  Dialog states for delete confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants(); //fetch all restaurants
        setAllRestaurants(data);
        setResults(data); //show all by default
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
        //check input is filled , then filter
        return (
          (data.restaurantName &&
            (res.restaurantName ?? "")
              .toLowerCase()
              .includes(data.restaurantName.toLowerCase().trim())) ||
          (data.category &&
            (res.category ?? "").toLowerCase().trim() ===
              data.category.toLowerCase().trim()) ||
          (data.restaurantType &&
            (res.restaurantType ?? "").toLowerCase().trim() ===
              data.restaurantType.toLowerCase().trim()) ||
          (data.city &&
            (res.city ?? "")
              .toLowerCase()
              .includes(data.city.toLowerCase().trim())) ||
          (data.state &&
            (res.state ?? "")
              .toLowerCase()
              .includes(data.state.toLowerCase().trim())) ||
          (data.phone &&
            (res.phone ?? "")
              .toLowerCase()
              .includes(data.phone.toLowerCase().trim())) ||
          (data.email &&
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

  //  Delete
  const handleDeleteClick = (restaurant: Restaurant) => {
    setPendingDelete(restaurant); // store restaurant for deletion
    setShowConfirm(true); // open confirmation dialog
  };

  const handleConfirmYes = () => {
    if (!pendingDelete) return;

    // Remove from table only
    setResults((prev) => prev.filter((r) => r !== pendingDelete));

    // Show success snackbar
    setSnackbarMessage(
      `"${pendingDelete.restaurantName}" removed successfully`
    );
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    setPendingDelete(null);
    setShowConfirm(false);
  };

  const handleConfirmNo = () => {
    setPendingDelete(null);
    setShowConfirm(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* SEARCH FORM CONTAINER */}
        <Grid size={12}>
          <FormProvider {...methods}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              {/* TITLE + ADD BUTTON */}
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
              >
                <Typography variant="h4">Search Restaurants</Typography>

                <MyButton
                  variant="contained"
                  onClick={() => setOpenAddForm(true)}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Restaurant
                </MyButton>
              </Grid>

              {/* FORM */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <MyInput
                      name="restaurantName"
                      control={control}
                      label="Restaurant Name"
                      placeholder="Enter name"
                    />
                  </Grid>

                  <Grid size={6}>
                    <MyDropdown
                      name="category"
                      control={control}
                      label="Category"
                      options={categories}
                    />
                  </Grid>

                  <Grid size={6}>
                    <MyDropdown
                      name="restaurantType"
                      control={control}
                      label="Restaurant Type"
                      options={RESTAURANT_TYPES}
                    />
                  </Grid>

                  <Grid size={6}>
                    <MyInput
                      name="city"
                      control={control}
                      label="City"
                      placeholder="Enter city"
                    />
                  </Grid>

                  <Grid size={6}>
                    <MyInput
                      name="state"
                      control={control}
                      label="State"
                      placeholder="Enter state"
                    />
                  </Grid>

                  <Grid size={6}>
                    <MyInput
                      name="email"
                      control={control}
                      label="Email"
                      placeholder="Enter email"
                    />
                  </Grid>
                  <Grid size={6}>
                    <MyInput
                      name="phone"
                      control={control}
                      label="Phone Number"
                      placeholder="Enter phone number"
                    />
                  </Grid>

                  <Grid
                    size={12}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <MyButton variant="outlined" onClick={handleReset}>
                      <RestartAltIcon sx={{ mr: 1 }} />
                      Reset
                    </MyButton>

                    <MyButton type="submit" variant="contained">
                      <SearchIcon sx={{ mr: 1 }} />
                      Search
                    </MyButton>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </FormProvider>
        </Grid>

        {/* RESULTS TABLE */}
        <Grid size={12}>
          <MyTable
            rows={results}
            columns={[
              {
                label: "Restaurant Name",
                render: (r) => r.restaurantName,
                sortValue: (r) => r.restaurantName,
              },
              {
                label: "Category",
                render: (r) => r.category,
                sortValue: (r) => r.category,
              },
              {
                label: "Type",
                render: (r) => r.restaurantType,
                sortValue: (r) => r.restaurantType ?? "",
              },
              {
                label: "City",
                render: (r) => r.city,
                sortValue: (r) => r.city,
              },
              {
                label: "State",
                render: (r) => r.state,
                sortValue: (r) => r.state,
              },
              {
                label: "Phone Number",
                render: (r) => r.phone ?? "-",
                sortValue: (r) => r.phone ?? "",
              },

              {
                label: "Email",
                render: (r) => r.email,
                sortValue: (r) => r.email,
              },
              {
                label: "Actions",
                render: (r) => (
                  <>
                    <EditNoteIcon
                      color="primary"
                      sx={{ cursor: "pointer", mr: 1 }}
                      onClick={() => {
                        setEditingRestaurant(r); // set restaurant to edit
                        setOpenAddForm(true); // open form popup
                      }}
                    />
                    <MyButton
                      variant="outline-secondary"
                      style={{ minWidth: 0, padding: 0 }}
                      onClick={() => handleDeleteClick(r)}
                    >
                      <DeleteIcon color="error" />
                    </MyButton>
                  </>
                ),
              },
            ]}
          />
        </Grid>
      </Grid>

      {/* ADD - EDIT RESTAURANT POPUP */}
      <RestaurantForm
        show={openAddForm}
        onClose={() => {
          setOpenAddForm(false);
          setEditingRestaurant(null); // reset after closing
        }}
        restaurant={editingRestaurant} // pass restaurant to edit
      />

      {/* Confirmation Dialog */}
      <MyDialog open={showConfirm} onClose={handleConfirmNo} maxWidth="xs">
        <DialogContent sx={{ textAlign: "center" }}>
          Are you sure you want to delete "{pendingDelete?.restaurantName}"?
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

      {/* Snackbar for delete success */}
      <MySnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
        position={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default RestaurantSearch;
