import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
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
      <ShoppingCartOutlinedIcon sx={{ fontSize: 60, color: "grey", mb: 2 }} />

      <Typography variant="h5" fontWeight="bold" mb={1}>
        Your cart is empty
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Add items from restaurants to start ordering 🍔🍕
      </Typography>

      <Button variant="contained" onClick={() => navigate("/restaurants")}>
        Browse Restaurants
      </Button>
    </Box>
  );
};

export default CartPage;
