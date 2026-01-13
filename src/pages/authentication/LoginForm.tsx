import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import MyInput from "../../components/textfields/MyInput";
import { validateRequired } from "../../utils/validators/GeneralValidators";

import useUser from "../../hooks/useUser"; //  hook

interface LoginFormProps {
  show: boolean;
  onClose: () => void;
  onSignupClick?: () => void; // switch to signup modal
  onLoginSuccess: (user: any) => void; // send logged in user to header
}

const LoginForm: React.FC<LoginFormProps> = ({
  show,
  onClose,
  onSignupClick,
  onLoginSuccess
}) => {
  const [showPassword, setShowPassword] = useState(false); //password show/hide

  // state object 
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    error: "",
    emailError: "",
    passwordError: ""
  });

  // Hook for user 
  const { fetchUsers } = useUser();

  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      emailError: name === "emailOrUsername" ? "" : prev.emailError,
      passwordError: name === "password" ? "" : prev.passwordError
    }));
  };

  // Handle login
  const handleLogin = async () => {
    //  Required validation
    const emailError = validateRequired(formData.emailOrUsername, "Email or Username");
    const passwordError = validateRequired(formData.password, "Password");

    setFormData((prev) => ({
      ...prev,
      emailError: emailError || "",
      passwordError: passwordError || "",
      error: ""
    }));

    if (emailError || passwordError) return; //  stop if required fails

    try {
      // Fetch all users via hook
      const users = await fetchUsers();
      const foundUser = users.find(
        (u) =>
          (u.emailOrUsername === formData.emailOrUsername ||
            u.fullName === formData.emailOrUsername) &&
          u.password === formData.password
      );

      if (foundUser) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(foundUser));

        // send user data to header
        onLoginSuccess(foundUser);

        // Close modal and reset form
        onClose();
        setFormData({
          emailOrUsername: "",
          password: "",
          error: "",
          emailError: "",
          passwordError: ""
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          error: "Invalid username/email or password"
        }));
      }
    } catch (err) {
      console.error(err);
      setFormData((prev) => ({
        ...prev,
        error: "Something went wrong. Try again!"
      }));
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      {/* Header */}
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold">Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Signup link */}
        <p className="text-center text-muted mb-4">
          Don’t have an account?{" "}
          <span
            className="text-danger fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={onSignupClick}
          >
            Signup
          </span>
        </p>

        {/* API Error message */}
        {formData.error && (
          <p className="text-center text-danger">{formData.error}</p>
        )}

        <Form>
          {/* Email or Username */}
          <MyInput
  label="Email or Username"
  placeholder="Enter email or username"
  name="emailOrUsername"
  value={formData.emailOrUsername}
  onChange={handleChange}
  error={formData.emailError}
  required
/>


          {/* Password */}
          <div className="position-relative">
            <MyInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formData.passwordError} 
              required
            />

            {/* Eye icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "42px",
                cursor: "pointer",
                color: "gray"
              }}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>

          {/* Login button */}
          <Button variant="danger" className="w-100 mt-3" onClick={handleLogin}>
            Login
          </Button>

          {/* Forgot password */}
          <div className="text-center mt-3">
            <span
              className="text-danger"
              style={{ cursor: "pointer", fontSize: "14px" }}
            >
              Forgot password?
            </span>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;
