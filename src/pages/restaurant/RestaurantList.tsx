import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Paper,
} from "@mui/material";
import MyButton from "../../components/newcomponents/button/MyButton";
import { useNavigate } from "react-router-dom";
import type { Restaurant } from "../../types/RestaurantTypes";
import RestaurantForm from "../registerrestaurant/RestaurantForm";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import CommonInput from "../../components/newcomponents/textfields/CommonInput";
import CommonSelect from "../../components/newcomponents/textfields/CommonSelect";
import { RESTAURANT_CATEGORIES } from "../../config/constants/RestaurantConstant";

/* STATE TYPE  */
interface ListingState {
  showForm: boolean;
}

const CATEGORY_OPTIONS = ["", ...RESTAURANT_CATEGORIES];

const RestaurantList: React.FC = () => {
  const navigate = useNavigate();

  //  state object
  const [state, setState] = useState<ListingState>({
    showForm: false,
  });

  const { showForm } = state;

  //  LOCAL STATE
  const [search, setSearch] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState<number>(9);

  const [filters, setFilters] = useState({
    category: "",
  });

  const { getAllRestaurants } = useRestaurants();

  //  FETCH RESTAURANTS
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [getAllRestaurants]);

  // FILTER LOGIC
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.restaurantName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = filters.category
      ? r.category === filters.category
      : true;

    return matchesSearch && matchesCategory;
  });

  const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);

  const handleFilterChange =
    (field: keyof typeof filters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  useEffect(() => {
    setVisibleCount(9);
  }, [search, filters.category]);

  return (
    <Box
      sx={{
        p: 3,
        mt: 8,
        ml: { lg: "72px" }, // offset for collapsed sidebar
      }}
    >
      {loading && <Typography>Loading restaurants...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {/* FILTERS */}

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2, backgroundColor: "whitesmoke" }}>
            <Typography fontWeight="bold" mb={2}>
              Filters
            </Typography>

            <CommonSelect
              label="Category"
              value={filters.category}
              onChange={handleFilterChange("category")}
              options={CATEGORY_OPTIONS}
            />
          </Paper>
        </Grid>

        {/* SEARCH + CARDS */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Search */}
          <CommonInput
            label="Search"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Cards */}
          <Grid container spacing={3}>
            {visibleRestaurants.map((restaurant) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={restaurant.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      restaurant.logo ||
                      "https://via.placeholder.com/300x140?text=Restaurant"
                    }
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {restaurant.restaurantName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.category}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      ⏱ {restaurant.averageDeliveryTime}
                    </Typography>

                    <MyButton
                      fullWidth
                      variant="cancel"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    >
                      View Menu
                    </MyButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* NOT FOUND MESSAGE */}
          {!loading && !error && filteredRestaurants.length === 0 && (
            <Typography
              align="center"
              color="text.secondary"
              mt={4}
              fontWeight="bold"
            >
              🍽️ Restaurant not found
            </Typography>
          )}

          {/* Load More */}
          {filteredRestaurants.length > 9 && (
            <Box textAlign="center" mt={4}>
              <MyButton
                variant="cancel"
                onClick={() =>
                  setVisibleCount(
                    visibleCount === 9 ? filteredRestaurants.length : 9,
                  )
                }
              >
                {visibleCount === 9 ? "Load More" : "Show Less"}
              </MyButton>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Join Us */}
      <Box mt={6}>
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #ffffff 0%, #ff4d4d 100%)",
            color: "#333333",
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" mb={2}>
            Own a Restaurant? Join Us Today!
          </Typography>
          <Typography mb={3}>
            Reach thousands of hungry customers. Sign up now and start receiving
            orders online.
          </Typography>
          <MyButton
            variant="cancel"
            onClick={() => setState((prev) => ({ ...prev, showForm: true }))}
          >
            Register Now
          </MyButton>
        </Card>
      </Box>

      <RestaurantForm
        show={showForm}
        onClose={() => setState((prev) => ({ ...prev, showForm: false }))}
      />
    </Box>
  );
};

export default RestaurantList;
