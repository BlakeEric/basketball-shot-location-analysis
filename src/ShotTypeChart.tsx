import {
  BarChart as RechartsBarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Label,
} from "recharts";

export const ShotTypeChart = ({ rows }: { rows: any }) => {
  const processedData = rows.reduce((acc, curr) => {
    const key = curr.complex_shot_type;
    if (typeof acc[key] === "undefined") {
      acc[key] = {
        complex_shot_type: camelCaseToWords(curr.complex_shot_type),
        success: 0,
        attempted: 0,
      };
    }

    acc[key].attempted++;

    if (curr.outcome === "TRUE") {
      acc[key].success++;
    }

    return acc;
  }, {});

  function camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  return (
    <RechartsBarChart
      style={{
        width: "100%",
        overflow: "visible",
        height: 400,
      }}
      responsive
      data={Object.values(processedData).sort((a, b) => b.success - a.success)}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <YAxis type="number" />
      <XAxis type="category" dataKey="complex_shot_type" />
      <Tooltip />
      <Label offset={24} position="left" angle={270} className="font-bold">
        Shots
      </Label>
      <Legend />
      <Bar dataKey="attempted" name="Shots attempted" fill="#8884d8" />
      <Bar dataKey="success" name="Shots made" fill="#82ca9d" />
    </RechartsBarChart>
  );
};
