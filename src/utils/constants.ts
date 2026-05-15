export const COURT_X_MAX = 47;
export const COURT_X_MIN = COURT_X_MAX * -1;
export const COURT_Y_MAX = 25;
export const COURT_Y_MIN = COURT_Y_MAX * -1;

export const DEFAULT_COURT_XY_FILTER = {
  start: { x: COURT_X_MIN, y: COURT_Y_MIN },
  end: { x: COURT_X_MAX, y: COURT_Y_MAX },
};
