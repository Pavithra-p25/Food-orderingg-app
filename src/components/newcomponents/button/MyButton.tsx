import React from "react";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

type MyButtonProps = {
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "cancel"
    | "outline-secondary"
    | "outlined-cancel"
    | "text"
    | "outlined"
    | "contained";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  height?: number | string;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
};

const MyButton: React.FC<MyButtonProps> = ({
  children,
  variant = "primary",
  type = "button",
  height,
  sx,
  style,
  ...props
}) => {
  // Determine color
  let buttonColor: "primary" | "secondary" | "success" | "error" = "primary";

  if (variant === "secondary" || variant === "outline-secondary") {
    buttonColor = "secondary";
  } else if (variant === "success") {
    buttonColor = "success";
  } else if (variant === "cancel" || variant === "outlined-cancel") {
    buttonColor = "error"; // <-- RED
  }

  // Determine variant
  const buttonVariant =
    variant === "outlined" ||
    variant === "outline-secondary" ||
    variant === "outlined-cancel"
      ? "outlined"
      : "contained";

  return (
    <Button
      type={type}
      variant={buttonVariant}
      color={buttonColor} // <-- THIS WAS MISSING
      style={{ height, ...style }}
      sx={sx}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MyButton;
