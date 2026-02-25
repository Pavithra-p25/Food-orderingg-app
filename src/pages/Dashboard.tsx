import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { LineChart } from "@mui/x-charts/LineChart";
import useRestaurants from "../hooks/restaurant/useRestaurant";
import useUser from "../hooks/useUser";
import type { Restaurant } from "../types/RestaurantTypes";
import { Gauge } from "@mui/x-charts/Gauge";
import { useForm, FormProvider } from "react-hook-form";
import MyDropdown from "../components/newcomponents/textfields/MyDropdown";
import MyPieChart from "../components/newcomponents/charts/MyPieChart";
import MyBarChart from "../components/newcomponents/charts/MyBarChart";

const Dashboard: React.FC = () => {
  const { getAllRestaurants } = useRestaurants();
  const { fetchUsers } = useUser();

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const formMethods = useForm<{ year: string }>({
    defaultValues: { year: "" },
  });
  const { watch } = formMethods;
  const selectedYear = watch("year");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantList = await getAllRestaurants();
        setRestaurants(restaurantList);

        const users = await fetchUsers();
        setTotalUsers(users.length);
      } catch (error) {
        console.error("Dashboard load error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAllRestaurants, fetchUsers]);

  //  Prepare years AFTER restaurants are loaded
  const availableYears = Array.from(
    new Set(restaurants.map((r) => new Date(r.createdAt).getFullYear())),
  ).sort((a, b) => b - a);

  //  Prepare growth series
  const growthByYear: Record<number, Record<string, number>> = {};
  restaurants.forEach((r) => {
    const date = new Date(r.createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "short" });

    if (!growthByYear[year]) growthByYear[year] = {};
    growthByYear[year][month] = (growthByYear[year][month] || 0) + 1;
  });

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const series = Object.entries(growthByYear)
    .filter(([year]) => !selectedYear || year.toString() === selectedYear)
    .map(([year, monthData]) => ({
      label: year,
      data: allMonths.map((m) => monthData[m] || 0),
    }));

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

   interface CategoryWithColor {
  category: string;
  value: number;
  color?: string; // optional color
}

  //Derived Values
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter((r) => r.isActive).length;
  const inactiveRestaurants = totalRestaurants - activeRestaurants;

  // Monthly Restaurant Growth
  const monthlyMap: Record<string, number> = {};

  restaurants.forEach((r) => {
    const month = new Date(r.createdAt).toLocaleString("default", {
      month: "short",
    });

    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const months = Object.keys(monthlyMap);
  const restaurantCounts = Object.values(monthlyMap);

  // Veg vs Non-Veg Count
  const vegCount = restaurants.filter((r) =>
    r.restaurantType?.includes("Veg"),
  ).length;

  const nonVegCount = restaurants.filter((r) =>
    r.restaurantType?.includes("Non-Veg"),
  ).length;

  const cityCount = restaurants.reduce<Record<string, number>>((acc, r) => {
    const city = r.city || "Unknown";
    acc[city] = (acc[city] ?? 0) + 1;
    return acc;
  }, {});

  const cityNames: string[] = Object.keys(cityCount);
  const cityValues: number[] = Object.values(cityCount);

  //category count
  const categoryCount = restaurants.reduce<Record<string, number>>((acc, r) => {
    const category = r.category || "Other";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  const categoryDataset = Object.keys(categoryCount)
    .map((key) => ({
      category: key,
      count: categoryCount[key],
    }))
    .sort((a, b) => b.count - a.count); // sort highest first

  //city vs  category
  const heatmapMatrix: Record<string, Record<string, number>> = {};

  restaurants.forEach((r) => {
    const city = r.city || "Unknown";
    const category = r.category || "Other";

    if (!heatmapMatrix[city]) {
      heatmapMatrix[city] = {};
    }

    heatmapMatrix[city][category] = (heatmapMatrix[city][category] ?? 0) + 1;
  });

  const cities = Object.keys(heatmapMatrix);

  const categories = Array.from(
    new Set(restaurants.map((r) => r.category || "Other")),
  );

  // Convert to heatmap dataset
  const heatmapData = [];

  cities.forEach((city, rowIndex) => {
    categories.forEach((category, colIndex) => {
      heatmapData.push({
        x: colIndex,
        y: rowIndex,
        value: heatmapMatrix[city][category] ?? 0,
      });
    });
  });

  const cityDataset = cityNames.map((city, index) => ({
    city,
    value: Number(cityValues[index]) || 0, // ensure numeric
  }));

 const categoryDatasetFormatted: CategoryWithColor[] = categoryDataset.map((c) => ({
  category: c.category,
  value: c.count,
  color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
}));

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        pb: 5,
        ml: { md: "70px" },
        width: { md: "calc(100% - 100px)" },
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <DashboardIcon sx={{ fontSize: 32, color: "black" }} />
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
      </Box>

      {/* KPI Cards */}
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

      {/* Charts */}
      <Grid container spacing={3} mt={2}>
        {/* Restaurant Growth */}
        {/* Restaurant Growth */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              minHeight: 380,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Restaurant Growth</Typography>

              <FormProvider {...formMethods}>
                <Box sx={{ width: 120 }}>
                  {" "}
                  {/* small width for dropdown */}
                  <MyDropdown
                    name="year"
                    label="Year"
                    options={availableYears.map(String)}
                    fullWidth
                    size="small" // small dropdown
                  />
                </Box>
              </FormProvider>
            </Box>

            <LineChart
              height={300}
              series={series}
              xAxis={[{ scaleType: "point", data: allMonths }]}
              yAxis={[{ min: 0 }]}
            />
          </Card>
        </Grid>

        {/* Active vs Inactive */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              minHeight: 410,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" mb={2}>
              Active vs Inactive
            </Typography>

            <MyPieChart
              data={[
                { label: "Active", value: activeRestaurants },
                { label: "Inactive", value: inactiveRestaurants },
              ]}
              height={300}
              arcLabel="value"
            />
          </Card>
        </Grid>

        {/* veg and non veg , gaurd chart*/}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" mb={2}>
              Veg vs Non-Veg
            </Typography>

            <Box
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              flexGrow={1}
            >
              <Gauge
                width={200}
                height={200}
                value={
                  totalRestaurants > 0 ? (vegCount / totalRestaurants) * 100 : 0
                }
                text={({ value }) => `${value ? value.toFixed(0) : 0}% Veg`}
              />

              <Gauge
                width={200}
                height={200}
                value={
                  totalRestaurants > 0
                    ? (nonVegCount / totalRestaurants) * 100
                    : 0
                }
                text={({ value }) => `${value ? value.toFixed(0) : 0}% Non-Veg`}
              />
            </Box>
          </Card>
        </Grid>

        {/* City Wise Restaurants */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" mb={2}>
              City Wise Restaurants
            </Typography>
            <MyBarChart
              dataset={cityDataset}
              layout="vertical"
              height={320}
              xAxis={[{ scaleType: "band", dataKey: "city" }]} // categorical
              yAxis={[{ scaleType: "linear", min: 0 }]} // numeric axis
              series={[{ dataKey: "value", label: "Restaurants" }]}
              sx={{ "& .MuiBarElement-root": { borderRadius: 6 } }}
            />
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" mb={2}>
              Category Distribution
            </Typography>

            <MyBarChart
              dataset={categoryDatasetFormatted}
              layout="horizontal"
              height={320}
              yAxis={[{ scaleType: "band", dataKey: "category" }]} // categorical
              xAxis={[{ scaleType: "linear", min: 0 }]} // numeric axis
              series={[{ dataKey: "value", label: "Restaurants" }]}
              sx={{ "& .MuiBarElement-root": { borderRadius: 6 } }}
            />
          </Card>
        </Grid>

        {/* Monthly Restaurant Growth - Area Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              minHeight: 430,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" mb={2}>
              Monthly Restaurant Growth (Area Chart)
            </Typography>

            <LineChart
              height={300}
              series={[
                { data: restaurantCounts, label: "Restaurants", area: true },
              ]} // <-- area: true
              xAxis={[{ scaleType: "point", data: months }]}
              yAxis={[{ min: 0 }]}
            />
          </Card>
        </Grid>

        {/* Category Distribution (Donut Chart) */}
      {/* Category Distribution (Donut Chart) */}
<Grid size={{ xs: 12, md: 6 }}>
  <Card
    sx={{
      p: 2,
      borderRadius: 4,
      minHeight: 400,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h6" mb={2}>
      Category Distribution (Donut Chart)
    </Typography>


    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2}
      width="100%"
      maxHeight={350} // limit total height
    >
      {/* Chart */}
      <Box flex="1">
        <MyPieChart
          data={categoryDatasetFormatted.map((cat) => ({
            label: cat.category,
            value: cat.value,
            color: cat.color, // use random color
          }))}
          height={300}
          innerRadius={60}
          outerRadius={100}
          arcLabel="value"
        />
      </Box>

      {/* Scrollable Legend */}
      <Box
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          width: 150,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {categoryDatasetFormatted.map((cat, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: cat.color, // now valid
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2">{cat.category}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Card>
</Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
