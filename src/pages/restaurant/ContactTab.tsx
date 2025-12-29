import React from "react";
import Grid from "@mui/material/Grid";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import type { TabProps } from "../../types/restaurantTypes";

const ContactTab: React.FC<TabProps> = ({ register, errors }) => (
  <Grid container spacing={2}>
    {/* Owner Name */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="Owner Name"
        placeholder="Enter your name"
        {...register("ownerName")}
        errorMessage={errors.ownerName?.message}
        required
      />
    </Grid>

    {/* Support Email */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="Support Email"
        placeholder="Enter email"
        {...register("supportEmail")}
        errorMessage={errors.supportEmail?.message}
        required
      />
    </Grid>

    {/* Phone */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="Phone"
        placeholder="Enter phone no"
        {...register("phone")}
        errorMessage={errors.phone?.message}
        required
      />
    </Grid>

    {/* Alternate Phone */}
    <Grid size={{ xs: 12, md: 6 }}>
      <MyInput
        label="Alternate Phone"
        placeholder="Alternate phone no"
        {...register("alternatePhone")}
        errorMessage={errors.alternatePhone?.message}
      />
    </Grid>
  </Grid>
);

export default ContactTab;
