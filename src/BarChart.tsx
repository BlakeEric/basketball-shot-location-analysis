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

export const BarChart = ({ rows }: { rows: any }) => {
  const processedData = rows.reduce((acc, curr) => {
    const id = curr.shooter_id; // or use curr.shooter_name consistently
    if (typeof acc[id] === "undefined") {
      acc[id] = {
        shooter_name: curr.shooter_name,
        success: 0,
        failure: 0,
      };
    }

    const keyToUpdate = curr.outcome === "TRUE" ? "success" : "failure";
    acc[id][keyToUpdate]++;

    return acc;
  }, {});
  console.log(Object.values(processedData));

  return (
    <RechartsBarChart
      style={{
        width: "100%",
        //   maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={Object.values(processedData)}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="shooter_name" />
      <YAxis width="auto" />
      <Label offset={30} position="left" angle={270}>
        Number of shots
      </Label>
      <Tooltip />
      <Legend />
      <Bar dataKey="failure" fill="#8884d8" stackId="a" />
      <Bar dataKey="success" fill="#82ca9d" stackId="a" />
    </RechartsBarChart>
  );
};
