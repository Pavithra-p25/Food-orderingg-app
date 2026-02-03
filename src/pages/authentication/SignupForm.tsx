import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../schemas/signupSchema";
import useUser from "../../hooks/useUser";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";

interface SignupFormProps {
  show: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

interface SignupFormValues {
  fullName: string;
  emailOrUsername: string;
  password: string;
  confirmPassword: string;
}

const SignupForm: React.FC<SignupFormProps> = ({
  show,
  onClose,
  onLoginClick,
}) => {
  const { fetchUsers, addUser } = useUser();
  const { showSnackbar } = useDialogSnackbar();
  const [visibility, setVisibility] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [error, setError] = useState("");

  const methods = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      fullName: "",
      emailOrUsername: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError("");
    try {
      const users = await fetchUsers();
      const existingUser = users.find(
        (u) =>
          u.emailOrUsername.trim().toLowerCase() ===
          data.emailOrUsername.trim().toLowerCase(),
      );

      if (existingUser) {
        setError("User already exists");
        return;
      }

      await addUser({
        fullName: data.fullName.trim(),
        emailOrUsername: data.emailOrUsername.trim(),
        password: data.password.trim(),
      });

      showSnackbar("Signup successful!", "success");
      methods.reset();
      onClose();
    } catch (err) {
      console.error(err);
      showSnackbar("Something went wrong. Try again!", "error");
    }
  };

  return (
    <MyDialog open={show} onClose={onClose} title="Sign Up" maxWidth="xs">
      <Typography align="center" color="text.secondary" mb={4}>
        Already have an account?{" "}
        <span
          style={{ cursor: "pointer", color: "red", fontWeight: 600 }}
          onClick={onLoginClick}
        >
          Login
        </span>
      </Typography>

      {error && (
        <Typography color="error" align="center" mb={2}>
          {error}
        </Typography>
      )}

      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
        >
          {/* Full Name (no Controller) */}
          <Box mb={2}>
            <MyInput
              {...methods.register("fullName")}
              label="Full Name"
              placeholder="Enter your full name"
              errorMessage={methods.formState.errors.fullName?.message}
              required
            />
          </Box>

          {/* Email / Username (no Controller) */}
          <Box mb={2}>
            <MyInput
              {...methods.register("emailOrUsername")}
              label="Email / Username"
              placeholder="Enter email or username"
              errorMessage={methods.formState.errors.emailOrUsername?.message}
              required
            />
          </Box>

          {/* Password */}
          <Controller
            name="password"
            control={methods.control}
            render={({ field, fieldState }) => (
              <Box mb={2} position="relative">
                <MyInput
                  {...field}
                  label="Password"
                  placeholder="Create a password"
                  type={visibility.showPassword ? "text" : "password"}
                  errorMessage={fieldState.error?.message}
                  required
                />
                <IconButton
                  onClick={() =>
                    setVisibility((p) => ({
                      ...p,
                      showPassword: !p.showPassword,
                    }))
                  }
                  sx={{ position: "absolute", top: 12, right: 8 }}
                >
                  {visibility.showPassword ? "🙈" : "👁️"}
                </IconButton>
              </Box>
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={methods.control}
            render={({ field, fieldState }) => (
              <Box mb={2} position="relative">
                <MyInput
                  {...field}
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type={visibility.showConfirmPassword ? "text" : "password"}
                  errorMessage={fieldState.error?.message}
                  required
                />
                <IconButton
                  onClick={() =>
                    setVisibility((p) => ({
                      ...p,
                      showConfirmPassword: !p.showConfirmPassword,
                    }))
                  }
                  sx={{ position: "absolute", top: 12, right: 8 }}
                >
                  {visibility.showConfirmPassword ? "🙈" : "👁️"}
                </IconButton>
              </Box>
            )}
          />

          <Box display="flex" justifyContent="center">
            <MyButton type="submit" variant="cancel">
              Sign Up
            </MyButton>
          </Box>
        </Box>
      </FormProvider>
    </MyDialog>
  );
};

export default SignupForm;
