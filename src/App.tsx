import "./App.css";
import csvData from "../public/shots.csv";
import { Court } from "./Court";
import { useMemo, useState } from "react";
import { DEFAULT_COURT_XY_FILTER } from "./utils/constants";
import type { CourtRegion } from "./types";
import { between } from "./utils/between";
import { Flex } from "antd";
import { BarChart } from "./BarChart";
import { ShotTypeChart } from "./ShotTypeChart";

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
      <h1 className="text-3xl font-bold mb-3">Basketball Analysis Tool</h1>
      <hr />
      <Flex gap="2rem" vertical className="w-full">
        <section className="w-full">
          <Flex gap="2rem" className="w-full">
            <div className="w-1/2">
              <div>
                <p className="">
                  Highlight an area of the court to see associated shot data
                </p>
              </div>

              <Court updateShotPositionFilter={updateShotPositionFilter} />
            </div>
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-1">
                Shots attempted/made by player
              </h2>
              <BarChart rows={filteredRows} />
            </div>
          </Flex>
        </section>
        <section className="pt-13 overflow-visible ">
          {/* <LineChart rows={filteredRows} /> */}
          <h2 className="text-xl font-bold mb-8">
            Shots attempted/made by shot type
          </h2>
          <ShotTypeChart rows={filteredRows} />
        </section>
      </Flex>
    </main>
  );
}

export default App;
