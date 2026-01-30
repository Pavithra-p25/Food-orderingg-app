import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyButton from "../../components/newcomponents/button/MyButton";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schemas/LoginSchema";
import useUser from "../../hooks/useUser";
import { useSnackbar } from "../../context/SnackbarContext";

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
const { showSnackbar } = useSnackbar();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // Mobile
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // Tablet

  const onSubmit = async (data: { emailOrUsername: string; password: string }) => {
    setError("");
    try {
      const users = await fetchUsers();
      const foundUser = users.find(
        (u) =>
          (u.emailOrUsername === data.emailOrUsername ||
            u.fullName === data.emailOrUsername) &&
          u.password === data.password
      );

      if (foundUser) {
        localStorage.setItem("user", JSON.stringify(foundUser));
        onLoginSuccess(foundUser);
        showSnackbar("Login successful!", "success");
        onClose();
        methods.reset();
      } else {
        setError("Invalid username/email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
      showSnackbar("Something went wrong. Try again!", "error");
    }
  };

  return (
    <>
      <Modal open={show} onClose={onClose} aria-labelledby="login-modal">
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isXs ? "90%" : isSm ? 400 : 450,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: isXs ? 3 : 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
      
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.600",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant={isXs ? "h6" : "h5"}
            component="h2"
            align="center"
            fontWeight="bold"
            mb={2}
          >
            Login
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            mb={3}
            sx={{ fontSize: isXs ? 14 : 15 }}
          >
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <MyButton
                type="submit"
                variant="cancel"
                sx={{
                  display: "block",
                  mx: "auto",
                  mt: 2,
                  mb: 1,
                  width: isXs ? "80%" : isSm ? "70%" : "60%",
                  fontSize: isXs ? "0.875rem" : "1rem",
                }}
              >
                Login
              </MyButton>
            </form>
          </FormProvider>

          <Typography
            align="center"
            color="error"
            sx={{ fontSize: 14, cursor: "pointer", mt: 1 }}
          >
            Forgot password?
          </Typography>
        </Box>
      </Modal>

    </>
  );
};

export default LoginForm;
