import {
  BarChart as RechartsBarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";

type ShotTypeDataRow = {
  complex_shot_type: string;
  success: number;
  attempted: number;
};

export const ShotTypeChart = ({ data }: { data: ShotTypeDataRow[] }) => {
  return (
    <RechartsBarChart
      style={{
        width: "100%",
        overflow: "visible",
        height: 400,
      }}
      responsive
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <YAxis type="number" />
      <XAxis type="category" dataKey="complex_shot_type" />
      <Tooltip />
      <Legend />
      <Bar
        barSize={30}
        dataKey="attempted"
        name="Shots attempted"
        fill="#8884d8"
      />
      <Bar barSize={30} dataKey="success" name="Shots made" fill="#82ca9d" />
    </RechartsBarChart>
  );
};
