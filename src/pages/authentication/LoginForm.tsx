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
import { validateRequired } from "../../utils/validators/GeneralValidators";
import useUser from "../../hooks/useUser";
import { useForm } from "react-hook-form";


interface LoginFormProps {
  show: boolean;
  onClose: () => void;
  onSignupClick?: () => void;
  onLoginSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ show, onClose, onSignupClick, onLoginSuccess }) => {
  const { control} = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false); 

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    error: "",
    emailError: "",
    passwordError: "",
  });

  const { fetchUsers } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      emailError: name === "emailOrUsername" ? "" : prev.emailError,
      passwordError: name === "password" ? "" : prev.passwordError,
    }));
  };

  const handleLogin = async () => {
    const emailError = validateRequired(
      formData.emailOrUsername,
      "Email or Username",
    );
    const passwordError = validateRequired(formData.password, "Password");

    setFormData((prev) => ({
      ...prev,
      emailError: emailError || "",
      passwordError: passwordError || "",
      error: "",
    }));

    if (emailError || passwordError) return;

    try {
      const users = await fetchUsers();
      const foundUser = users.find(
        (u) =>
          (u.emailOrUsername === formData.emailOrUsername ||
            u.fullName === formData.emailOrUsername) &&
          u.password === formData.password,
      );

      if (foundUser) {
        localStorage.setItem("user", JSON.stringify(foundUser));
        onLoginSuccess(foundUser);
        onClose();
        setFormData({
          emailOrUsername: "",
          password: "",
          error: "",
          emailError: "",
          passwordError: "",
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          error: "Invalid username/email or password",
        }));
      }
    } catch (err) {
      console.error(err);
      setFormData((prev) => ({
        ...prev,
        error: "Something went wrong. Try again!",
      }));
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
        {/* Header */}
        <Typography
          variant="h6"
          component="h2"
          align="center"
          fontWeight="bold"
          mb={3}
        >
          Login
        </Typography>

        {/* Signup link */}
        <Typography align="center" color="text.secondary" mb={3}>
          Don’t have an account?{" "}
          <span
            style={{ color: "red", fontWeight: 600, cursor: "pointer" }}
            onClick={onSignupClick}
          >
            Signup
          </span>
        </Typography>

        {/* API Error */}
        {formData.error && (
          <Typography color="error" align="center" mb={2}>
            {formData.error}
          </Typography>
        )}

        {/* Email or Username */}
        <MyInput
          label="Email or Username"
          placeholder="Enter email or username"
          name="emailOrUsername"
          control={control}
          value={formData.emailOrUsername}
          onChange={handleChange}
          errorMessage={formData.emailError}
          required
          sx={{ mb: 2 }}
        />

        {/* Password */}
        <MyInput
          label="Password"
          placeholder="Enter password"
          name="password"
          control={control}
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          errorMessage={formData.passwordError}
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

        {/* Login button */}
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* Forgot password */}
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
