import {
  Stage,
  Layer,
  Line,
  Circle,
  Group,
  Text,
} from 'react-konva';
import {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  useEffect,
} from 'react';
import { v4 as uuid } from 'uuid';

import { useAuth } from '../../auth/AuthProvider';
import type { Tool } from './Types';
import { emitWhiteboardEvent } from '../../services/socket';

type DrawStroke = {
  id: string;
  pts: number[];
  kind: 'draw' | 'erase';
  color: string;
  strokeWidth: number;
};

type RemoteCursor = {
  user: string;
  x: number;
  y: number;
};

interface CanvasProps {
  tool: Tool;
  color: string;
  boardId: string;
}

const GRID_SIZE = 40;
const DOT_RADIUS = 1;
const PEN_WIDTH = 2;
const ERASER_RADIUS = 200;

const Canvas = ({ tool, color, boardId }: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [drawings, setDrawings] = useState<DrawStroke[]>([]);
  const [active, setActive] = useState(false);

  const [rectStart, setRectStart] =
    useState<{ x: number; y: number } | null>(null);
  const [rectEnd, setRectEnd] =
    useState<{ x: number; y: number } | null>(null);

  const currentStrokeId = useRef<string | null>(null);
  const [remoteCursors, setRemoteCursors] = useState<
    Record<string, RemoteCursor>
  >({});

  const { username } = useAuth();

  // Resize observer
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Pointer Down
  const onPointerDown = (e: any) => {
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    setActive(true);

    if (tool === 'pen' || tool === 'erase') {
      const id = uuid();
      currentStrokeId.current = id;

      setDrawings((d) => [
        ...d,
        {
          id,
          pts: [point.x, point.y],
          kind: tool === 'erase' ? 'erase' : 'draw',
          color,
          strokeWidth: PEN_WIDTH,
        },
      ]);
    }

    if (tool === 'rectangle') {
      setRectStart(point);
      setRectEnd(point);
    }
  };

  // Pointer Move
  const onPointerMove = (e: any) => {
    if (!active) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    // Emit cursor
    if (username) {
      emitWhiteboardEvent(boardId, 'cursor', {
        user: username,
        x: point.x,
        y: point.y,
      });
    }

    if (tool === 'pen' || tool === 'erase') {
      setDrawings((d) => {
        const last = d[d.length - 1];
        if (!last) return d;

        return [
          ...d.slice(0, -1),
          { ...last, pts: last.pts.concat([point.x, point.y]) },
        ];
      });
    }

    if (tool === 'rectangle' && rectStart) {
      setRectEnd(point);
    }
  };

  // Pointer Up
  const onPointerUp = () => {
    setActive(false);

    if ((tool === 'pen' || tool === 'erase') && currentStrokeId.current) {
      const stroke = drawings.find(
        (d) => d.id === currentStrokeId.current
      );

      if (stroke) {
        emitWhiteboardEvent(boardId, 'draw', stroke);
      }
    }

    if (tool === 'rectangle' && rectStart && rectEnd) {
      const pts = [
        rectStart.x,
        rectStart.y,
        rectEnd.x,
        rectStart.y,
        rectEnd.x,
        rectEnd.y,
        rectStart.x,
        rectEnd.y,
        rectStart.x,
        rectStart.y,
      ];

      const rectStroke: DrawStroke = {
        id: uuid(),
        pts,
        kind: 'draw',
        color,
        strokeWidth: PEN_WIDTH,
      };

      setDrawings((d) => [...d, rectStroke]);
      emitWhiteboardEvent(boardId, 'draw', rectStroke);
    }

    setRectStart(null);
    setRectEnd(null);
    currentStrokeId.current = null;
  };

  // Remote socket events
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const { eventType, payload } = custom.detail;

      if (eventType === 'draw') {
        setDrawings((d) => [...d, payload]);
      }

      if (eventType === 'cursor') {
        setRemoteCursors((c) => ({
          ...c,
          [payload.user]: payload,
        }));
      }
    };

    window.addEventListener('remote-whiteboard-event', handler);
    return () =>
      window.removeEventListener('remote-whiteboard-event', handler);
  }, []);

  // Grid dots
  const gridDots = useMemo(() => {
    const dots = [];
    for (let i = 0; i < size.width; i += GRID_SIZE) {
      for (let j = 0; j < size.height; j += GRID_SIZE) {
        dots.push(
          <Circle
            key={`${i}-${j}`}
            x={i}
            y={j}
            radius={DOT_RADIUS}
            fill="#e5e7eb"
            listening={false}
          />
        );
      }
    }
    return dots;
  }, [size]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {size.width > 0 && size.height > 0 && (
        <Stage
          width={size.width}
          height={size.height}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
        >
          {/* Grid */}
          <Layer listening={false}>{gridDots}</Layer>

          {/* Drawings */}
          <Layer>
            {drawings.map((d) => (
              <Line
                key={d.id}
                points={d.pts}
                stroke={d.kind === 'erase' ? '#000' : d.color}
                strokeWidth={
                  d.kind === 'erase' ? ERASER_RADIUS : d.strokeWidth
                }
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  d.kind === 'erase'
                    ? 'destination-out'
                    : 'source-over'
                }
              />
            ))}
          </Layer>

          {/* Remote cursors */}
          <Layer listening={false}>
            {Object.values(remoteCursors).map((c) => (
              <Group key={c.user}>
                <Circle x={c.x} y={c.y} radius={5} fill="#0d6efd" />
                <Text
                  x={c.x + 8}
                  y={c.y + 8}
                  text={c.user}
                  fontSize={12}
                  fill="#0d6efd"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default Canvas;