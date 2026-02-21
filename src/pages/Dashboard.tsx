import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie,
  PieChart,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import MyCard from "../components/newcomponents/card/MyCard";
import { useDashboard } from "../hooks/useDashboard";
import { useDialogSnackbar } from "../context/DialogSnackbarContext";
import {
  chartData,
  topRestaurants,
  areaChartData,
} from "../config/constants/DashboardConstant";

const Dashboard: React.FC = () => {
  const { showSnackbar } = useDialogSnackbar();

  const {
    totalUsers,
    totalRestaurants,
    activeRestaurants,
    inactiveRestaurants,
    loading,
  } = useDashboard({ showSnackbar });

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        px: { xs: 2, lg: 4 }, // horizontal padding for small screens
        pl: { lg: "90px" },
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <DashboardCustomizeIcon sx={{ fontSize: 35 }} />
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MyCard
            title="Total Users"
            description={`${totalUsers} users registered`}
            sx={{ textAlign: "center" }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MyCard
            title="Total Restaurants"
            description={`${totalRestaurants} restaurants in system`}
            sx={{ textAlign: "center" }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MyCard
            title="Active Restaurants"
            description={`${activeRestaurants} currently active`}
            sx={{ textAlign: "center" }}
          />
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Line Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MyCard sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Users & Restaurants Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Users" stroke="#8884d8" />
                <Line type="monotone" dataKey="Restaurants" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </MyCard>
        </Grid>

        {/* Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MyCard sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Active vs Inactive Restaurants
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Active", value: activeRestaurants },
                    { name: "Inactive", value: inactiveRestaurants },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  <Cell key="active" fill="#82ca9d" />
                  <Cell key="inactive" fill="#ff6b6b" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </MyCard>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MyCard sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Top 5 Restaurants by Orders
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRestaurants}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </MyCard>
        </Grid>
    
     
        <Grid size={{xs:12,md:6}}>
          <MyCard sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Orders & Revenue Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Orders"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </MyCard>
        </Grid>
        </Grid>
    </Container>
  );
};

export default Dashboard;
