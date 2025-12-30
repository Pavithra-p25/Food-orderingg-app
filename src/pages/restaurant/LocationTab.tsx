import React from "react";
import Grid from "@mui/material/Grid";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyTextarea from "../../components/newcomponents/textfields/MyTextarea";
import { useFormContext } from "react-hook-form";

const LocationTab: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      {/* Address - full width */}
      <Grid size={12}>
        <MyTextarea
          name="address"
          control={control}
          label="Address"
          placeholder="Enter address"
          rows={4}
          required
          errors={errors}
        />
      </Grid>

      {/* City */}
      <Grid size={6}>
        <MyInput
          name="city"
          control={control}
          label="City"
          placeholder="Enter city"
          required
          errorMessage={errors.city?.message?.toString()}
        />
      </Grid>

      {/* State */}
      <Grid size={6}>
        <MyInput
          name="state"
          control={control}
          label="State"
          placeholder="Enter state"
          required
          errorMessage={errors.state?.message?.toString()}
        />
      </Grid>

      {/* Country */}
      <Grid size={6}>
        <MyInput
          name="country"
          control={control}
          label="Country"
          placeholder="Enter country"
          required
          errorMessage={errors.country?.message?.toString()}
        />
      </Grid>

      {/* Pincode */}
      <Grid size={6}>
        <MyInput
          name="pincode"
          control={control}
          label="Pincode"
          placeholder="Enter pincode"
          required
          errorMessage={errors.pincode?.message?.toString()}
        />
      </Grid>
    </Grid>
  );
};

export default LocationTab;
