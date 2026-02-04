import React, { useContext } from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import { ThemeContext } from "../context/ThemeContext";
import EmailIcon from "@mui/icons-material/Email";


const Footer: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Box
      component="footer"
      sx={{
        mt: 1,
        py: 1,
        pl: { xs: 1, lg: "79px" }, // sidebar-safe on desktop
        pr: 1,
        backgroundColor: darkMode ? "grey.900" : "grey.100",
        color: darkMode ? "common.white" : "common.black",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Grid container alignItems="center" spacing={{ xs: 1, md: 0 }}>
          {/* Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              flexWrap="wrap" // wraps nicely on mobile
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                <EmailIcon fontSize="small" sx={{ color: "#D44638" }} />{" "}
                {/* Gmail red */}
                <Typography variant="body2">support@foodexpress.com</Typography>
              </Box>

              
            </Box>
          </Grid>

          {/* Copyright */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
              © 2025 FoodExpress. All rights reserved.
            </Typography>
          </Grid>

          {/* Social Icons */}
          {/* Social Icons */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              gap: 1,
            }}
          >
            <IconButton>
              <FacebookIcon sx={{ color: "#1877F2" }} />
            </IconButton>

            <IconButton>
              <InstagramIcon sx={{ color: "#E4405F" }} />
            </IconButton>

            <IconButton>
              <YouTubeIcon sx={{ color: "#FF0000" }} />
            </IconButton>

            <IconButton>
              <TwitterIcon sx={{ color: "#1DA1F2" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
