export type Point = { x: number; y: number };

export type CourtRegion = { start: Point; end: Point };

export type MinMax = { min: number; max: number };

export type CourtXY = {
  x: MinMax;
  y: MinMax;
};

export type CourtLocationFilter = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
};

export type DateFilter = {
  start: string;
  end: string;
} | null;

export type PlayerFilter = string[];

export type DataRow = {
  complex_shot_type: string;
  shooter_id: string;
  shooter_name: string;
  outcome: "TRUE" | "FALSE";
  x: number;
  y: number;
  year: number;
  month: number;
  day: number;
};

export type ShotTypeDataRow = {
  complex_shot_type: string;
  success: number;
  attempted: number;
};

export type ShotsByPlayerDataRow = {
  shooter_name: string;
  success: number;
  attempted: number;
};

export type CounterRow = { success: number; attempted: number };
