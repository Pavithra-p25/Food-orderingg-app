import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  IconButton,
  Box,
  Alert,
  Skeleton,
  Grid,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import MyCard from "../../components/newcomponents/card/MyCard";
import db from "../../../server/db.json";
import type { FavoriteItem } from "../../types/userTypes";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/Store";
import { addFavorite, removeFavorite } from "../../store/slices/FavoritesSlice";
import { saveFavorites } from "../../store/slices/FavoritesThunks";

// Types
type MenuItem = {
  itemName: string;
  price: number;
  file?: string | null; // can be null or undefined in JSON
};

type Restaurant = {
  id: string;
  restaurantName: string;
  logo?: string | null; // can be null or undefined
  category: string;
  menuItems?: MenuItem[];
};

const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  //favorites from redux store, 
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [error, setError] = useState<string | null>(null);

  // Merge restaurant + menuItems
  useEffect(() => {
    if (!id) return;

    const foundRestaurant = db.restaurants.find((r: any) => r.id === id) as
      | Restaurant
      | undefined;

    const foundMenu = (db.restaurantinfo.find((r: any) => r.id === id)
      ?.menuItems || []) as MenuItem[];

    if (!foundRestaurant) {
      setError("Restaurant not found");
      return;
    }

    const safeRestaurant: Restaurant = {
      ...foundRestaurant,
      logo: foundRestaurant.logo || "/placeholder.jpg",
      menuItems: foundMenu.map((item) => ({
        ...item,
        file: item.file || "/placeholder.jpg",
      })),
    };

    setRestaurant(safeRestaurant);
  }, [id]);

  // Handlers
  const handleFavorite = (
  item: MenuItem,
  itemId: string,
  isFavorite: boolean
) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    alert("Please login to add favorites");
    return;
  }

  const favItem: FavoriteItem = {
    id: itemId,
    name: item.itemName,
    price: item.price,
    image: item.file || "/placeholder.jpg",
  };

  let updatedFavorites: FavoriteItem[];

  if (isFavorite) {
    dispatch(removeFavorite(itemId)); //already in - remoe
    updatedFavorites = favorites.filter((f) => f.id !== itemId);
  } else {
    dispatch(addFavorite(favItem)); // not yet - add
    updatedFavorites = [...favorites, favItem];
  }

  // to DB
  dispatch(
    saveFavorites({
      userId: user.id,
      favorites: updatedFavorites,
    })
  );
};


  const addToCart = (itemName: string) => {
    console.log(`Added ${itemName} to cart`);
  };

  const orderNow = (itemName: string) => {
    console.log(`Ordering ${itemName} now`);
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!restaurant)
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={300} />
        <Box mt={2}>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
          <Skeleton width="80%" />
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="lg" disableGutters sx={{ mt: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 300,
          borderRadius: 2,
          overflow: "hidden",
          backgroundImage: `url(${restaurant.logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textAlign: "center",
            px: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            {restaurant.restaurantName}
          </Typography>
          <Typography variant="subtitle1">{restaurant.category}</Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <Typography variant="h5" gutterBottom>
        Menu
      </Typography>
      <Grid container spacing={3}>
        {restaurant.menuItems && restaurant.menuItems.length > 0
          ? restaurant.menuItems.map((item, index) => {
              const itemId = `${restaurant.id}-${index}`;

              const isFavorite = favorites.some((fav) => fav.id === itemId);

              return (
                <Grid key={itemId} size={{ xs: 12, sm: 6, md: 4 }}>
                  <MyCard image={item.file || "/placeholder.jpg"}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight="bold">{item.itemName}</Typography>
                      <Typography fontWeight="bold" color="success.main">
                        ₹{item.price}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Tooltip
                        title={
                          isFavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"
                        }
                      >
                        <IconButton
                          color={isFavorite ? "error" : "default"}
                          onClick={() =>
                            handleFavorite(item, itemId, isFavorite)
                          }
                        >
                          {isFavorite ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Add to Cart">
                        <IconButton
                          color="primary"
                          onClick={() => addToCart(item.itemName)}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Order Now">
                        <IconButton
                          color="success"
                          onClick={() => orderNow(item.itemName)}
                        >
                          <LocalMallIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </MyCard>
                </Grid>
              );
            })
          : Array.from({ length: 3 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={180} />
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default RestaurantMenu;
