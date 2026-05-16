import "./App.css";
import csvData from "./shots.csv";
import { Court } from "./Court";
import { useMemo, useState } from "react";
import { DEFAULT_COURT_XY_FILTER } from "./utils/constants";
import type { CourtRegion } from "./types";
import { between } from "./utils/between";
import { Card, DatePicker, Flex, Select, Space } from "antd";
import { BarChart } from "./BarChart";
import { ShotTypeChart } from "./ShotTypeChart";
import dayjs from "dayjs";
import { pad } from "./utils/pad";

const formatDate = (date: dayjs.Dayjs | null) => {
  if (!date) return "";

  return date.format("YYYY-MM-DD");
};

function App() {
  const { RangePicker } = DatePicker;
  const [shotPositionFilter, setShotPositionFilter] = useState(
    DEFAULT_COURT_XY_FILTER,
  );
  const [dateFilter, setDateFilter] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const [playerFilter, setPlayerFilter] = useState<string[]>([]);

  const updateShotPositionFilter = (newPoint: Partial<CourtRegion>) => {
    setShotPositionFilter((prev) => {
      const newFilters = {
        ...prev,
        ...newPoint,
      };

      return newFilters;
    });
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

  const playerMap: {
    [key: string]: string;
  } = {};

  for (let i = 0; i < csvData.length; i++) {
    const { shooter_id, shooter_name } = csvData[i];
    if (typeof playerMap[shooter_id] === "undefined") {
      playerMap[shooter_id] = shooter_name;
    }
  }

  const filteredRows = useMemo(() => {
    const { x, y } = getShotPositionMinMax(shotPositionFilter);

    const data = csvData.filter((row) => {
      if (!(between(row.x, x.min, x.max) && between(row.y, y.min, y.max))) {
        return false;
      }
      const { year, month, day } = row;
      const dateStr = `${year}-${pad(month, 2)}-${pad(day, 2)}`;

      if (
        dateFilter &&
        (dateStr < dateFilter.start || dateStr > dateFilter.end)
      ) {
        return false;
      }

      if (playerFilter.length && !playerFilter.includes(row.shooter_id)) {
        return false;
      }

      return true;
    });

    return data;
  }, [shotPositionFilter, dateFilter, playerFilter]);

  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-3">Shot Analysis Tool</h1>

      <aside className="px-4 py-2 mb-2 border-1 border-gray-200 shadow-sm r-5 mb-3 bg-white">
        <Flex gap={"1em"} align="center" justify="space-between">
          <span>Filter by:</span>
          <Space>
            <RangePicker
              minDate={dayjs("2024-10-22")}
              maxDate={dayjs("2025-04-13")}
              onChange={(value) => {
                if (!value) {
                  setDateFilter(null);
                  return;
                }

                const [start, end] = value as Array<dayjs.Dayjs>;
                const formattedStart = formatDate(start);
                const formattedEnd = formatDate(end);
                setDateFilter({ start: formattedStart, end: formattedEnd });
              }}
            />
            <Select
              mode="multiple"
              allowClear
              className="w-100"
              placeholder="All players"
              onChange={(shooterIds) => {
                setPlayerFilter(shooterIds);
              }}
              options={Object.entries(playerMap)
                .map(([shooter_id, shooter_name]) => ({
                  label: shooter_name,
                  value: shooter_id,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))}
            />
          </Space>
        </Flex>
      </aside>
      <Flex vertical className="w-full">
        <section className="w-full">
          <Flex gap="2rem" className="w-full">
            <div className="w-1/2">
              <Card title="Court location">
                <span className="text-lg">
                  Highlight a area of the court to filter shot data by location
                </span>
                <Court updateShotPositionFilter={updateShotPositionFilter} />
              </Card>
            </div>
            <div className="w-1/2">
              <Card title="Shots attempted/made by player">
                <BarChart rows={filteredRows} />
              </Card>
            </div>
          </Flex>
        </section>
        <section className="pt-13 overflow-visible ">
          <Card title="Shots attempted/made by shot type">
            <ShotTypeChart rows={filteredRows} />
          </Card>
        </section>
      </Flex>
    </main>
  );
}

export default App;
