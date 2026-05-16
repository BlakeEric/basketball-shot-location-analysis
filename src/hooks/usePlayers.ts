import { useMemo } from "react";
import type { DataRow } from "../types";

export const usePlayers = (csvData: DataRow[]) => {
  const players = useMemo(() => {
    const playerMap: {
      [key: string]: string;
    } = {};

    for (let i = 0; i < csvData.length; i++) {
      const { shooter_id, shooter_name } = csvData[i];
      if (typeof playerMap[shooter_id] === "undefined") {
        playerMap[shooter_id] = shooter_name;
      }
    }
    return Object.entries(playerMap)
      .map(([shooter_id, shooter_name]) => ({
        label: shooter_name,
        value: shooter_id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [csvData]);

  return players;
};
