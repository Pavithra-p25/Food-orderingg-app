import React from "react";
import Grid from "@mui/material/Grid";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import type { UseFormRegister,FieldErrors } from "react-hook-form";
import type { RestaurantValues } from "../../types/restaurantTypes";

interface LoginTabProps {
  register: UseFormRegister<RestaurantValues>;
  errors: FieldErrors<RestaurantValues>;
}

const LoginTab: React.FC<LoginTabProps> = ({ register, errors }) => (
  <Grid container spacing={2}>
    {/* Email / Username */}
    <Grid size={12}>
      <MyInput
        label="Email / Username"
        placeholder="Enter email / username"
        {...register("email")}
        errorMessage={errors.email?.message} // string | undefined
        required
      />
    </Grid>

    {/* Password */}
    <Grid size={12}>
      <MyInput
        label="Password"
        type="password"
        placeholder="Enter password"
        {...register("password")}
        errorMessage={errors.password?.message}
        required
      />
    </Grid>

    {/* Confirm Password */}
    <Grid size={12}>
      <MyInput
        label="Confirm Password"
        type="password"
        placeholder="Re-enter password"
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
        required
      />
    </Grid>
  </Grid>
);

export default LoginTab;
