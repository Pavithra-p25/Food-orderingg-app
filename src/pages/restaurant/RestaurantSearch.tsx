import React, { useState } from "react";
import { Container, Grid, Typography, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
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

  const { control, handleSubmit } = methods;
  const [results, setResults] = useState<Restaurant[]>([]);
  const { getAllRestaurants } = useRestaurants();
  const [openAddForm, setOpenAddForm] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const all: Restaurant[] = await getAllRestaurants();

      const filtered = all.filter((res: Restaurant) => {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* SEARCH FORM CONTAINER */}
        <Grid size={12}>
          <FormProvider {...methods}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              {/* TITLE + ADD BUTTON INSIDE CONTAINER */}
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
              >
                <Typography variant="h4">
                  Search Restaurants
                </Typography>

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

                  <Grid size={12} sx={{ textAlign: "right", mt: 2 }}>
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
        {results.length > 0 && (
          <Grid size={12}>
            <MyTable
              rows={results}
              columns={[
                { label: "Restaurant Name", render: (r) => r.restaurantName },
                { label: "Category", render: (r) => r.category },
                { label: "Type", render: (r) => r.restaurantType },
                { label: "City", render: (r) => r.city },
                { label: "State", render: (r) => r.state },
                { label: "Email", render: (r) => r.email },
                {
                  label: "Actions",
                  render: (r) => (
                    <>
                      <EditIcon
                        color="primary"
                        sx={{ cursor: "pointer", mr: 1 }}
                        onClick={() => console.log("Edit", r)}
                      />
                      <DeleteIcon
                        color="error"
                        sx={{ cursor: "pointer" }}
                        onClick={() => console.log("Delete", r)}
                      />
                    </>
                  ),
                },
              ]}
            />
          </Grid>
        )}
      </Grid>

      {/* ADD RESTAURANT POPUP */}
      <RestaurantForm
        show={openAddForm}
        onClose={() => setOpenAddForm(false)}
      />
    </Container>
  );
};

export default RestaurantSearch;
