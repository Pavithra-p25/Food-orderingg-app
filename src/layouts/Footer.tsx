import React, { useContext } from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import { ThemeContext } from "../context/ThemeContext";

const Footer: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 4,
        backgroundColor: darkMode ? "grey.900" : "grey.100",
        color: darkMode ? "common.white" : "common.black",
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight="bold">
              FoodExpress
            </Typography>
            <Typography variant="body2">
              Fastest food delivery at your doorstep.
            </Typography>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">
              Email: support@foodexpress.com
            </Typography>
            <Typography variant="body2">
              Phone: +91 9876543210
            </Typography>
          </Grid>

          {/* Social Icons */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: 1,
            }}
          >
            <IconButton color="inherit">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit">
              <InstagramIcon />
            </IconButton>
            <IconButton color="inherit">
              <YouTubeIcon />
            </IconButton>
            <IconButton color="inherit">
              <TwitterIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Bottom line */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, opacity: 0.8 }}
        >
          © 2025 FoodExpress. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
