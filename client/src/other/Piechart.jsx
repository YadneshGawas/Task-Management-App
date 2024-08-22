/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const chartConfig = {
  margin: {top:15,botton:25,right:100}
}

export default function Piechart({ total, comp }) {
  return (
    <PieChart
    {...chartConfig}
      series={[
        {
          data: [
            { id: 0, value: comp, label: "Completed", color: "#90fedf" },
            { id: 1, value: total, label: "Not completed", color: "#bebebe" },
          ],
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
          cornerRadius: 10,
          innerRadius: 20,
        },
      ]}
      width={500}
      height={250}
    />
  );
}
