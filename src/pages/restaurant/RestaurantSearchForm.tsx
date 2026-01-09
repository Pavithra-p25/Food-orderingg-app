import React from "react";
import {
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MyButton from "../../components/newcomponents/button/MyButton";
import { FormProvider } from "react-hook-form";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import { RESTAURANT_TYPES } from "../../config/constants/RestaurantConst";

// Allowed restaurant types
const categories = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Fast Food",
  "Dessert",
];

type Props = {
  methods: any;
  control: any;
  handleSubmit: any;
  onSubmit: any;
  handleReset: () => void;
  onAdd: () => void;
};

const RestaurantSearchForm: React.FC<Props> = ({
  methods,
  control,
  handleSubmit,
  onSubmit,
  handleReset,
  onAdd,
}) => {
  return (
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

          <MyButton variant="contained" onClick={onAdd}>
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
  );
};

export default RestaurantSearchForm;
