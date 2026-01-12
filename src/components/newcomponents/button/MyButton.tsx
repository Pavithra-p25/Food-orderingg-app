import React from "react";
import Button from "@mui/material/Button";

type MyButtonProps = {
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "cancel"
    | "outline-secondary"
    | "outlined"
    | "contained";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  height?: number | string;
  style?: React.CSSProperties;
};

const MyButton: React.FC<MyButtonProps> = ({
  children,
  variant = "primary",
  type = "button",
  height,
  style,
  ...props
}) => {
  return (
    <Button
      type={type}
      variant={
        variant === "outline-secondary" || variant === "outlined"
          ? "outlined"
          : "contained"
      }
      color={
        variant === "secondary" || variant === "outline-secondary"
          ? "secondary"
          : variant === "success"
          ? "success"
          : variant === "cancel"
          ? "error"
          : "primary"
      }
      style={{ height, ...style }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MyButton;
