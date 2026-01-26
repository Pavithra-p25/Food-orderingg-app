import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import useUser from "../../hooks/useUser";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schemas/LoginSchema";

interface LoginFormProps {
  show: boolean;
  onClose: () => void;
  onSignupClick?: () => void;
  onLoginSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  show,
  onClose,
  onSignupClick,
  onLoginSuccess,
}) => {
  // Single useForm instance
  const methods = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { fetchUsers } = useUser();

  const onSubmit = async (data: {
    emailOrUsername: string;
    password: string;
  }) => {
    setError(""); // reset API error
    try {
      const users = await fetchUsers();
      const foundUser = users.find(
        (u) =>
          (u.emailOrUsername === data.emailOrUsername ||
            u.fullName === data.emailOrUsername) &&
          u.password === data.password,
      );

      if (foundUser) {
        localStorage.setItem("user", JSON.stringify(foundUser));
        onLoginSuccess(foundUser);
        onClose();
        methods.reset();
      } else {
        setError("Invalid username/email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <Modal open={show} onClose={onClose} aria-labelledby="login-modal">
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          minHeight: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          align="center"
          fontWeight="bold"
          mb={3}
        >
          Login
        </Typography>

        <Typography align="center" color="text.secondary" mb={3}>
          Don’t have an account?{" "}
          <span
            style={{ color: "red", fontWeight: 600, cursor: "pointer" }}
            onClick={onSignupClick}
          >
            Signup
          </span>
        </Typography>

        {error && (
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}

        {/* Wrap inputs inside FormProvider */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <MyInput
              name="emailOrUsername"
              label="Email or Username"
              placeholder="Enter email or username"
              errorMessage={methods.formState.errors.emailOrUsername?.message}
              required
              sx={{ mb: 2 }}
            />

            <MyInput
              name="password"
              label="Password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              errorMessage={methods.formState.errors.password?.message}
              required
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            >
              Login
            </Button>
          </form>
        </FormProvider>

        <Typography
          align="center"
          color="error"
          sx={{ fontSize: 14, cursor: "pointer" }}
        >
          Forgot password?
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginForm;
