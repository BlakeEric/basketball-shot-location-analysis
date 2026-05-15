export type Point = { x: number; y: number };

export type CourtRegion = { start: Point; end: Point };

export type MinMax = { min: number; max: number };

export type CourtXYFilter = {
  x: MinMax;
  y: MinMax;
};
