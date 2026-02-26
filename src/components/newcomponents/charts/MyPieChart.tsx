import React from "react";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";

export interface MyPieChartProps {
  data: { label: string; value: number }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  arcLabel?: "label" | "value" | "formattedValue" | ((item: any) => string);
  hideLegend?: boolean;
}

const MyPieChart: React.FC<MyPieChartProps> = ({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
  arcLabel = "label",
  hideLegend = false,
}) => {
  return (
    <MuiPieChart
      height={height}
      series={[
        {
          data,
          innerRadius,
          outerRadius,
          arcLabel,
        },
      ]}
      slotProps={{
        legend: {
          hidden: hideLegend,
        } as any,
      }}
      sx={{
        "& text": {
          fill: "white",
          fontSize: 12,
          fontWeight: 600,
        },
      }}
    />
  );
};

export default MyPieChart;