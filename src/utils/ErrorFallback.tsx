import { Snackbar, Alert } from "@mui/material";

export function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <Snackbar open autoHideDuration={4000} onClose={resetErrorBoundary}>
      <Alert severity="error" onClose={resetErrorBoundary}>
        {error.message}
      </Alert>
    </Snackbar>
  );
}
