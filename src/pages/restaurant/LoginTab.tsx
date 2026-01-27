import React from "react";
import Grid from "@mui/material/Grid";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import { useFormContext } from "react-hook-form";

const LoginTab: React.FC = () => {
  const { formState: { errors } } = useFormContext();

  return (
    <Grid container spacing={2}>
      {/* Email */}
      <Grid size={12}>
        <MyInput
          name="email"
          label="Email"
          placeholder="Enter email"
          required
          errorMessage={errors.email?.message?.toString()}
        />
      </Grid>

      {/* Password */}
      <Grid size={12}>
        <MyInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter password"
          required
          errorMessage={errors.password?.message?.toString()}
        />
      </Grid>

      {/* Confirm Password */}
      <Grid size={12}>
        <MyInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          required
          errorMessage={errors.confirmPassword?.message?.toString()}
        />
      </Grid>
    </Grid>
  );
};

export default LoginTab;
