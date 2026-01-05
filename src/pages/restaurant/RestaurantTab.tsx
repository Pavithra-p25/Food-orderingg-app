import React, { useState } from "react";
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
} from "../../config/constants/RestaurantConst";
import MyRadioButton from "../../components/newcomponents/radiobutton/MyRadioButton";
import MyDatePicker from "../../components/newcomponents/datepicker/MyDatePicker";

const RestaurantTab: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Restaurant>();
  const [fileName, setFileName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");

  return (
    <Grid container spacing={2}>
      {/* Restaurant Name */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyInput
          label="Restaurant Name"
          placeholder="Enter restaurant name"
          name="restaurantName"
          control={control}
          errorMessage={errors.restaurantName?.message}
          required
        />
      </Grid>

      {/* Restaurant Type */}
      <Grid size={{ xs: 12, md: 6 }}>
        <label style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>
          Restaurant Type
        </label>

        <Grid container spacing={2}>
          {RESTAURANT_TYPES.map((type) => (
            <Grid key={type}>
              <MyRadioButton name="restaurantType" label={type} value={type} />
            </Grid>
          ))}
        </Grid>
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
          options={[...DELIVERY_TIME_OPTIONS]}
          control={control}
          errors={errors}
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
          control={control}
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
                {fileName ? fileName : "Upload Logo"}
              </MyButton>
              <input
                type="file"
                id="logo-upload"
                hidden
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) {
                    field.onChange(files);
                    setFileName(files[0].name);
                    setFileUrl(URL.createObjectURL(files[0]));
                  }
                }}
              />
              {fileUrl && (
                <a
                  href={fileUrl}
                  download={fileName}
                  style={{ display: "block", marginTop: 8 }}
                >
                  Download {fileName}
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
    </Grid>
  );
};

export default RestaurantTab;
