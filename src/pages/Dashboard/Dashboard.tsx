import React, { useEffect, useState } from "react";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import useUser from "../../hooks/useUser";
import type { Restaurant } from "../../types/RestaurantTypes";
import { useForm } from "react-hook-form";
import MyTabs from "../../components/newcomponents/tabs/MyTab";
import OverviewContent from "./OverviewContent";
import { AnalyticsContent } from "./AnalyticsContent";

const Dashboard: React.FC = () => {
  const { getAllRestaurants } = useRestaurants();
  const { fetchUsers } = useUser();

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const formMethods = useForm({
    defaultValues: {
      year: "All",
    },
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
  }, []);

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
 const isAll = selectedYear === "All";

const series = Object.entries(growthByYear)
  .filter(([year]) =>
    isAll ? true : year.toString() === selectedYear
  )
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
    color: string;
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

  // City vs Category dataset for grouped bar chart
  const cityCategoryDataset = cities.map((city) => {
    const data: Record<string, any> = { city };
    categories.forEach((category) => {
      data[category] = heatmapMatrix[city][category] || 0;
    });
    return data;
  });

  const cityDataset = cityNames.map((city, index) => ({
    city,
    value: Number(cityValues[index]) || 0, // ensure numeric
  }));

  const categoryDatasetFormatted: CategoryWithColor[] = categoryDataset.map(
    (c) => ({
      category: c.category,
      value: c.count,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    }),
  );

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

      <MyTabs
        tabs={[
          {
            key: "overview",
            tabName: "Overview",
            tabContent: (
              <OverviewContent
                totalUsers={totalUsers}
                totalRestaurants={totalRestaurants}
                activeRestaurants={activeRestaurants}
                inactiveRestaurants={inactiveRestaurants}
                vegCount={vegCount}
                nonVegCount={nonVegCount}
                formMethods={formMethods}
                availableYears={availableYears}
                series={series}
                allMonths={allMonths}
              />
            ),
          },
          {
            key: "analytics",
            tabName: "Analytics",
            tabContent: (
              <AnalyticsContent
                totalUsers={totalUsers}
                totalRestaurants={totalRestaurants}
                activeRestaurants={activeRestaurants}
                inactiveRestaurants={inactiveRestaurants}
                cityDataset={cityDataset}
                categoryDatasetFormatted={categoryDatasetFormatted}
                restaurantCounts={restaurantCounts}
                months={months}
                cityCategoryDataset={cityCategoryDataset}
                categories={categories}
              />
            ),
          },
        ]}
      />
    </Container>
  );
};
export default Dashboard;
