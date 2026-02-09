type HandleErrorParams = {
  error: any;
  showBoundary: (error: Error) => void;
  fallbackMessage: string;
  showSnackbar: (msg: string, type: "error" | "success") => void;
};

export const handleError = ({
  error,
  showBoundary,
  fallbackMessage,
  showSnackbar,
}: HandleErrorParams) => {
  // SERVER DOWN → full page error
  if (error?.isServerDown) {
    showBoundary(error);
    return;
  }

  // API / DOMAIN ERROR → snackbar
  showSnackbar(
    error?.customMessage || fallbackMessage,
    "error"
  );
};
