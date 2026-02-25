import React from "react";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";

export interface MyPieChartProps {
  data: { label: string; value: number }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  arcLabel?: "label" | "value" | "formattedValue" | ((item: any) => string);
}

const MyPieChart: React.FC<MyPieChartProps> = ({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
  arcLabel = "label",
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