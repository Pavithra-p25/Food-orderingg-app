import React from "react";
import Button from "@mui/material/Button";

type MyButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "cancel" | "outline-secondary"|"outlined" |"contained";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const MyButton: React.FC<MyButtonProps> = ({
  children,
  variant = "primary",
  type = "button",
  ...props
}) => {
  return (
    <Button
      type={type}
      variant={variant === "outline-secondary" ? "outlined" : "contained"}
      color={
        variant === "secondary" || variant === "outline-secondary"
          ? "secondary"
          : variant === "success"
          ? "success"
          : variant === "cancel"
          ? "error"
          : "primary"
      }
      {...props}
    >
      {children}
    </Button>
  );
};
export default MyButton;