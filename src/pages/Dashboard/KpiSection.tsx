import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface KpiSectionProps {
  totalUsers: number;
  totalRestaurants: number;
  activeRestaurants: number;
  inactiveRestaurants: number;
}

const KpiSection: React.FC<KpiSectionProps> = ({
  totalUsers,
  totalRestaurants,
  activeRestaurants,
  inactiveRestaurants,
}) => {
  return (
    <Grid container spacing={3}>
      {[
        {
          title: "Total Users",
          value: totalUsers,
          icon: <PeopleAltIcon fontSize="large" />,
          color: "linear-gradient(to right, #6366f1, #130b27)",
        },
        {
          title: "Total Restaurants",
          value: totalRestaurants,
          icon: <RestaurantIcon fontSize="large" />,
          color: "linear-gradient(to right, #10b981, #059669)",
        },
        {
          title: "Active Restaurants",
          value: activeRestaurants,
          icon: <CheckCircleIcon fontSize="large" />,
          color: "linear-gradient(to right, #3b82f6, #2563eb)",
        },
        {
          title: "Inactive Restaurants",
          value: inactiveRestaurants,
          icon: <CancelIcon fontSize="large" />,
          color: "linear-gradient(to right, #ef4444, #dc2626)",
        },
      ].map((card, index) => (
        <Grid size={{ xs: 12, md: 3 }} key={index}>
          <Card
            sx={{
              background: card.color,
              color: "white",
              borderRadius: 4,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              transition: "0.3s",
              "&:hover": { transform: "translateY(-5px)" },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2">{card.title}</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
                {card.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiSection;