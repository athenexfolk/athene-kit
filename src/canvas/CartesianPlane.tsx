import {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  getTickPositions,
  drawArrow,
  drawTicksAndLabels,
} from './utils/canvasUtils';

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Point {
  x: number;
  y: number;
}

export interface DisplayPoint extends Point {
  color?: string;
  label?: string;
}

export interface DisplayLine {
  points?: Point[];
  fn?: (x: number) => number;
  domain?: [number, number];
  color?: string;
  width?: number;
  dash?: number[];
}

interface CartesianPlaneProps extends Bounds {
  size: number;
  margin: number;
  step: number;
  showGrid: boolean;
  gridColor: string;
  gridWidth: number;
  axisColor: string;
  axisWidth: number;
  tickSize: number;
  arrowHeadSize: number;
  axisExtension: number;
  points: DisplayPoint[];
  lines?: DisplayLine[];
}

const defaultProps: CartesianPlaneProps = {
  size: 800,
  margin: 50,
  minX: -10,
  maxX: 10,
  minY: -10,
  maxY: 10,
  step: 1,
  showGrid: true,
  gridColor: '#ddd',
  gridWidth: 1,
  axisColor: '#222',
  axisWidth: 2,
  tickSize: 5,
  arrowHeadSize: 10,
  axisExtension: 20,
  points: [],
};

const CartesianPlane = forwardRef<
  HTMLCanvasElement,
  Partial<CartesianPlaneProps>
