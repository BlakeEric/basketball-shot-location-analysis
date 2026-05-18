import "../assets/app.css";
import csvData from "../assets/shots.csv";
import { Court } from "./Court";
import { useState } from "react";
import {
  DEFAULT_COURT_XY_FILTER,
  SEASON_END_DATE,
  SEASON_START_DATE,
} from "../utils/constants";
import type { CourtRegion } from "../types";
import { Card, Col, DatePicker, Flex, Row, Select, Space } from "antd";
import { PlayerChart } from "./PlayerChart";
import { ShotTypeChart } from "./ShotTypeChart";
import dayjs from "dayjs";
import { usePlayers } from "../hooks/usePlayers";
import { useProcessedData } from "../hooks/useProcessedData";
import { DataCard } from "./DataCard";

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
      <h1 className="text-3xl font-bold my-6">
        Shot Analysis By Court Location
      </h1>

      <aside className="px-4 py-2 mb-2 border-1 border-gray-200 shadow-xs rounded-lg mb-6 bg-white">
        <Flex gap={"1em"} align="center" justify="space-between">
          <span className="text-lg font-bold">Filter by:</span>
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

      <Row gutter={16}>
        <Col span={24} lg={{ span: 12 }} className="mb-6">
          <Card title="Court location" className="h-full">
            <span className="text-lg">
              Highlight a area of the court to filter shot data by location
            </span>
            <Court
              shotPositionFilter={shotPositionFilter}
              updateShotPositionFilter={updateShotPositionFilter}
            />
          </Card>
        </Col>
        <Col span={24} lg={{ span: 12 }} className="mb-6">
          <DataCard
            title="Shots attempted/made by player"
            data={filteredData?.shotsByPlayer}
            renderData={(data) => <PlayerChart data={data} />}
            handleReset={handleResetAll}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <DataCard
            title="Shots attempted/made by shot type"
            data={filteredData?.shotsByType}
            renderData={(data) => <ShotTypeChart data={data} />}
            handleReset={handleResetAll}
          />
        </Col>
      </Row>
    </main>
  );
}

export default App;
