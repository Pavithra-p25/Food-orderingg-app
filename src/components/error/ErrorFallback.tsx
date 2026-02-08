import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import MyButton from "../newcomponents/button/MyButton";

export function ErrorFallback({ error, resetErrorBoundary }: any) {
  const navigate = useNavigate();

  const message =
    error?.isServerDown
      ? "Server is down. Please try again later."
      : error?.customMessage || "Something went wrong.";

  // Change URL when error occurs
  useEffect(() => {
    navigate("/error", { replace: true });
  }, [navigate]);

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
      <CloudOffIcon color="error" sx={{ fontSize: 80, mb: 2 }} />

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
        onClick={() => {
          resetErrorBoundary();
          navigate("/", { replace: true });
        }}
      >
        Retry
      </MyButton>
    </Box>
  );
}
