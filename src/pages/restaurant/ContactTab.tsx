import React from "react";
import Grid from "@mui/material/Grid";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import { useFormContext } from "react-hook-form";

const ContactTab: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Grid container spacing={2}>
      {/* Owner Name */}
      <Grid size={12}>
        <MyInput
          name="ownerName"
          control={control}
          label="Owner Name"
          placeholder="Enter owner name"
          required
          errorMessage={errors.ownerName?.message?.toString()}
        />
      </Grid>

      {/* Support Email */}
      <Grid size={12}>
        <MyInput
          name="supportEmail"
          control={control}
          label="Support Email"
          placeholder="Enter support email"
          required
          errorMessage={errors.supportEmail?.message?.toString()}
        />
      </Grid>

      {/* Phone */}
      <Grid size={12}>
        <MyInput
          name="phone"
          control={control}
          label="Phone"
          placeholder="Enter phone number"
          required
          errorMessage={errors.phone?.message?.toString()}
        />
      </Grid>

      {/* Alternate Phone */}
      <Grid size={12}>
        <MyInput
          name="alternatePhone"
          control={control}
          label="Alternate Phone"
          placeholder="Enter alternate phone"
          errorMessage={errors.alternatePhone?.message?.toString()}
        />
      </Grid>
    </Grid>
  );
};

export default ContactTab;
