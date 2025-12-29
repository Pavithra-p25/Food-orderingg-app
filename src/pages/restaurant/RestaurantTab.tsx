import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Controller } from "react-hook-form";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import { FIELD_LABELS } from "./restaurantFieldValues";
import type { TabProps } from "./TabProps";

const RestaurantTab: React.FC<TabProps> = ({ register, errors, control }) => (
  <Grid container spacing={2}>
    {/* Restaurant Name */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label={FIELD_LABELS.restaurantName}
        placeholder="Enter restaurant name"
        {...register("restaurantName")}
        errorMessage={errors.restaurantName?.message}
        required
      />
    </Grid>

    {/* Restaurant Type */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyDropdown
        label={FIELD_LABELS.restaurantType}
        options={["Veg", "Non-Veg", "Both"]}
        {...register("restaurantType")}
        errorMessage={errors.restaurantType?.message}
        required
      />
    </Grid>

    {/* Category */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyDropdown
        label={FIELD_LABELS.category}
        options={["Indian", "Chinese", "Fast Food", "Italian", "Mexican"]}
        {...register("category")}
        errorMessage={errors.category?.message}
        required
      />
    </Grid>

    {/* Upload Logo */}
    <Grid size={{ xs: 12, md: 6 }}>
      <Button variant="outlined" component="label" fullWidth>
        Upload Logo
        <input type="file" hidden {...register("logo")} />
      </Button>
    </Grid>

    {/* Opening Time */}
    <Grid size={{ xs: 12, md: 6 }}>
     <Controller
  name="openingTime"
  control={control!}
  render={({ field }) => (
    <TimePicker
      label="Opening Time"
      value={field.value || null}
      onChange={field.onChange}
      slotProps={{
        textField: {
          fullWidth: true,
        },
      }}
    />
  )}
/>

    </Grid>

    {/* Closing Time */}
    <Grid size={{ xs: 12, md: 6 }}>
      <Controller
  name="closingTime"
  control={control!}
  render={({ field }) => (
    <TimePicker
      label="Closing Time"
      value={field.value || null}
      onChange={field.onChange}
      slotProps={{
        textField: {
          fullWidth: true,
        },
      }}
    />
  )}
/>

    </Grid>

    {/* Website / Social Link */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="Website / Social Link"
        type="url"
        placeholder="Enter your website link"
        {...register("website")}
        errorMessage={errors.website?.message}
      />
    </Grid>
  </Grid>
);

export default RestaurantTab;