>(function CartesianPlane(passProps, ref) {
  const props = useMemo(() => {
    const merged: CartesianPlaneProps = {
      ...defaultProps,
      ...passProps,
    };
    const adjusted = adjustSquareBound(
      merged.minX,
      merged.maxX,
      merged.minY,
      merged.maxY,
    );
    merged.maxX = adjusted.maxX;
    merged.maxY = adjusted.maxY;
    return merged;
  }, [passProps]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => {
    if (!canvasRef.current) {
      const dummy = document.createElement('canvas');
      return dummy;
    }
    return canvasRef.current;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = 2.5 * (window.devicePixelRatio || 1);
    canvas.width = props.size * dpr;
    canvas.height = props.size * dpr;
    canvas.style.width = `${props.size}px`;
    canvas.style.height = `${props.size}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Stage 1: Reset and scale for high-DPI
    ctx.reset();
    ctx.save();
    ctx.scale(dpr, dpr);

    // Stage 2: Clip to graph container
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      props.margin,
      props.margin,
      getPlaneSize(props.size, props.margin),
      getPlaneSize(props.size, props.margin),
    );
    ctx.clip();
    ctx.restore();

    // Stage 3: Draw grid and axes (unclipped for labels/ticks)
    if (props.showGrid) drawGrid(ctx, props);
    drawAxis(ctx, props);

    // Stage 4: Clip again for graph content (lines/points)
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      props.margin,
      props.margin,
      getPlaneSize(props.size, props.margin),
      getPlaneSize(props.size, props.margin),
    );
    ctx.clip();

    // Stage 5: Draw lines and points (clipped to graph area)
    drawLines(ctx, props);
    drawPoints(ctx, props);
    drawLines(ctx, props);

    // Stage 6: Restore to previous state
    ctx.restore();
    ctx.restore();
  }, [props]);

  return <canvas ref={canvasRef} aria-label="Cartesian plane" role="img" />;
});

export default CartesianPlane;

function getPlaneSize(size: number, margin: number) {
  return size - margin * 2;
}

function adjustSquareBound(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): Bounds {
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const diff = Math.abs(xRange - yRange);

  if (xRange > yRange) {
    maxY += diff;
  } else {
    maxX += diff;
  }

  return { minX, minY, maxX, maxY };
}

function drawGrid(ctx: CanvasRenderingContext2D, props: CartesianPlaneProps) {
  const { size, margin, minX, maxX, minY, maxY, step, gridColor, gridWidth } =
    props;
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const planeSize = getPlaneSize(size, margin);

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = gridWidth;
  ctx.beginPath();

  // Vertical grid lines
  const xTicks = getTickPositions(minX, maxX, step);
  for (const x of xTicks) {
    const px = margin + ((x - minX) / xRange) * planeSize;
    ctx.moveTo(px, margin);
    ctx.lineTo(px, margin + planeSize);
  }

  // Horizontal grid lines
  const yTicks = getTickPositions(minY, maxY, step);
  for (const y of yTicks) {
    const py = margin + planeSize - ((y - minY) / yRange) * planeSize;
    ctx.moveTo(margin, py);
    ctx.lineTo(margin + planeSize, py);
  }

  ctx.stroke();
}

function drawAxis(ctx: CanvasRenderingContext2D, props: CartesianPlaneProps) {
  const {
    size,
    margin,
    minX,
    maxX,
    minY,
    maxY,
    step,
    axisColor,
    axisWidth,
    tickSize = 5,
    arrowHeadSize = 10,
    axisExtension = 20,
  } = props;
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const planeSize = getPlaneSize(size, margin);

  ctx.strokeStyle = axisColor;
  ctx.lineWidth = axisWidth;

  // y axis
  if (minX <= 0 && maxX >= 0) {
    // y axis visible
    const x0 = margin + ((0 - minX) / xRange) * planeSize;
    ctx.beginPath();
    ctx.moveTo(x0, margin);
    ctx.lineTo(x0, margin + planeSize);
    ctx.stroke();

    // Draw ticks and labels on y axis
    const yTicks = getTickPositions(minY, maxY, step);
    drawTicksAndLabels(
      ctx,
      yTicks,
      (y) => [
        x0 - tickSize,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
        x0 + tickSize,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
      ],
      (y) => [
        x0 - tickSize * 2,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
      ],
      (y) => y.toString(),
      'right',
      'middle',
      false,
    );

    // Top arrow
    drawArrow(
      ctx,
      x0,
      margin + arrowHeadSize,
      x0,
      margin - axisExtension,
      arrowHeadSize,
    );
    // Bottom arrow
    drawArrow(
      ctx,
      x0,
      margin + planeSize - arrowHeadSize,
      x0,
      margin + planeSize + axisExtension,
      arrowHeadSize,
    );
  } else {
    // y axis not visible
    const yTicks = getTickPositions(minY, maxY, step);
    // If axis is to the right, draw ticks on right edge, else left
    const axisOnRight = maxX < 0;
    const xEdge = axisOnRight ? margin + planeSize : margin;
    const tickDir = axisOnRight ? 1 : -1;
    drawTicksAndLabels(
      ctx,
      yTicks,
      (y) => [
        xEdge,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
        xEdge + tickDir * tickSize,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
      ],
      (y) => [
        xEdge + tickDir * tickSize * 2,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
      ],
      (y) => y.toString(),
      axisOnRight ? 'left' : 'right',
      'middle',
      false,
    );
  }

  // x axis (y=0)
  if (minY <= 0 && maxY >= 0) {
    // x axis visible
    const y0 = margin + planeSize - ((0 - minY) / yRange) * planeSize;
    ctx.beginPath();
    ctx.moveTo(margin, y0);
    ctx.lineTo(margin + planeSize, y0);
    ctx.stroke();

    // Draw ticks and labels on x axis
    const xTicks = getTickPositions(minX, maxX, step);
    drawTicksAndLabels(
      ctx,
      xTicks,
      (x) => [
        margin + ((x - minX) / xRange) * planeSize,
        y0 - tickSize,
        margin + ((x - minX) / xRange) * planeSize,
        y0 + tickSize,
      ],
      (x) => [margin + ((x - minX) / xRange) * planeSize, y0 + tickSize * 2],
      (x) => x.toString(),
      'center',
      'top',
      false,
    );

    // Left arrow
    drawArrow(
      ctx,
      margin + arrowHeadSize,
      y0,
      margin - axisExtension,
      y0,
      arrowHeadSize,
    );
    // Right arrow
    drawArrow(
      ctx,
      margin + planeSize - arrowHeadSize,
      y0,
      margin + planeSize + axisExtension,
      y0,
      arrowHeadSize,
    );
  } else {
    // x axis not visible
    const xTicks = getTickPositions(minX, maxX, step);
    // If axis is above, draw ticks on top edge, else bottom
    const axisOnTop = maxY < 0;
    const yEdge = axisOnTop ? margin : margin + planeSize;
    const tickDir = axisOnTop ? -1 : 1;
    drawTicksAndLabels(
      ctx,
      xTicks,
      (x) => [
        margin + ((x - minX) / xRange) * planeSize,
        yEdge,
        margin + ((x - minX) / xRange) * planeSize,
        yEdge + tickDir * tickSize,
      ],
      (x) => [
        margin + ((x - minX) / xRange) * planeSize,
        yEdge + tickDir * tickSize * 2,
      ],
      (x) => x.toString(),
      'center',
      axisOnTop ? 'bottom' : 'top',
      false,
    );
  }
}

function drawPoints(ctx: CanvasRenderingContext2D, props: CartesianPlaneProps) {
  const { size, margin, minX, maxX, minY, maxY, points } = props;
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const planeSize = getPlaneSize(size, margin);

  for (const pt of points) {
    const px = margin + ((pt.x - minX) / xRange) * planeSize;
    const py = margin + planeSize - ((pt.y - minY) / yRange) * planeSize;
    ctx.fillStyle = pt.color || '#e53';
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI); // 5px radius
    ctx.fill();
    if (pt.label) {
      ctx.font = '12px cambria-math';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = pt.color || '#222';
      ctx.fillText(pt.label, px + 8, py + 8);
    }
  }
}

function drawLines(ctx: CanvasRenderingContext2D, props: CartesianPlaneProps) {
  const { size, margin, minX, maxX, minY, maxY, lines } = props;
  if (!lines) return;
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const planeSize = getPlaneSize(size, margin);

  for (const line of lines) {
    ctx.save();
    ctx.strokeStyle = line.color || '#555';
    ctx.lineWidth = line.width || 2;
    if (line.dash) ctx.setLineDash(line.dash);

    if (line.fn && line.domain) {
      // Draw curve by sampling points, break at discontinuities
      const [xStart, xEnd] = line.domain;
      const steps = 200;
      ctx.beginPath();
      let started = false;
      let prevY: number | undefined = undefined;
      for (let i = 0; i <= steps; i++) {
        const x = xStart + ((xEnd - xStart) * i) / steps;
        const y = line.fn(x);
        if (!isFinite(y)) {
          started = false;
          prevY = undefined;
          continue;
        }
        // Break path if jump is too large (vertical asymptote)
        if (prevY !== undefined && Math.abs(y - prevY) > yRange) {
          started = false;
        }
        const px = margin + ((x - minX) / xRange) * planeSize;
        const py = margin + planeSize - ((y - minY) / yRange) * planeSize;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
        prevY = y;
      }
      ctx.stroke();
    } else if (line.points && line.points.length >= 2) {
      ctx.beginPath();
      for (let i = 0; i < line.points.length; i++) {
        const pt = line.points[i];
        const px = margin + ((pt.x - minX) / xRange) * planeSize;
        const py = margin + planeSize - ((pt.y - minY) / yRange) * planeSize;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }
}
