import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import MySnackbar from "../components/newcomponents/snackbar/MySnackbar";
import MyDialog from "../components/newcomponents/dialog/MyDialog";
import { Button } from "@mui/material";

/*  TYPES  */

type SnackbarSeverity = "success" | "error" | "warning" | "info";

type DialogConfig = {
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
};

type DialogSnackbarContextType = {
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  showDialog: (config: DialogConfig) => void;
  hideDialog: () => void;
};

/* CONTEXT  */

const DialogSnackbarContext = createContext<
  DialogSnackbarContextType | undefined
>(undefined);

/* PROVIDER  */

export const DialogSnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* SNACKBAR STATE  */
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as SnackbarSeverity,
  });

  /* DIALOG STATE */
  const [dialog, setDialog] = useState<DialogConfig & { open: boolean }>({
    open: false,
  });

  /*  SNACKBAR  */
  const showSnackbar = useCallback(
    (message: string, severity: SnackbarSeverity = "success") => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  /*  DIALOG  */
  const showDialog = useCallback((config: DialogConfig) => {
    setDialog({ ...config, open: true });
  }, []);

  const hideDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const handleConfirm = () => {
    dialog.onConfirm?.();
    hideDialog();
  };

  return (
    <DialogSnackbarContext.Provider
      value={{ showSnackbar, showDialog, hideDialog }}
    >
      {children}

      {/* SNACKBAR */}
      <MySnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />

      {/* DIALOG */}
      <MyDialog
        open={dialog.open}
        onClose={hideDialog}
        title={dialog.title}
        maxWidth={dialog.maxWidth || "xs"}
        fullWidth={dialog.fullWidth ?? true}
      >
        {dialog.content}

        {dialog.onConfirm && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={hideDialog}>
              {dialog.cancelText || "Cancel"}
            </Button>
            <Button variant="contained" onClick={handleConfirm}>
              {dialog.confirmText || "Confirm"}
            </Button>
          </div>
        )}
      </MyDialog>
    </DialogSnackbarContext.Provider>
  );
};

/*  HOOK */

export const useDialogSnackbar = () => {
  const context = useContext(DialogSnackbarContext);
  if (!context) {
    throw new Error(
      "useDialogSnackbar must be used inside DialogSnackbarProvider",
    );
  }
  return context;
};
