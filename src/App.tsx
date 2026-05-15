import "./App.css";
import csvData from "../public/shots.csv";
import { Court } from "./Court";
import { useMemo, useState } from "react";
import { DEFAULT_COURT_XY_FILTER } from "./utils/constants";
import type { CourtRegion } from "./types";
import { between } from "./utils/between";
import { Table } from "./Table";
import { Flex, Space } from "antd";

function App() {
  const [shotPositionFilter, setShotPositionFilter] = useState(
    DEFAULT_COURT_XY_FILTER,
  );

  const updateShotPositionFilter = (newPoint: Partial<CourtRegion>) => {
    setShotPositionFilter((prev) => ({
      ...prev,
      ...newPoint,
    }));
  };

  const getShotPositionMinMax = ({ start, end }: CourtRegion) => {
    const sortAscending = (vals: number[]) => vals.sort((a, b) => a - b);
    const sortedXVals = sortAscending([start.x, end.x]);
    const sortedYVals = sortAscending([start.y, end.y]);
    return {
      x: { min: sortedXVals[0], max: sortedXVals[1] },
      y: {
        min: sortedYVals[0],
        max: sortedYVals[1],
      },
    };
  };

  const filteredRows = useMemo(() => {
    const { x, y } = getShotPositionMinMax(shotPositionFilter);

    return csvData.filter((row) => {
      return between(row.x, x.min, x.max) && between(row.y, y.min, y.max);
    });
  }, [shotPositionFilter]);

  return (
    <main className="p-6">
      <Flex gap="2rem" justify="space-between">
        <section className="w-1/2">
          <div>
            <h1>Basketball Analysis Tool</h1>
            <p>Highlight an area of the court to see associated shot data</p>
          </div>

          <Court updateShotPositionFilter={updateShotPositionFilter} />
        </section>
        <section className="w-1/2">
          <Table rows={filteredRows} />
        </section>
      </Flex>
    </main>
  );
}

export default App;
