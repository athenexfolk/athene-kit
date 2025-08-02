import React, { useRef, useEffect, useState } from 'react';

// Types
type Point = { x: number; y: number };
type Ruler = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
};
type Line =
  | { type: 'free'; points: Point[] }
  | { type: 'ruler'; from: Point; to: Point }
  | {
      type: 'arc';
      center: Point;
      radius: number;
      startAngle: number;
      endAngle: number;
      counterClockwise?: boolean;
    };
type LinearDrawing = {
  edgeCenter: Point;
  edgeDir: Point;
  startProj: number;
  offset: number;
  perp: Point;
};
type Compass = {
  pivot: Point;
  radius: number;
  angle: number;
  theta: number;
  dragging: null | 'pivot' | 'pen' | 'needle';
  dragOffset?: Point;
  drawingArc: boolean;
  arcStartAngle?: number;
  arcEndAngle?: number;
  arcCounterClockwise?: boolean;
  arcLastPointerAngle?: number;
  arcAccumulatedDelta?: number;
};

// Constants
const INITIAL_RULER: Ruler = {
  x: 100,
  y: 100,
  width: 480,
  height: 80,
  angle: 0,
};
const RULER_OFFSETS: Record<string, number> = {
  top: -2,
  bottom: 2,
  left: -2,
  right: 2,
};
const INITIAL_COMPASS: Compass = {
  pivot: { x: 350, y: 200 },
  radius: 80,
  angle: Math.PI / 2.2,
  theta: 0,
  dragging: null,
  drawingArc: false,
};

