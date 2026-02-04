import React from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Container,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { useFav } from "../context/FavContext";
import MyCard from "../components/newcomponents/card/MyCard"; 
import MyButton from "../components/newcomponents/button/MyButton";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useFav();

  // EMPTY STATE
  if (favorites.length === 0) {
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
          Start exploring restaurant menus & add your favorites ❤️
        </Typography>

        <MyButton variant="contained" onClick={() => navigate("/restaurants")}>
          Explore Restaurants
        </MyButton>
      </Box>
    );
  }

  // FAVORITES LIST
  return (
    <Container maxWidth="lg" sx={{ py: 4, px: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Your Favorites ❤️
      </Typography>

      <Grid container spacing={3}>
        {favorites.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
            <MyCard image={item.image || "/placeholder.jpg"} imageHeight={180}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.name}
                </Typography>

                {item.price && (
                  <Typography variant="subtitle1" color="success.main">
                    ₹{item.price}
                  </Typography>
                )}

                <Tooltip title="Remove from favorites">
                  <IconButton
                    color="error"
                    onClick={() => removeFromFavorites(item.id)}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </MyCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FavoritesPage;
