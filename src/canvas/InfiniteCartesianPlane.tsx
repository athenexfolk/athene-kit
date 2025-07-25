import { useState } from 'react';
import CartesianPlane from './CartesianPlane';
import type {
  DisplayPoint,
  DisplayLine,
  CartesianPlaneProps,
} from './CartesianPlane';

interface InfiniteCartesianPlaneProps {
  initialMinX?: number;
  initialMaxX?: number;
  initialMinY?: number;
  initialMaxY?: number;
  points?: DisplayPoint[];
  lines?: DisplayLine[];
  size?: number;
  margin?: number;
  step?: number;
  showGrid?: boolean;
  gridColor?: string;
  gridWidth?: number;
  axisColor?: string;
  axisWidth?: number;
  tickSize?: number;
  arrowHeadSize?: number;
  axisExtension?: number;
  dpr?: number;
  onDraw?: (ctx: CanvasRenderingContext2D, props: CartesianPlaneProps) => void;
}

export default function InfiniteCartesianPlane({
  initialMinX = -10,
  initialMaxX = 10,
  initialMinY = -10,
  initialMaxY = 10,
  points = [],
  lines = [],
  size = 800,
  margin = 50,
  // step = 1,
  showGrid = true,
  gridColor = '#ddd',
  gridWidth = 1,
  axisColor = '#222',
  axisWidth = 2,
  tickSize = 5,
  arrowHeadSize = 10,
  axisExtension = 20,
  dpr,
  onDraw,
  ...rest
}: InfiniteCartesianPlaneProps) {
  const [view, setView] = useState({
    minX: initialMinX,
    maxX: initialMaxX,
    minY: initialMinY,
    maxY: initialMaxY,
  });

  function getNiceStep(range: number): number {
    // Target: ~10 grid lines
    const targetLines = 10;
    const rawStep = range / targetLines;
    const exponent = Math.floor(Math.log10(rawStep));
    const base = Math.pow(10, exponent);
    const fraction = rawStep / base;
    let niceFraction;
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
    return niceFraction * base;
  }

  function zoom(factor: number, center?: { x: number; y: number }) {
    const { minX, maxX, minY, maxY } = view;
    // Use provided center or default to view center
    const cx = center ? center.x : (minX + maxX) / 2;
    const cy = center ? center.y : (minY + maxY) / 2;
    let xRange = ((maxX - minX) * factor) / 2;
    let yRange = ((maxY - minY) * factor) / 2;
    // Clamp zoom range
    const minRange = 0.01; // minimum visible range (zoom in limit)
    const maxRange = 1000; // maximum visible range (zoom out limit)
    xRange = Math.max(minRange, Math.min(xRange, maxRange));
    yRange = Math.max(minRange, Math.min(yRange, maxRange));
    setView({
      minX: cx - xRange,
      maxX: cx + xRange,
      minY: cy - yRange,
      maxY: cy + yRange,
    });
  }

  function pan(dx: number, dy: number) {
    setView((v) => ({
      minX: v.minX + dx,
      maxX: v.maxX + dx,
      minY: v.minY + dy,
      maxY: v.maxY + dy,
    }));
  }

  // Mouse drag and wheel zoom state
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  function onMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  }
  function onMouseUp() {
    setDragging(false);
    setLastPos(null);
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging || !lastPos) return;
    const dxPx = e.clientX - lastPos.x;
    const dyPx = e.clientY - lastPos.y;
    setLastPos({ x: e.clientX, y: e.clientY });
    const { minX, maxX, minY, maxY } = view;
    const xRange = maxX - minX;
    const yRange = maxY - minY;
    const planeSize = size - margin * 2;
    const dx = -dxPx * (xRange / planeSize);
    const dy = dyPx * (yRange / planeSize);
    pan(dx, dy);
  }
  function onWheel(e: React.WheelEvent) {
    if (e.cancelable) {
      e.preventDefault();
    }
    // Snap zoom: each wheel event is a fixed step
    const factor = e.deltaY < 0 ? 0.8 : 1.25;
    // Get mouse position relative to canvas
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Convert to coordinate space
    const planeSize = size - margin * 2;
    const x = view.minX + ((px - margin) / planeSize) * (view.maxX - view.minX);
    const y = view.maxY - ((py - margin) / planeSize) * (view.maxY - view.minY);
    zoom(factor, { x, y });
  }

  const xRange = view.maxX - view.minX;
  const gridStep = getNiceStep(xRange);

  return (
    <div
      style={{
        userSelect: 'none',
        touchAction: 'none',
        overflow: 'hidden',
        width: size,
        height: size,
        maxWidth: '100vw',
        maxHeight: '100vh',
        position: 'relative',
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
    >
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => zoom(0.8)}>Zoom In</button>
        <button onClick={() => zoom(1.25)}>Zoom Out</button>
        <button onClick={() => pan(-2, 0)}>←</button>
        <button onClick={() => pan(2, 0)}>→</button>
        <button onClick={() => pan(0, 2)}>↑</button>
        <button onClick={() => pan(0, -2)}>↓</button>
      </div>
      <CartesianPlane
        minX={view.minX}
        maxX={view.maxX}
        minY={view.minY}
        maxY={view.maxY}
        points={points}
        lines={lines}
        size={size}
        margin={margin}
        step={gridStep}
        showGrid={showGrid}
        gridColor={gridColor}
        gridWidth={gridWidth}
        axisColor={axisColor}
        axisWidth={axisWidth}
        tickSize={tickSize}
        arrowHeadSize={arrowHeadSize}
        axisExtension={axisExtension}
        dpr={dpr}
        onDraw={onDraw}
        {...rest}
      />
    </div>
  );
}
