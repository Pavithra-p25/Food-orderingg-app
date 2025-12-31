import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

type MySnackbarProps = {
  open: boolean;
  message: string;
  onClose: () => void;

  severity?: "success" | "error" | "warning" | "info";
  autoHideDuration?: number;

  // optional actions 
  actionText?: string;
  onAction?: () => void;

  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
};

const MySnackbar: React.FC<MySnackbarProps> = ({
  open,
  message,
  onClose,
  severity = "success",
  autoHideDuration = 3000,
  actionText,
  onAction,
  position = { vertical: "top", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        action={
          actionText && onAction ? (
            <Button
              color="inherit"
              size="small"
              onClick={onAction}
            >
              {actionText}
            </Button>
          ) : undefined
        }
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;