// Helper: draw a colored point (with optional stroke)
function drawPoint(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string,
  r: number,
  stroke?: { color: string; width: number },
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, 2 * Math.PI);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    ctx.arc(point.x, point.y, r, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

const ConstructionTool: React.FC = () => {
  const MIN_COMPASS_RADIUS = 48;
  const [compass, setCompass] = useState<Compass | null>(INITIAL_COMPASS);
  const [compassEnabled, setCompassEnabled] = useState(false);

  function drawCompass(ctx: CanvasRenderingContext2D, compass: Compass) {
    const { pivot, radius, theta, drawingArc, arcStartAngle, arcEndAngle } =
      compass;
    const red = pivot;
    const green = {
      x: pivot.x + radius * Math.cos(theta),
      y: pivot.y + radius * Math.sin(theta),
    };
    const tBlue = 0.5;
    const blue = {
      x: red.x + tBlue * (green.x - red.x),
      y: red.y + tBlue * (green.y - red.y),
    };

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(red.x, red.y);
    ctx.lineTo(green.x, green.y);
    ctx.stroke();

    drawPoint(ctx, red, '#e53935', 8);
    drawPoint(ctx, green, '#43a047', 8);
    drawPoint(ctx, blue, '#1976d2', 10, { color: '#fff', width: 2 });

    ctx.restore();

    if (
      drawingArc &&
      arcStartAngle !== undefined &&
      arcEndAngle !== undefined
    ) {
      ctx.save();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        red.x,
        red.y,
        radius,
        arcStartAngle,
        arcEndAngle,
        compass.arcCounterClockwise || false,
      );
      ctx.stroke();
      ctx.restore();
    }
  }
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<Point | null>(null);
  const [ruler, setRuler] = useState<Ruler>(INITIAL_RULER);
  const [draggingRuler, setDraggingRuler] = useState(false);
  const [rotatingRuler, setRotatingRuler] = useState(false);
  const [linearDrawing, setLinearDrawing] = useState<LinearDrawing | null>(
    null,
  );
  const [lines, setLines] = useState<Line[]>([]);
  const [rulerEnabled, setRulerEnabled] = useState(false);

  function drawRuler(
    ctx: CanvasRenderingContext2D,
    ruler: Ruler,
    dragging: boolean,
    rotating: boolean,
  ) {
    ctx.save();
    ctx.translate(ruler.x + ruler.width / 2, ruler.y + ruler.height / 2);
    ctx.rotate(ruler.angle || 0);
    ctx.strokeStyle = dragging ? '#1976d2' : rotating ? '#e67e22' : '#222';
    ctx.lineWidth = 2;
    ctx.setLineDash(dragging || rotating ? [6, 4] : []);
    ctx.strokeRect(
      -ruler.width / 2,
      -ruler.height / 2,
      ruler.width,
      ruler.height,
    );
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(-ruler.width / 2 + 4, -ruler.height / 2 + 4, 12, 12);
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.arc(ruler.width / 2 - 12, -ruler.height / 2 + 10, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
  function drawFreeLine(ctx: CanvasRenderingContext2D, points: Point[]) {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  function drawRulerLine(
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
  ) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  const drawLine = React.useCallback(
    (
      ctx: CanvasRenderingContext2D,
      line: Line | (Line & { counterClockwise?: boolean }),
    ) => {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#222';
      if (line.type === 'free') {
        drawFreeLine(ctx, line.points);
      } else if (line.type === 'ruler') {
        drawRulerLine(ctx, line.from, line.to);
      } else if (line.type === 'arc') {
        ctx.beginPath();
        ctx.arc(
          line.center.x,
          line.center.y,
          line.radius,
          line.startAngle,
          line.endAngle,
          (line as { counterClockwise?: boolean }).counterClockwise || false,
        );
        ctx.stroke();
      }
      ctx.restore();
    },
    [],
  );

  function drawLinearPreview(
    ctx: CanvasRenderingContext2D,
    linearDrawing: LinearDrawing,
    lastPos: Point,
  ) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#222';
    const { edgeCenter, edgeDir, startProj, offset, perp } = linearDrawing;
    const dx = lastPos.x - edgeCenter.x;
    const dy = lastPos.y - edgeCenter.y;
    const proj = dx * edgeDir.x + dy * edgeDir.y;
    const from = {
      x: edgeCenter.x + edgeDir.x * startProj + perp.x * offset,
      y: edgeCenter.y + edgeDir.y * startProj + perp.y * offset,
    };
    const to = {
      x: edgeCenter.x + edgeDir.x * proj + perp.x * offset,
      y: edgeCenter.y + edgeDir.y * proj + perp.y * offset,
    };
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (rulerEnabled) {
      drawRuler(ctx, ruler, draggingRuler, rotatingRuler);
    }
    if (compassEnabled && compass) {
      drawCompass(ctx, compass);
    }
    for (const line of lines) drawLine(ctx, line);
    if (linearDrawing && lastPos)
      drawLinearPreview(ctx, linearDrawing, lastPos);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#222';
  }, [
    ruler,
    draggingRuler,
    rotatingRuler,
    linearDrawing,
    lastPos,
    lines,
    drawLine,
    rulerEnabled,
    compass,
    compassEnabled,
  ]);

  function getLocalPos(pos: Point): Point {
    const angle = ruler.angle || 0;
    const cx = ruler.x + ruler.width / 2;
    const cy = ruler.y + ruler.height / 2;
    const dx = pos.x - cx;
    const dy = pos.y - cy;
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    return {
      x: dx * cos - dy * sin + ruler.width / 2,
      y: dx * sin + dy * cos + ruler.height / 2,
    };
  }

  function getPointerPos(
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ): Point {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }

  const handlePointerDown = (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const pos = getPointerPos(e);
    if ('preventDefault' in e && !('touches' in e)) e.preventDefault();

    if (compassEnabled && compass) {
      const { pivot, radius, theta } = compass;
      const red = pivot;
      const green = {
        x: pivot.x + radius * Math.cos(theta),
        y: pivot.y + radius * Math.sin(theta),
      };
      const tBlue = 0.5;
      const blue = {
        x: red.x + tBlue * (green.x - red.x),
        y: red.y + tBlue * (green.y - red.y),
      };
      const distToRed = Math.hypot(pos.x - red.x, pos.y - red.y);
      const distToGreen = Math.hypot(pos.x - green.x, pos.y - green.y);
      const distToBlue = Math.hypot(pos.x - blue.x, pos.y - blue.y);
      if (distToRed <= 12) {
        setCompass({
          ...compass,
          dragging: 'needle',
          dragOffset: { x: pos.x - red.x, y: pos.y - red.y },
        });
        return;
      }
      if (distToGreen <= 12) {
        setCompass({
          ...compass,
          dragging: 'pen',
          dragOffset: { x: pos.x - green.x, y: pos.y - green.y },
        });
        return;
      }
      if (distToBlue <= 14) {
        const startAngle = Math.atan2(green.y - red.y, green.x - red.x);
        setCompass({
          ...compass,
          dragging: 'pivot',
          drawingArc: true,
          arcStartAngle: startAngle,
          arcEndAngle: startAngle,
          arcCounterClockwise: false,
          arcLastPointerAngle: startAngle,
          arcAccumulatedDelta: 0,
        });
        return;
      }

      return;
    }
    if (rulerEnabled) {
      const local = getLocalPos(pos);
      const rotateHandleX = ruler.width - 12;
      const rotateHandleY = 10;
      const dist = Math.hypot(local.x - rotateHandleX, local.y - rotateHandleY);
      if (dist <= 8) {
        setRotatingRuler(true);
        setDrawing(false);
        setLastPos(null);
        setLinearDrawing(null);
        return;
      }
      const threshold = 8;
      const angle = ruler.angle || 0;
      const cx = ruler.x + ruler.width / 2;
      const cy = ruler.y + ruler.height / 2;
      const edges = [
        {
          name: 'top',
          center: { x: ruler.width / 2, y: 0 },
          dir: { x: 1, y: 0 },
          length: ruler.width,
        },
        {
          name: 'bottom',
          center: { x: ruler.width / 2, y: ruler.height },
          dir: { x: 1, y: 0 },
          length: ruler.width,
        },
        {
          name: 'left',
          center: { x: 0, y: ruler.height / 2 },
          dir: { x: 0, y: 1 },
          length: ruler.height,
        },
        {
          name: 'right',
          center: { x: ruler.width, y: ruler.height / 2 },
          dir: { x: 0, y: 1 },
          length: ruler.height,
        },
      ];
      let chosen = null;
      for (const edge of edges) {
        if (
          (ruler.width >= ruler.height &&
            (edge.name === 'top' || edge.name === 'bottom')) ||
          (ruler.height > ruler.width &&
            (edge.name === 'left' || edge.name === 'right'))
        ) {
          const perp = edge.dir.x === 1 ? { x: 0, y: 1 } : { x: 1, y: 0 };
          const dx = local.x - edge.center.x;
          const dy = local.y - edge.center.y;
          const distToEdge = dx * perp.x + dy * perp.y;
          const absDistToEdge = Math.abs(distToEdge);
          const along = dx * edge.dir.x + dy * edge.dir.y;
          if (
            absDistToEdge <= threshold &&
            along >= -edge.length / 2 &&
            along <= edge.length / 2
          ) {
            chosen = { ...edge, perp };
            break;
          }
        }
      }
      if (chosen) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const edgeCenter = {
          x:
            cx +
            (chosen.center.x - ruler.width / 2) * cos -
            (chosen.center.y - ruler.height / 2) * sin,
          y:
            cy +
            (chosen.center.x - ruler.width / 2) * sin +
            (chosen.center.y - ruler.height / 2) * cos,
        };
        const edgeDir = {
          x: chosen.dir.x * cos - chosen.dir.y * sin,
          y: chosen.dir.x * sin + chosen.dir.y * cos,
        };
        const perp = {
          x: chosen.perp.x * cos - chosen.perp.y * sin,
          y: chosen.perp.x * sin + chosen.perp.y * cos,
        };
        const offset = RULER_OFFSETS[chosen.name] || 0;
        const dx0 = pos.x - edgeCenter.x;
        const dy0 = pos.y - edgeCenter.y;
        const startProj = dx0 * edgeDir.x + dy0 * edgeDir.y;
        setLinearDrawing({ edgeCenter, edgeDir, startProj, offset, perp });
        setDrawing(false);
        setLastPos(pos);
        return;
      }
      if (
        local.x >= 0 &&
        local.x <= ruler.width &&
        local.y >= 0 &&
        local.y <= ruler.height
      ) {
        setDraggingRuler(true);
        setDrawing(false);
        setLastPos(null);
        setLinearDrawing(null);
        return;
      }

      return;
    }

    if (!rulerEnabled && !compassEnabled) {
      setDrawing(true);
      setLastPos(pos);
      setLinearDrawing(null);
      setLines((prev) => [...prev, { type: 'free', points: [pos] }]);
      return;
    }
  };

  const handlePointerUp = (
    e?:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (e && 'preventDefault' in e && !('touches' in e)) e.preventDefault();
    if (!rulerEnabled && !compassEnabled) {
      setDrawing(false);
      setLastPos(null);
      return;
    }

    if (compassEnabled && compass && compass.dragging) {
      if (
        compass.drawingArc &&
        typeof compass.arcStartAngle === 'number' &&
        typeof compass.arcEndAngle === 'number' &&
        compass.arcEndAngle !== compass.arcStartAngle
      ) {
        setLines((prev) => [
          ...prev,
          {
            type: 'arc',
            center: { ...compass.pivot },
            radius: compass.radius,
            startAngle: compass.arcStartAngle as number,
            endAngle: compass.arcEndAngle as number,
            counterClockwise: compass.arcCounterClockwise || false,
          },
        ]);
      }
      setCompass({ ...compass, dragging: null, drawingArc: false });
      return;
    }

    if (linearDrawing && lastPos) {
      const { edgeCenter, edgeDir, startProj, offset, perp } = linearDrawing;
      const dx = lastPos.x - edgeCenter.x;
      const dy = lastPos.y - edgeCenter.y;
      const proj = dx * edgeDir.x + dy * edgeDir.y;
      const from = {
        x: edgeCenter.x + edgeDir.x * startProj + perp.x * offset,
        y: edgeCenter.y + edgeDir.y * startProj + perp.y * offset,
      };
      const to = {
        x: edgeCenter.x + edgeDir.x * proj + perp.x * offset,
        y: edgeCenter.y + edgeDir.y * proj + perp.y * offset,
      };
      setLines((prev) => [...prev, { type: 'ruler', from, to }]);
    }
    setDraggingRuler(false);
    setRotatingRuler(false);
    setLinearDrawing(null);
    setDrawing(false);
    setLastPos(null);
  };

  const handlePointerMove = (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const pos = getPointerPos(e);
    if ('preventDefault' in e && !('touches' in e)) e.preventDefault();

    if (rulerEnabled) {
      if (draggingRuler || rotatingRuler) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const x = pos.x;
        const y = pos.y;
        if (draggingRuler) {
          setRuler((prev: Ruler) => ({
            ...prev,
            x: x - prev.width / 2,
            y: y - prev.height / 2,
          }));
        } else if (rotatingRuler) {
          const cx = ruler.x + ruler.width / 2;
          const cy = ruler.y + ruler.height / 2;
          const angle = Math.atan2(y - cy, x - cx);
          setRuler((prev: Ruler) => ({ ...prev, angle }));
        }
        return;
      }

      if (linearDrawing) {
        setLastPos(pos);
        return;
      }
    }
    if (!rulerEnabled && !compassEnabled) {
      if (!drawing) return;
      if (lastPos) {
        setLines((prev) => {
          if (prev.length === 0 || prev[prev.length - 1].type !== 'free')
            return prev;
          const newLines = prev.slice();
          const last = newLines[newLines.length - 1];
          if (last.type === 'free') {
            last.points = [...last.points, pos];
          }
          return newLines;
        });
        setLastPos(pos);
      }
      return;
    }

    if (compassEnabled && compass && compass.dragging) {
      const { pivot, dragging, dragOffset, arcStartAngle } = compass;
      if (!dragging) return;

      const red = pivot;

      if (dragging === 'needle' && dragOffset) {
        const newRed = { x: pos.x - dragOffset.x, y: pos.y - dragOffset.y };
        setCompass({ ...compass, pivot: newRed });
      } else if (dragging === 'pen' && dragOffset) {
        const dx = pos.x - red.x;
        const dy = pos.y - red.y;
        let newRadius = Math.hypot(dx, dy);
        if (newRadius < MIN_COMPASS_RADIUS) newRadius = MIN_COMPASS_RADIUS;
        const newTheta = Math.atan2(dy, dx);
        setCompass({ ...compass, radius: newRadius, theta: newTheta });
      } else if (
        dragging === 'pivot' &&
        arcStartAngle !== undefined &&
        compass.arcLastPointerAngle !== undefined
      ) {
        const arcAngle = Math.atan2(pos.y - red.y, pos.x - red.x);
        let delta = arcAngle - compass.arcLastPointerAngle;

        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        let newAccum = (compass.arcAccumulatedDelta || 0) + delta;

        if (newAccum > Math.PI * 6) newAccum = Math.PI * 6;
        if (newAccum < -Math.PI * 6) newAccum = -Math.PI * 6;
        const arcEndAngle = (compass.arcStartAngle ?? 0) + newAccum;
        setCompass({
          ...compass,
          arcEndAngle,
          theta: arcAngle,
          arcCounterClockwise: newAccum < 0,
          arcLastPointerAngle: arcAngle,
          arcAccumulatedDelta: newAccum,
        });
      }

      return;
    }

    if (!drawing) return;

    if (lastPos) {
      setLines((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].type !== 'free')
          return prev;

        const newLines = prev.slice();
        const last = newLines[newLines.length - 1];
        if (last.type === 'free') {
          last.points = [...last.points, pos];
        }
        return newLines;
      });
      setLastPos(pos);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
        <label
          style={{
            background: '#fff',
            padding: '4px 8px',
            borderRadius: 4,
            boxShadow: '0 1px 4px #0002',
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            checked={rulerEnabled}
            onChange={(e) => {
              setRulerEnabled(e.target.checked);
              if (e.target.checked) setCompassEnabled(false);
            }}
            style={{ marginRight: 6 }}
          />
          Ruler enabled
        </label>
      </div>
      <div style={{ position: 'absolute', top: 8, left: 140, zIndex: 2 }}>
        <label
          style={{
            background: '#fff',
            padding: '4px 8px',
            borderRadius: 4,
            boxShadow: '0 1px 4px #0002',
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            checked={compassEnabled}
            onChange={(e) => {
              setCompassEnabled(e.target.checked);
              if (e.target.checked) setRulerEnabled(false);
            }}
            style={{ marginRight: 6 }}
          />
          Compass enabled
        </label>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          border: '1px solid #ccc',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onMouseMove={handlePointerMove}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      />
      <pre>{JSON.stringify(lines, null, 2)}</pre>
    </div>
  );
};

export default ConstructionTool;
