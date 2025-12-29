import React from "react";
import Grid from "@mui/material/Grid";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyTextarea from "../../components/newcomponents/textfields/MyTextarea";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { RestaurantValues } from "../../types/restaurantTypes";

interface LocationTabProps {
  register: UseFormRegister<RestaurantValues>;
  errors: FieldErrors<RestaurantValues>;
}

const LocationTab: React.FC<LocationTabProps> = ({ register, errors }) => (
  <Grid container spacing={2}>
    {/* Street / Address */}
    <Grid size={12}>
      <MyTextarea
        label="Street / Address"
        placeholder="Enter full address"
        {...register("address")}
        errorMessage={errors.address?.message}
        required
      />
    </Grid>

    {/* City */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="City"
        placeholder="Enter city"
        {...register("city")}
        errorMessage={errors.city?.message}
        required
      />
    </Grid>

    {/* State */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="State"
        placeholder="Enter state"
        {...register("state")}
        errorMessage={errors.state?.message}
        required
      />
    </Grid>

    {/* Country */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="Country"
        placeholder="Enter country"
        {...register("country")}
        errorMessage={errors.country?.message}
        required
      />
    </Grid>

    {/* Pincode */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="Pincode"
        placeholder="Enter pincode"
        {...register("pincode")}
        errorMessage={errors.pincode?.message}
      />
    </Grid>
  </Grid>
);

export default LocationTab;
