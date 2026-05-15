import "./App.css";
import csvData from "../public/shots.csv";
import { Court } from "./Court";
import { useMemo, useState } from "react";
import { DEFAULT_COURT_XY_FILTER } from "./utils/constants";
import type { CourtRegion } from "./types";
import { between } from "./utils/between";

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

  const filteredStuff = useMemo(() => {
    const { x, y } = getShotPositionMinMax(shotPositionFilter);

    return csvData.filter((row) => {
      return between(row.x, x.min, x.max) && between(row.y, y.min, y.max);
    });
  }, [shotPositionFilter]);

  console.log(filteredStuff);
  return (
    <>
      <section id="center">
        <div className="hero"></div>
        <div>
          <h1>Basketball Analysis Tool</h1>
          <p>lorem ipsum</p>
        </div>

        <Court updateShotPositionFilter={updateShotPositionFilter} />
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
