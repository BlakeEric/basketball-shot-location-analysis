import type { Point } from "./types";

type HighlightProps = {
  start?: Point;
  end?: Point;
  offset?: { x: number; y: number };
};

export const Highlight = ({ start, end, offset }: HighlightProps) => {
  if (!start || !end) {
    return null;
  }

  const offsetX = offset?.x || 0;
  const offsetY = offset?.y || 0;

  const left = Math.min(start.x, end.x) + offsetX;
  const top = Math.min(start.y, end.y) + offsetY;

  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <figure
      className="highlight"
      style={{
        position: "absolute",

        border: "1px solid black",

        backgroundColor: "lightblue",

        left: `${left}px`,

        top: `${top}px`,

        width: `${width}px`,

        height: `${height}px`,
      }}
    />
  );
};
