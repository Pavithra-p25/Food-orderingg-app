import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import MyInput from "../../components/textfields/MyInput";
import MyButton from "../../components/button/MyButton";
import { validateRequired, validateEmail } from "../../utils/validators/GeneralValidators";
import useUser from "../../hooks/useUser"; // custom hook

interface SignupFormProps {
  show: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

interface Errors {
  fullName?: string;
  emailOrUsername?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormState {
  fullName: string;
  emailOrUsername: string;
  password: string;
  confirmPassword: string;
}

interface VisibilityState {
  showPassword: boolean;
  showConfirmPassword: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  show,
  onClose,
  onLoginClick,
}) => {
  // state for form fields
  const [form, setForm] = useState<FormState>({
    fullName: "",
    emailOrUsername: "",
    password: "",
    confirmPassword: "",
  });

  // for password visibility
  const [visibility, setVisibility] = useState<VisibilityState>({
    showPassword: false,
    showConfirmPassword: false,
  });

  const [errors, setErrors] = useState<Errors>({});

  const { fetchUsers, addUser } = useUser(); //  hook

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSignup = async () => {
    const newErrors: Errors = {};

    const fields = [
      { name: "fullName", value: form.fullName, label: "Full name" },
      { name: "emailOrUsername", value: form.emailOrUsername, label: "Email or username" },
      { name: "password", value: form.password, label: "Password" },
      { name: "confirmPassword", value: form.confirmPassword, label: "Confirm password" },
    ];

    fields.forEach((field) => {
      const error = validateRequired(field.value, field.label);
      if (error) newErrors[field.name as keyof Errors] = error;
    });

    if (
      !newErrors.emailOrUsername &&
      form.emailOrUsername.includes("@")
    ) {
      const emailError = validateEmail(form.emailOrUsername);
      if (emailError) newErrors.emailOrUsername = emailError;
    }

    if (
      !newErrors.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const users = await fetchUsers();

      const existingUser = users.find(
        (u) =>
          u.emailOrUsername.trim().toLowerCase() ===
          form.emailOrUsername.trim().toLowerCase()
      );

      if (existingUser) {
        setErrors({ emailOrUsername: "User already exists" });
        return;
      }

      await addUser({
        fullName: form.fullName.trim(),
        emailOrUsername: form.emailOrUsername.trim(),
        password: form.password.trim(),
      });

      setErrors({});
      alert("Signup successful!");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold">
          Sign Up
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-center text-muted mb-4">
          Already have an account?{" "}
          <span
            className="text-danger fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={onLoginClick}
          >
            Login
          </span>
        </p>

        <Form>
          <MyInput
            label="Full Name"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={errors.fullName} // pass error 
            required
          />

          <MyInput
            label="Email / Username"
            placeholder="Enter email or username"
            value={form.emailOrUsername}
            onChange={(e) => handleChange("emailOrUsername", e.target.value)}
            error={errors.emailOrUsername} 
            required
          />

          <div className="position-relative">
            <MyInput
              label="Password"
              type={visibility.showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password} 
              required
            />
            <span
              onClick={() =>
                setVisibility((p) => ({ ...p, showPassword: !p.showPassword }))
              }
              style={{ position: "absolute", right: "12px", top: "42px", cursor: "pointer" }}
            >
              <i className={`bi ${visibility.showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>

         <div className="position-relative">
  <MyInput
    label="Confirm Password"
    type={visibility.showConfirmPassword ? "text" : "password"}
    placeholder="Re-enter password"
    value={form.confirmPassword}
    onChange={(e) => handleChange("confirmPassword", e.target.value)}
    error={errors.confirmPassword} // only mismatch error
  />


            
            <span
              onClick={() =>
                setVisibility((p) => ({ ...p, showConfirmPassword: !p.showConfirmPassword }))
              }
              style={{ position: "absolute", right: "12px", top: "42px", cursor: "pointer" }}
            >
              <i className={`bi ${visibility.showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>
          
          <MyButton className="w-100 mt-3" onClick={handleSignup} type="button">
            Sign Up
          </MyButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignupForm;
