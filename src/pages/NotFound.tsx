// src/pages/NotFound.tsx
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(to right, #f8fafc, #eef2ff)",
      }}
    >
      <Box
        textAlign="center"
        p={5}
        borderRadius={4}
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h1"
          fontWeight="bold"
          color="primary"
        >
          404
        </Typography>

        <Typography variant="h5" mt={1}>
          Oops! Page not found
        </Typography>

        <Typography color="text.secondary" mt={1} mb={3}>
          The page you are looking for doesn’t exist or was moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
