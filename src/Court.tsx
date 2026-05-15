import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

export const Court = () => {
  const [highlightOrigin, setHighlightOrigin] = useState<Point | undefined>();
  const [highlightEnd, setHighlightEnd] = useState<Point | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const courtRef = useRef<HTMLDivElement | null>(null);

  const getRect = () => courtRef.current!.getBoundingClientRect();

  const getRelativeXY = (clientX: number, clientY: number) => {
    const rect = getRect();
    const pointerOffsetX = clientX - rect.left;
    const pointerOffsetY = clientY - rect.top;
    const normalizedX = (pointerOffsetX / rect.width) * 2 - 1;
    const normalizedY = (pointerOffsetY / rect.height) * 2 - 1;
    const courtX = normalizedX * 47;
    const courtY = normalizedY * 25 * -1;
    return { courtX, courtY, pointerOffsetX, pointerOffsetY, rect };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const { pointerOffsetX, pointerOffsetY } = getRelativeXY(
      e.clientX,
      e.clientY,
    );
    setHighlightOrigin({ x: pointerOffsetX, y: pointerOffsetY });
    setHighlightEnd(undefined);
    setIsDragging(true);
    // capture pointer so we keep receiving events even when leaving the element
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent | React.PointerEvent) => {
    if (!isDragging || !courtRef.current) return;
    const clientX = "clientX" in e ? e.clientX : (e as PointerEvent).clientX;
    const clientY = "clientY" in e ? e.clientY : (e as PointerEvent).clientY;
    const { pointerOffsetX, pointerOffsetY } = getRelativeXY(clientX, clientY);
    setHighlightEnd({ x: pointerOffsetX, y: pointerOffsetY });
  };

  const onPointerUp = (e: React.PointerEvent | PointerEvent) => {
    if (!isDragging || !courtRef.current) return;
    const clientX = "clientX" in e ? e.clientX : (e as PointerEvent).clientX;
    const clientY = "clientY" in e ? e.clientY : (e as PointerEvent).clientY;
    const { pointerOffsetX, pointerOffsetY } = getRelativeXY(clientX, clientY);
    setHighlightEnd({ x: pointerOffsetX, y: pointerOffsetY });
    setIsDragging(false);
    // release capture if available
    try {
      (e.target as Element).releasePointerCapture?.((e as any).pointerId);
    } catch {}
  };

  // fallback: attach global pointermove/pointerup while dragging (handles pointer leaving element)
  useEffect(() => {
    if (!isDragging) return;
    const pm = (e: PointerEvent) => onPointerMove(e);
    const pu = (e: PointerEvent) => onPointerUp(e);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu, { once: false });
    return () => {
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
    };
  }, [isDragging]);

  const shouldRenderHighlight = highlightOrigin && highlightEnd;
  const highlightStyles = shouldRenderHighlight
    ? (() => {
        const rect = courtRef.current!.getBoundingClientRect();
        const left = Math.min(highlightOrigin!.x, highlightEnd!.x) + rect.left;
        const top = Math.min(highlightOrigin!.y, highlightEnd!.y) + rect.top;
        const width = Math.abs(highlightEnd!.x - highlightOrigin!.x);
        const height = Math.abs(highlightEnd!.y - highlightOrigin!.y);
        return {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        };
      })()
    : {};

  return (
    <>
      <div
        ref={courtRef}
        style={{
          height: 200,
          width: 400,
          backgroundColor: "gray",
          position: "relative",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => onPointerMove(e)}
        onPointerUp={(e) => onPointerUp(e)}
      />
      {shouldRenderHighlight && (
        <figure
          className="highlight"
          style={{
            position: "absolute",
            border: "1px solid black",
            backgroundColor: "lightblue",
            pointerEvents: "none",
            ...highlightStyles,
          }}
        />
      )}
    </>
  );
};
