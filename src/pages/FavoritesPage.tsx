import React from "react";
import { Box, Typography, Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <FavoriteBorderIcon sx={{ fontSize: 60, color: "grey", mb: 2 }} />

      <Typography variant="h5" fontWeight="bold" mb={1}>
        No favorites yet
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Start exploring restaurants and add your favorites ❤️
      </Typography>

      <Button variant="contained" onClick={() => navigate("/restaurants")}>
        Explore Restaurants
      </Button>
    </Box>
  );
};

export default FavoritesPage;
