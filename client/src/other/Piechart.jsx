/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const chartConfig = {
  margin: {top:15,botton:25,right:100}
}

export default function Piechart({ pieData, iR, cX, hg }) {
  return (
    <PieChart
    {...chartConfig}
      series={[
        {
          data: pieData,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
          cornerRadius: 10,
          innerRadius: iR,
          cx: cX
        },
      ]}
      width={500}
      height = {hg}
    />
  );
}
