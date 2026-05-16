import { useMemo } from "react";
import type {
  CounterRow,
  CourtLocationFilter,
  CourtRegion,
  DataRow,
  DateFilter,
  PlayerFilter,
  ShotsByPlayerDataRow,
  ShotTypeDataRow,
} from "../types";
import { between } from "../utils/between";
import { pad } from "../utils/pad";
import { camelCaseToTitleCase } from "../utils/camelCaseToTitleCase";

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

function updateCount<T extends CounterRow>(
  map: Record<string, T>,
  key: string,
  initializer: () => T,
  successCondition: boolean,
) {
  if (typeof map[key] === "undefined") {
    map[key] = initializer();
  }
  map[key].attempted++;
  if (successCondition) map[key].success++;
}

export const useProcessedData = (
  csvData: DataRow[],
  filters: {
    shotPositionFilter: CourtLocationFilter;
    dateFilter: DateFilter;
    playerFilter: PlayerFilter;
  },
) => {
  const { shotPositionFilter, dateFilter, playerFilter } = filters;

  const filteredData = useMemo(() => {
    const { x, y } = getShotPositionMinMax(shotPositionFilter);
    const shotsByPlayerMap: Record<string, ShotsByPlayerDataRow> = {};
    const shotsByTypeMap: Record<string, ShotTypeDataRow> = {};

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const { year, month, day } = row;
      const dateStr = `${year}-${pad(month, 2)}-${pad(day, 2)}`;

      // return early if row does not match filters
      if (!(between(row.x, x.min, x.max) && between(row.y, y.min, y.max))) {
        continue;
      }

      if (
        dateFilter &&
        (dateStr < dateFilter.start || dateStr > dateFilter.end)
      ) {
        continue;
      }

      if (playerFilter.length && !playerFilter.includes(row.shooter_id)) {
        continue;
      }

      const isSuccess = row.outcome === "TRUE";

      updateCount(
        shotsByPlayerMap,
        row.shooter_id,
        () => ({ shooter_name: row.shooter_name, success: 0, attempted: 0 }),
        isSuccess,
      );

      updateCount(
        shotsByTypeMap,
        row.complex_shot_type,
        () => ({
          complex_shot_type: camelCaseToTitleCase(row.complex_shot_type),
          success: 0,
          attempted: 0,
        }),
        isSuccess,
      );
    }

    return {
      shotsByPlayer: Object.values(shotsByPlayerMap).sort((a, b) =>
        a.shooter_name.localeCompare(b.shooter_name),
      ),
      shotsByType: Object.values(shotsByTypeMap).sort(
        (a, b) => b.success - a.success,
      ),
    };
  }, [shotPositionFilter, dateFilter, playerFilter]);

  return filteredData;
};
