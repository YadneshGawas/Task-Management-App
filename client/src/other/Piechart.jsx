/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Piechart({ total, comp }) {
  console.log("Total =>", total);
  console.log("Completed =>", comp);
  return (
    <PieChart
      margin={10}
      series={[
        {
          data: [
            { id: 0, value: comp, label: "Completed", color: "#90fedf" },
            { id: 1, value: total, label: "Not completed", color: "#bebebe" },
          ],
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          cornerRadius: 10,
          innerRadius: 25,
        },
      ]}
      width={500}
      height={250}
    />
  );
}
