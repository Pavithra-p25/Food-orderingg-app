import { Box, Typography } from "@mui/material";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import MyButton from "../newcomponents/button/MyButton";

export function ErrorFallback({ error, resetErrorBoundary }: any) {
  const message =
    error?.isServerDown
      ? "Server is down. Please try again later."
      : error?.customMessage || "Something went wrong.";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      p={3}
    >
      {/* ICON */}
      <CloudOffIcon
        color="error"
        sx={{ fontSize: 80, mb: 2 }}
      />

      <Typography variant="h4" color="error" gutterBottom>
        Server Down
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 420 }}
      >
        {message}
      </Typography>

      <MyButton
        variant="contained"
        onClick={resetErrorBoundary}
      >
        Retry
      </MyButton>
    </Box>
  );
}
