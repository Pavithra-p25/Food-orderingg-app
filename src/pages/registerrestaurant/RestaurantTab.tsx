import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MyTimePicker from "../../components/newcomponents/timepicker/MyTimePicker";
import { Controller, useFormContext } from "react-hook-form";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import MyButton from "../../components/newcomponents/button/MyButton";
import type { Restaurant } from "../../types/RestaurantTypes";
import {
  RESTAURANT_TYPES,
  DELIVERY_TIME_OPTIONS,
} from "../../config/constants/RestaurantConstant";
import MyCheckbox from "../../components/newcomponents/checkbox/MyCheckbox";
import MyDatePicker from "../../components/newcomponents/datepicker/MyDatePicker";

const RestaurantTab: React.FC = () => {
  const {
    control,
    watch,

    formState: { errors },
  } = useFormContext<Restaurant>();

  const logo = watch("logo");


  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    if (logo && logo[0]) {
      const url = URL.createObjectURL(logo[0]);
      setFileUrl(url);

      return () => URL.revokeObjectURL(url); // prevent memory leak
    } else {
      setFileUrl("");
    }
  }, [logo]);

  return (
    <Grid container spacing={2}>
      {/* Restaurant Name */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          label="Restaurant Name"
          placeholder="Enter restaurant name"
          name="restaurantName"
          errorMessage={errors.restaurantName?.message}
          required
        />
      </Grid>

      {/* Category */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyDropdown
          name="category"
          label="Category"
          options={["Indian", "Chinese", "Fast Food", "Italian", "Mexican"]}
          required
        />
      </Grid>

      {/* Average Delivery Time */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyDropdown
          name="averageDeliveryTime"
          label="Average Delivery Time"
          options={[...DELIVERY_TIME_OPTIONS]}
        />
      </Grid>

      {/* Opening Time */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTimePicker<Restaurant>
          name="openingTime"
          label="Opening Time"
          control={control}
        />
      </Grid>

      {/* Closing Time */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTimePicker<Restaurant>
          name="closingTime"
          label="Closing Time"
          control={control}
        />
      </Grid>

      {/* Website */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          label="Website / Social Link"
          type="url"
          placeholder="Enter your website link"
          name="website"
          errorMessage={errors.website?.message}
        />
      </Grid>

      {/* Upload Logo */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="logo"
          control={control}
          render={({ field }) => (
            <>
              <MyButton
                variant="outlined"
                fullWidth
                onClick={() => document.getElementById("logo-upload")?.click()}
                style={{ height: 56 }}
              >
                {logo && logo[0] ? logo[0].name : "Upload Logo"}
              </MyButton>
              <input
                type="file"
                id="logo-upload"
                hidden
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) {
                    field.onChange(files);
                  }
                }}
              />
              {fileUrl && (
                <a
                  href={fileUrl}
                  download={logo?.[0]?.name}
                  style={{ display: "block", marginTop: 8 }}
                >
                  Download {logo?.[0]?.name}
                </a>
              )}
            </>
          )}
        />
      </Grid>

      {/* Opening Date */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyDatePicker
          name="openingDate"
          label="Opening Date"
          disableFuture={false} // allow future opening date if needed
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MyCheckbox
          name="restaurantType"
          label="Restaurant Type"
          options={RESTAURANT_TYPES.map((type) => ({
            label: type,
            value: type,
          }))}
          onChangeOverride={(newValue: string[]) => {
            const currentType = watch("restaurantType") || [];
            const wasBothSelected = currentType.includes("Both");
            const isBothSelected = newValue.includes("Both");

            // User unchecked Both explicitly - Clear all
            if (wasBothSelected && !isBothSelected) {
              return [];
            }

            //  User checked Both explicitly - Select all
            if (!wasBothSelected && isBothSelected) {
              return ["Veg", "Non-Veg", "Both"];
            }

            //  Logic for Veg/Non-Veg interactions
            const hasVeg = newValue.includes("Veg");
            const hasNonVeg = newValue.includes("Non-Veg");

            if (hasVeg && hasNonVeg) {
              // If both individual options are present, ensure Both is checked
              return ["Veg", "Non-Veg", "Both"];
            } else {
              // If one is missing, ensure Both is NOT checked
              return newValue.filter((v) => v !== "Both");
            }
          }}
        />

      </Grid>
    </Grid>
  );
};

export default RestaurantTab;
