import { useState, useRef, useEffect, useCallback } from 'react';
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

  const zoom = useCallback((factor: number, center?: { x: number; y: number }) => {
    setView((prev) => {
      const { minX, maxX, minY, maxY } = prev;
      const oldWidth = maxX - minX;
      const oldHeight = maxY - minY;
      const newWidth = oldWidth * factor;
      const newHeight = oldHeight * factor;
      // Clamp zoom range
      const minRange = 0.01;
      const maxRange = 1000;
      const clampedWidth = Math.max(minRange, Math.min(newWidth, maxRange));
      const clampedHeight = Math.max(minRange, Math.min(newHeight, maxRange));
      if (center) {
        // Calculate the relative position of the center in the old view
        const relX = (center.x - minX) / oldWidth;
        const relY = (center.y - minY) / oldHeight;
        // After zoom, keep center.x/y at the same screen position
        const newMinX = center.x - relX * clampedWidth;
        const newMaxX = newMinX + clampedWidth;
        const newMinY = center.y - relY * clampedHeight;
        const newMaxY = newMinY + clampedHeight;
        return {
          minX: newMinX,
          maxX: newMaxX,
          minY: newMinY,
          maxY: newMaxY,
        };
      } else {
        // Default: zoom to center
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        return {
          minX: cx - clampedWidth / 2,
          maxX: cx + clampedWidth / 2,
          minY: cy - clampedHeight / 2,
          maxY: cy + clampedHeight / 2,
        };
      }
    });
  }, []);

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
  // Ref for the container div
  const containerRef = useRef<HTMLDivElement>(null);

  // Wheel handler for zooming with Ctrl, attached natively for passive: false
  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;
    function handleWheel(e: WheelEvent) {
      if (e.ctrlKey) {
        e.preventDefault();
        const rect = div!.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? 0.8 : 1.25;
        const planeSize = size - margin * 2;
        const x = view.minX + ((px - margin) / planeSize) * (view.maxX - view.minX);
        const y = view.maxY - ((py - margin) / planeSize) * (view.maxY - view.minY);
        zoom(factor, { x, y });
      }
    }
    div.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      div.removeEventListener('wheel', handleWheel);
    };
  }, [size, margin, view, zoom]);

  const xRange = view.maxX - view.minX;
  const gridStep = getNiceStep(xRange);

  return (
    <div
      ref={containerRef}
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
      tabIndex={0} // allow div to receive keyboard events for ctrlKey
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
