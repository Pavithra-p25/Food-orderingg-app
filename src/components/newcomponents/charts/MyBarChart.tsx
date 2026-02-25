import React from "react";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";

export interface MyBarChartProps {
  dataset: any[];
  layout?: "vertical" | "horizontal";
  height?: number;
  xAxis?: any[];
  yAxis?: any[]; // <-- add this
  series: any[];
  sx?: object;
}

const MyBarChart: React.FC<MyBarChartProps> = ({
  dataset,
  series,
  xAxis,
  height = 300,
  layout = "vertical",
  sx,
}) => {
  return (
    <MuiBarChart
      dataset={dataset}
      series={series}
      xAxis={xAxis}
      layout={layout}
      height={height}
      sx={sx}
    />
  );
};

export default MyBarChart;