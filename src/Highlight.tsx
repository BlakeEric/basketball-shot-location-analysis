import { Button } from "antd";
import type { Point } from "./types";

type HighlightProps = {
  start?: Point;
  end?: Point;
  offset?: { x: number; y: number };
  showResetIcon: boolean;
  handleReset: () => void;
};

export const Highlight = ({
  start,
  end,
  offset,
  showResetIcon = false,
  handleReset,
}: HighlightProps) => {
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
    !!width &&
    !!height && (
      <div
        style={{
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <figure
          data-testid="highlight"
          className="h-full w-full absolute bg-blue-200 opacity-50"
        />
        {showResetIcon && (
          <Button
            title="Clear selection"
            shape="circle"
            variant="solid"
            style={{ position: "absolute", top: "-1rem", right: "-1rem" }}
            onClick={handleReset}
          >
            ✕
          </Button>
        )}
      </div>
    )
  );
};
