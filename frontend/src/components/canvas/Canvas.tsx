import { Stage, Layer, Line, Circle } from "react-konva";
import { useState, useRef, useLayoutEffect, useMemo, type JSX } from "react";
import { v4 as uuid } from "uuid";
import type { Tool } from "./Types";

type DrawStroke = {
  id: string;
  pts: number[];
  kind: "draw" | "erase";
  color: string;
  strokeWidth: number;
};

interface CanvasProps {
  tool: Tool;
  color: string;
}

const GRID_SIZE = 40;
const DOT_RADIUS = 1;

const Canvas = ({ tool, color }: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [drawings, setDrawings] = useState<DrawStroke[]>([]);
  const [rectStart, setRectStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [rectEnd, setRectEnd] = useState<{ x: number; y: number } | null>(null);

  const [active, setActive] = useState(false);

  const penWidth = 2;
  const eraserRadius = 200;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setSize({
        width: el.clientWidth,
        height: el.clientHeight
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const onPointerDown = (e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    setActive(true);

    if (tool === "pen" || tool === "erase") {
      setDrawings(d => [
        ...d,
        {
          id: uuid(),
          pts: [point.x, point.y],
          kind: tool === "erase" ? "erase" : "draw",
          color,
          strokeWidth: penWidth
        }
      ]);
      return;
    }

    if (tool === "rectangle") {
      setRectStart({ x: point.x, y: point.y });
      setRectEnd({ x: point.x, y: point.y });
    }
  };

  const onPointerMove = (e: any) => {
    if (!active) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    if (tool === "pen" || tool === "erase") {
      setDrawings(d => {
        const last = d[d.length - 1];
        if (!last) return d;

        return [
          ...d.slice(0, -1),
          { ...last, pts: last.pts.concat([point.x, point.y]) }
        ];
      });
      return;
    }

    if (tool === "rectangle" && rectStart) {
      setRectEnd({ x: point.x, y: point.y });
    }
  };

  const onPointerUp = () => {
    if (tool === "rectangle" && rectStart && rectEnd) {
      const { x: x1, y: y1 } = rectStart;
      const { x: x2, y: y2 } = rectEnd;

      const pts = [
        x1, y1,
        x2, y1,
        x2, y2,
        x1, y2,
        x1, y1
      ];

      setDrawings(d => [
        ...d,
        {
          id: uuid(),
          pts,
          kind: "draw",
          color,
          strokeWidth: penWidth
        }
      ]);
    }

    setRectStart(null);
    setRectEnd(null);
    setActive(false);
  };

  const gridDots = useMemo(() => {
    const dots: JSX.Element[] = [];
    if (!size.width || !size.height) return dots;

    const cols = Math.ceil(size.width / GRID_SIZE);
    const rows = Math.ceil(size.height / GRID_SIZE);

    const offsetX = (size.width % GRID_SIZE) / 2;
    const offsetY = (size.height % GRID_SIZE) / 2;

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        dots.push(
          <Circle
            key={`${i}-${j}`}
            x={i * GRID_SIZE + offsetX}
            y={j * GRID_SIZE + offsetY}
            radius={DOT_RADIUS}
            fill="#e5e7eb"
            listening={false}
          />
        );
      }
    }
    return dots;
  }, [size.width, size.height]);

  const previewRect =
    rectStart && rectEnd
      ? [
          rectStart.x,
          rectStart.y,
          rectEnd.x,
          rectStart.y,
          rectEnd.x,
          rectEnd.y,
          rectStart.x,
          rectEnd.y,
          rectStart.x,
          rectStart.y
        ]
      : null;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {size.width > 0 && size.height > 0 && (
        <Stage
          width={size.width}
          height={size.height}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
        >
          <Layer listening={false}>{gridDots}</Layer>

          <Layer listening={tool !== "select"}>
            {drawings.map(d => (
              <Line
                key={d.id}
                points={d.pts}
                stroke={d.kind === "erase" ? "#000" : d.color}
                strokeWidth={
                  d.kind === "erase" ? eraserRadius : d.strokeWidth
                }
                lineCap="round"
                lineJoin="round"
                perfectDrawEnabled={false}
                globalCompositeOperation={
                  d.kind === "erase"
                    ? "destination-out"
                    : "source-over"
                }
              />
            ))}

            {previewRect && (
              <Line
                points={previewRect}
                stroke={color}
                strokeWidth={penWidth}
                dash={[6, 4]}
                listening={false}
              />
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default Canvas;