import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import MyButton from "../components/newcomponents/button/MyButton";
import MyCard from "../components/newcomponents/card/MyCard";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";
import LoginForm from "./authentication/LoginForm";

const HomePage: React.FC = () => {
  //  hooks
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const user = localStorage.getItem("user");
  // State to show/hide login form
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Listen for the custom event from handleAuthNavigate
  useEffect(() => {
    const openLoginListener = () => setShowLoginForm(true);
    window.addEventListener("open-login", openLoginListener);

    return () => window.removeEventListener("open-login", openLoginListener);
  }, []);

  const handleAuthNavigate = (message: string) => {
    if (!user) {
      showSnackbar(message, "warning"); // show warning
      window.dispatchEvent(new Event("open-login")); // open login form
      return;
    }

    navigate("/restaurants"); // if logged in, go to restaurants
  };

  const features = [
    {
      title: "Fast Delivery",
      description: "Get your favorite food delivered in under 30 minutes.",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Wide Variety",
      description: "Choose from hundreds of restaurants and cuisines.",
      image:
        "https://images.squarespace-cdn.com/content/v1/59f0e6beace8641044d76e9c/1675269073941-R0ZICO2NU09XYFJ6CNYY/social+varied+diet.jpg",
    },
    {
      title: "Easy Payments",
      description: "Multiple payment options for your convenience.",
      image:
        "https://cdn.sanity.io/images/9sed75bn/production/98616bcdc97a3d67a75f5816518b76ddaa3dedb0-1792x1008.png?auto=format",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          px: 2,
          mt: -2,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{
            textShadow: `
        2px 2px 8px rgba(0,0,0,0.7),
        0 0 10px rgba(255, 77, 77, 0.7),
        0 0 20px rgba(255, 77, 77, 0.5)
      `,
          }}
        >
          Delicious Food, Delivered Fast
        </Typography>
        <Typography
          variant="h6"
          mb={4}
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          Explore your favorite restaurants and enjoy food at your doorstep.
        </Typography>

        <Box display="flex" gap={2}>
          <MyButton
            onClick={() => navigate("/restaurants")}
            variant="cancel"
            size="large"
          >
            Explore Restaurants
          </MyButton>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, px: 2,  backgroundColor: (theme) => theme.palette.background.default,}}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={6}>
          Why Choose FoodExpress?
        </Typography>
        <Box sx={{ maxWidth: "1300px", mx: "auto", py: 4 }}>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <MyCard
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  sx={{
                    mx: "auto",
                    textAlign: "center",
                  }}
                  imageHeight={200}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* C Section */}
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          backgroundColor: "#ff6666",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Ready to Taste the Best Food in Town?
        </Typography>
        <Box>
          <MyButton
            onClick={() => handleAuthNavigate("Please login to start ordering")}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              color: "#333",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            Start Ordering
          </MyButton>
        </Box>
      </Box>
      {/* Login Form */}
      {showLoginForm && (
        <LoginForm
          show={showLoginForm}
          onClose={() => setShowLoginForm(false)}
          onLoginSuccess={() => {
            setShowLoginForm(false); // close login form
            navigate("/restaurants"); // navigate after successful login
          }}
        />
      )}
    </Box>
  );
};

export default HomePage;
