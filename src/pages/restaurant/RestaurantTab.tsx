import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Controller, useFormContext } from "react-hook-form";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import { RESTAURANT_TYPES } from "../../types/restaurantTypes";
import type { RestaurantValues } from "../../types/restaurantTypes";
import dayjs from 'dayjs';
import { DELIVERY_TIME_OPTIONS } from "../../types/restaurantTypes";


const RestaurantTab: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<RestaurantValues>();

  return (
    <Grid container spacing={2}>
      {/* Restaurant Name */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          label="Restaurant Name"
          placeholder="Enter restaurant name"
          {...register("restaurantName")}
          errorMessage={errors.restaurantName?.message}
          required
          control={control}
        />
      </Grid>

      {/* Restaurant Type */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyDropdown
          name="restaurantType"
          label="Restaurant Type"
          options={RESTAURANT_TYPES}
          control={control}
          errors={errors}
          required
        />
      </Grid>

      {/* Category */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyDropdown
          name="category"
          label="Category"
          options={["Indian", "Chinese", "Fast Food", "Italian", "Mexican"]}
          control={control}
          errors={errors}
          required
        />
      </Grid>

      {/* Average Delivery Time */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyDropdown
          name="averageDeliveryTime"
          label="Average Delivery Time"
          options={DELIVERY_TIME_OPTIONS}
          control={control}
          errors={errors}
        />
      </Grid>

      {/* Opening Time */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="openingTime"
          control={control}
          render={({ field }) => (
            <TimePicker
              label="Opening Time"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) =>
                field.onChange(newValue?.toISOString())
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          )}
        />
      </Grid>

      {/* Closing Time */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="closingTime"
          control={control}
          render={({ field }) => (
            <TimePicker
              label="Closing Time"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) =>
                field.onChange(newValue?.toISOString())
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          )}
        />
      </Grid>

      {/* Website */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          label="Website / Social Link"
          type="url"
          placeholder="Enter your website link"
          {...register("website")}
          errorMessage={errors.website?.message}
          control={control}
        />
      </Grid>

      {/* Upload Logo */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Button variant="outlined" component="label" fullWidth>
          Upload Logo
          <input type="file" hidden {...register("logo")} />
        </Button>
      </Grid>
    </Grid>

  );
};

export default RestaurantTab;
