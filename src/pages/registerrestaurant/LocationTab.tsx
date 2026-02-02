import React from "react";
import Grid from "@mui/material/Grid";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyTextarea from "../../components/newcomponents/textfields/MyTextarea";
import { useFormContext } from "react-hook-form";
import MyCheckbox from "../../components/newcomponents/checkbox/MyCheckbox";

const LocationTab: React.FC = () => {
  const {
    control,
    formState: { errors },
    
  } = useFormContext();

 
  return (
     <Grid container spacing={{ xs: 2, sm: 3 }}>
      
      <Grid size={{ xs: 12 }}>
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
     <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          name="city"
          label="City"
          placeholder="Enter city"
          required
          errorMessage={errors.city?.message?.toString()}
        />
      </Grid>

      {/* State */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          name="state"
          label="State"
          placeholder="Enter state"
          required
          errorMessage={errors.state?.message?.toString()}
        />
      </Grid>

      {/* Country */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          name="country"
          label="Country"
          placeholder="Enter country"
          required
          errorMessage={errors.country?.message?.toString()}
        />
      </Grid>

      {/* Pincode */}
        <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          name="pincode"
          label="Pincode"
          placeholder="Enter pincode"
          required
          errorMessage={errors.pincode?.message?.toString()}
        />
      </Grid>
 <Grid size={{ xs: 12 }}>
      <MyCheckbox
        name="acceptTerms"
        label="I agree to the Terms & Conditions"
       required
      />
</Grid>
    </Grid>
  );
};

export default LocationTab;
