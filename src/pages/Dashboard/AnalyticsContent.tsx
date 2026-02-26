 import { Box, Card, Grid, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import MyPieChart from "../../components/newcomponents/charts/MyPieChart";
import KpiSection from "./KpiSection";
import MyBarChart from "../../components/newcomponents/charts/MyBarChart";


interface AnalyticsContentProps {
  totalUsers: number;
  totalRestaurants: number;
  activeRestaurants: number;
  inactiveRestaurants: number;

  cityDataset: any[];
  categoryDatasetFormatted: {
    category: string;
    value: number;
    color: string;
  }[];

  restaurantCounts: number[];
  months: string[];

  cityCategoryDataset: any[];
  categories: string[];
}

 export const AnalyticsContent = ({
  totalUsers,
  totalRestaurants,
  activeRestaurants,
  inactiveRestaurants,
  cityDataset,
  categoryDatasetFormatted,
  restaurantCounts,
  months,
  cityCategoryDataset,
  categories,
}: AnalyticsContentProps) => {
  return (
    <>
      <KpiSection
        totalUsers={totalUsers}
        totalRestaurants={totalRestaurants}
        activeRestaurants={activeRestaurants}
        inactiveRestaurants={inactiveRestaurants}
      />
      <Grid container spacing={3} mt={2}>
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
              xAxis={[{ scaleType: "band", dataKey: "city" }]}
              yAxis={[{ scaleType: "linear", min: 0 }]}
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
              yAxis={[
                {
                  scaleType: "band",
                  dataKey: "category",
                  paddingInner: 0.4,
                  paddingOuter: 0.2,
                },
              ]}
              xAxis={[{ scaleType: "linear", min: 0 }]}
              series={[{ dataKey: "value", label: "Restaurants" }]}
              sx={{
                "& .MuiBarElement-root": {
                  borderRadius: 6,
                },
              }}
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
              height={280}
              series={[
                {
                  data: restaurantCounts,
                  label: "Restaurants",
                  area: true,
                },
              ]}
              xAxis={[{ scaleType: "point", data: months }]}
              yAxis={[{ min: 0 }]}
            />
          </Card>
        </Grid>

        {/* Category Distribution (Donut Chart) with Scrollable Legend */}
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
              Category Distribution (Donut Chart)
            </Typography>

            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={2}
              width="100%"
              maxHeight={350}
            >
              <Box flex="1" display="flex" justifyContent="center">
                <MyPieChart
                  data={categoryDatasetFormatted.map((cat) => ({
                    label: cat.category,
                    value: cat.value,
                    color: cat.color,
                  }))}
                  height={300}
                  innerRadius={60}
                  outerRadius={100}
                  arcLabel="value"
                  hideLegend={true}
                />
              </Box>

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
                        backgroundColor: cat.color,
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

        {/* City vs Category Comparison */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              minHeight: 450,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" mb={2}>
              City vs Category Comparison
            </Typography>

            <MyBarChart
              dataset={cityCategoryDataset}
              layout="vertical"
              height={380}
              xAxis={[{ scaleType: "band", dataKey: "city" }]}
              yAxis={[{ scaleType: "linear", min: 0 }]}
              series={categories.map((category) => ({
                dataKey: category,
                label: category,
              }))}
              barSize={40}
              sx={{ "& .MuiBarElement-root": { borderRadius: 6 } }}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
