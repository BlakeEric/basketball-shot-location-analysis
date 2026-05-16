import "./App.css";
import csvData from "./shots.csv";
import { Court } from "./Court";
import { useState } from "react";
import {
  DEFAULT_COURT_XY_FILTER,
  SEASON_END_DATE,
  SEASON_START_DATE,
} from "./utils/constants";
import type { CourtRegion } from "./types";
import { Card, DatePicker, Flex, Select, Space } from "antd";
import { BarChart } from "./BarChart";
import { ShotTypeChart } from "./ShotTypeChart";
import dayjs from "dayjs";
import { usePlayers } from "./hooks/usePlayers";
import { useProcessedData } from "./hooks/useProcessedData";
import { NoData } from "./NoData";

const formatDate = (date: dayjs.Dayjs | null) => {
  if (!date) return "";

  return date.format("YYYY-MM-DD");
};

function App() {
  const { RangePicker } = DatePicker;
  const [playerFilter, setPlayerFilter] = useState<string[]>([]);
  const [shotPositionFilter, setShotPositionFilter] = useState(
    DEFAULT_COURT_XY_FILTER,
  );
  const [dateFilter, setDateFilter] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const updateShotPositionFilter = (newPoint: Partial<CourtRegion>) => {
    setShotPositionFilter((prev) => ({
      ...prev,
      ...newPoint,
    }));
  };

  const players = usePlayers(csvData);

  const filteredData = useProcessedData(csvData, {
    shotPositionFilter,
    playerFilter,
    dateFilter,
  });

  const handleResetAll = () => {
    updateShotPositionFilter(DEFAULT_COURT_XY_FILTER);
    setPlayerFilter([]);
    setDateFilter(null);
  };

  const handleDateRangeUpdate = (value: Array<dayjs.Dayjs> | null) => {
    if (!value) {
      setDateFilter(null);
      return;
    }

    const [start, end] = value as Array<dayjs.Dayjs>;
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);
    setDateFilter({ start: formattedStart, end: formattedEnd });
  };
  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-3">
        Shot Analysis By Court Location
      </h1>

      <aside className="px-4 py-2 mb-2 border-1 border-gray-200 shadow-sm r-5 mb-3 bg-white">
        <Flex gap={"1em"} align="center" justify="space-between">
          <span>Filter by:</span>
          <Space>
            <RangePicker
              minDate={dayjs(SEASON_START_DATE)}
              maxDate={dayjs(SEASON_END_DATE)}
              onChange={(value) => {
                handleDateRangeUpdate(value as Array<dayjs.Dayjs> | null);
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
              options={players}
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
                <Court
                  shotPositionFilter={shotPositionFilter}
                  updateShotPositionFilter={updateShotPositionFilter}
                />
              </Card>
            </div>
            <div className="w-1/2">
              <Card title="Shots attempted/made by player">
                <Flex
                  align="center"
                  justify="center"
                  vertical
                  style={{ minHeight: "500px" }}
                  gap="2em"
                >
                  {!!filteredData?.shotsByPlayer.length ? (
                    <BarChart data={filteredData?.shotsByPlayer} />
                  ) : (
                    <NoData onReset={handleResetAll} />
                  )}
                </Flex>
              </Card>
            </div>
          </Flex>
        </section>
        <section className="pt-13 overflow-visible ">
          <Card title="Shots attempted/made by shot type">
            <Flex
              vertical
              gap="2em"
              align="center"
              justify="center"
              style={{ minHeight: "500px" }}
            >
              {!!filteredData?.shotsByType.length ? (
                <ShotTypeChart data={filteredData.shotsByType} />
              ) : (
                <NoData onReset={handleResetAll} />
              )}
            </Flex>
          </Card>
        </section>
      </Flex>
    </main>
  );
}

export default App;
