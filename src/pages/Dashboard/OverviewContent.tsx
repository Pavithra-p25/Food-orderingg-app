import { Box, Card, Grid, Typography } from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import { LineChart } from "@mui/x-charts/LineChart";
import { FormProvider } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import MyPieChart from "../../components/newcomponents/charts/MyPieChart";
import KpiSection from "./KpiSection";

interface OverviewContentProps {
  totalUsers: number;
  totalRestaurants: number;
  activeRestaurants: number;
  inactiveRestaurants: number;
  vegCount: number;
  nonVegCount: number;
  formMethods: UseFormReturn<any>;
  availableYears: number[];
  series: any;
  allMonths: string[];
}

const OverviewContent: React.FC<OverviewContentProps> = ({
  totalUsers,
  totalRestaurants,
  activeRestaurants,
  inactiveRestaurants,
  vegCount,
  nonVegCount,
  formMethods,
  availableYears,
  series,
  allMonths,
}) => {
  return (
    <>
      <KpiSection
        totalUsers={totalUsers}
        totalRestaurants={totalRestaurants}
        activeRestaurants={activeRestaurants}
        inactiveRestaurants={inactiveRestaurants}
      />

      <Grid container spacing={3} mt={2}>
        {/* Restaurant Growth */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Restaurant Growth</Typography>

              <FormProvider {...formMethods}>
                <Box sx={{ width: 120 }}>
                  <MyDropdown
                    name="year"
                    label="Year"
                    options={["All", ...availableYears.map(String)]}
                    fullWidth
                    size="small"
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
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>
              Active vs Inactive
            </Typography>

            <MyPieChart
              data={[
                { label: "Active", value: activeRestaurants },
                { label: "Inactive", value: inactiveRestaurants },
              ]}
              height={335}
              arcLabel="value"
            />
          </Card>
        </Grid>

        {/* Veg vs Non-Veg */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>
              Veg vs Non-Veg
            </Typography>

            <Box display="flex" justifyContent="space-around">
              <Gauge
                width={200}
                height={320}
                value={
                  totalRestaurants > 0
                    ? (vegCount / totalRestaurants) * 100
                    : 0
                }
                text={({ value }) =>
                  `${value ? value.toFixed(0) : 0}% Veg`
                }
              />

              <Gauge
                width={200}
                height={320}
                value={
                  totalRestaurants > 0
                    ? (nonVegCount / totalRestaurants) * 100
                    : 0
                }
                text={({ value }) =>
                  `${value ? value.toFixed(0) : 0}% Non-Veg`
                }
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default OverviewContent;