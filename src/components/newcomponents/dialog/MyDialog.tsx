import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MyDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const MyDialog: React.FC<MyDialogProps> = ({
  open,
  onClose,
  title,
  maxWidth = "md",
  fullWidth = true,
  children,
  actions,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      {title && (
        <DialogTitle sx={{ textAlign: "center", position: "relative" }}>
          {title}

          {/* CLOSE ICON */}
          <Box
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}

      <DialogContent>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default MyDialog;
