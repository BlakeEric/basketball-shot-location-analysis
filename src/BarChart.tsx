import {
  BarChart as RechartsBarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";
import type { ShotsByPlayerDataRow } from "./types";

export const BarChart = ({ data }: { data: ShotsByPlayerDataRow[] }) => {
  // const processedData = rows.reduce(
  //   (acc: Record<string, ShotsByPlayerDataRow>, curr: DataRow) => {
  //     const id = curr.shooter_id;
  //     if (typeof acc[id] === "undefined") {
  //       acc[id] = {
  //         shooter_name: curr.shooter_name,
  //         success: 0,
  //         attempted: 0,
  //       };
  //     }

  //     acc[id].attempted++;

  //     if (curr.outcome === "TRUE") {
  //       acc[id].success++;
  //     }

  //     return acc;
  //   },
  //   {},
  // );

  return (
    <RechartsBarChart
      style={{
        width: "100%",
        maxHeight: "450px",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="shooter_name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar
        barSize={20}
        dataKey="attempted"
        name="Shots attempted"
        fill="#8884d8"
      />
      <Bar barSize={20} dataKey="success" name="Shots made" fill="#82ca9d" />
    </RechartsBarChart>
  );
};
