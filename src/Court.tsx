import { useEffect, useRef, useState } from "react";
import { clamp } from "./utils/clamp";
import {
  COURT_X_MAX,
  COURT_X_MIN,
  COURT_Y_MAX,
  COURT_Y_MIN,
  DEFAULT_COURT_XY_FILTER,
} from "./utils/constants";
import type { Point, CourtRegion } from "./types";
import { Highlight } from "./Highlight";

export const Court = ({
  updateShotPositionFilter,
}: {
  updateShotPositionFilter: (filters: Partial<CourtRegion>) => void;
}) => {
  const [highlightOrigin, setHighlightOrigin] = useState<Point | undefined>(
    undefined,
  );
  const [highlightEnd, setHighlightEnd] = useState<Point | undefined>(
    undefined,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const courtRef = useRef<HTMLDivElement>(null);
  const getCourtDimensions = () => courtRef.current?.getBoundingClientRect();

  // Given clientX/clientY and container rect (read inside), return offsets or null if no rect
  const getRelativeXY = (clientX: number, clientY: number, rect: DOMRect) => {
    if (!rect) return null;

    const pointerOffsetX = clientX - rect.left;
    const pointerOffsetY = clientY - rect.top;

    const normalizedX = (pointerOffsetX / rect.width) * 2 - 1;
    const normalizedY = (pointerOffsetY / rect.height) * 2 - 1;

    const courtX = normalizedX * COURT_X_MAX;
    const courtY = normalizedY * COURT_Y_MAX;

    return { courtX, courtY, pointerOffsetX, pointerOffsetY };
  };

  // Get X/Y position relative to container without extending outside of its boundaries
  const calculateHighlightXY = (
    e: React.MouseEvent | PointerEvent,
  ): { containerPos: Point; courtPos: Point } | undefined => {
    const courtDemensions = getCourtDimensions();
    const originPos = getRelativeXY(e.clientX, e.clientY, courtDemensions!);

    if (!originPos || !courtDemensions) {
      return undefined;
    }

    return {
      containerPos: {
        x: clamp(originPos.pointerOffsetX, 0, courtDemensions.width),
        y: clamp(originPos.pointerOffsetY, 0, courtDemensions.height),
      },
      courtPos: {
        x: clamp(Math.round(originPos.courtX), COURT_X_MIN, COURT_X_MAX),
        y: clamp(Math.round(originPos.courtY), COURT_Y_MIN, COURT_Y_MAX),
      },
    };
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    e.preventDefault();

    setIsDragging(true);

    const point = calculateHighlightXY(e);

    if (!point) return;

    setHighlightOrigin(point.containerPos);
    updateShotPositionFilter({ start: point.courtPos, end: point.courtPos });
    // clear previous end while starting a new drag
    setHighlightEnd(undefined);
  };

  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();

    if (!isDragging) return;

    setHighlightEnd(calculateHighlightXY(e)?.containerPos);
  };

  const handlePointerUp = (e: PointerEvent) => {
    e.preventDefault();

    const point = calculateHighlightXY(e);

    if (!isDragging || !highlightOrigin || !point) return;

    setHighlightEnd(point.containerPos);
    updateShotPositionFilter({ end: point.courtPos });
    setIsDragging(false);
  };

  const reset = () => {
    updateShotPositionFilter(DEFAULT_COURT_XY_FILTER);
    setHighlightOrigin(undefined);
    setHighlightEnd(undefined);
  };

  // Add dom events for mouseup/mousemove since they need to be caught outside the court container
  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: false });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  return (
    <>
      <div
        className="court-container"
        style={{ width: "100%", paddingTop: "56%", position: "relative" }}
      >
        <div
          data-testid="court"
          ref={courtRef}
          className="top-0 left-0 bottom-0 right-0 absolute"
          onPointerDown={handlePointerDown}
        >
          <img width="100%" src="/basketball_court.jpeg" />
          <span className="text-xl font-bold absolute top-1 left-2 cursor-default">
            &larr; Offense
          </span>
          <span className="text-xl font-bold absolute bottom-1 left-2 cursor-default">
            &larr; Offense
          </span>
        </div>

        <Highlight
          start={highlightOrigin}
          end={highlightEnd}
          offset={{ x: 0, y: 0 }}
          showResetIcon={!!highlightOrigin && !!highlightEnd && !isDragging}
          handleReset={reset}
        />
      </div>
    </>
  );
};
