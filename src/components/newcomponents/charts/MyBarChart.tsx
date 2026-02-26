import React from "react";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";

export interface MyBarChartProps {
  dataset: any[];
  layout?: "vertical" | "horizontal";
  height?: number;
  xAxis?: any[];
  yAxis?: any[];
  series: any[];
  sx?: object;
  barSize?: number; // optional override
}

const MyBarChart: React.FC<MyBarChartProps> = ({
  dataset,
  series,
  xAxis,
  yAxis,
  height = 300,
  layout = "vertical",
  sx,
  barSize, // optional custom size
}) => {
  return (
    <MuiBarChart
      dataset={dataset}
      series={series}
      xAxis={xAxis}
      yAxis={yAxis}
      layout={layout}
      height={height}
      sx={{
        ...sx,
        "& .MuiBarElement-root": {
          borderRadius: 6,
          ...(barSize && {
            [layout === "vertical" ? "width" : "height"]: barSize,
          }),
        },
      }}
    />
  );
};

export default MyBarChart;