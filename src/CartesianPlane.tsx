function getTickPositions(min: number, max: number, step: number): number[] {
  const start = Math.ceil(min / step) * step;
  const steps = Math.floor((max - start) / step);
  const positions: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const val = +(start + i * step).toFixed(12);
    if (val > max + Number.EPSILON) break;
    positions.push(val);
  }
  return positions;
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  size: number,
) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  // Arrowhead
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - size * Math.cos(angle - Math.PI / 6),
    toY - size * Math.sin(angle - Math.PI / 6),
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - size * Math.cos(angle + Math.PI / 6),
    toY - size * Math.sin(angle + Math.PI / 6),
  );
  ctx.stroke();
}

function getPlaneSize(size: number, margin: number) {
  return size - margin * 2;
}
import { useRef, useEffect, useMemo } from 'react';

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

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
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
  tickSize?: number;
  arrowHeadSize?: number;
  axisExtension?: number;
  logging?: boolean;
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
  gridColor: '#ccc',
  gridWidth: 1,
  axisColor: '#222',
  axisWidth: 2,
  tickSize: 5,
  arrowHeadSize: 10,
  axisExtension: 20,
};

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

function drawTicksAndLabels(
  ctx: CanvasRenderingContext2D,
  ticks: number[],
  getTickPos: (val: number) => [number, number, number, number],
  getLabelPos: (val: number) => [number, number],
  label: (val: number) => string,
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
) {
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  for (const val of ticks) {
    const [x1, y1, x2, y2] = getTickPos(val);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (Math.abs(val) > 1e-8) {
      const [lx, ly] = getLabelPos(val);
      ctx.fillText(label(val), lx, ly);
    }
  }
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
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#222';

  // y axis
  if (minX <= 0 && maxX >= 0) {
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
    const xEdge = margin;
    const yTicks = getTickPositions(minY, maxY, step);
    drawTicksAndLabels(
      ctx,
      yTicks,
      (y) => [
        xEdge - tickSize,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
        xEdge,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
      ],
      (y) => [
        xEdge - tickSize * 2,
        margin + planeSize - ((y - minY) / yRange) * planeSize,
      ],
      (y) => y.toString(),
      'right',
      'middle',
    );
  }

  // x axis (y=0)
  if (minY <= 0 && maxY >= 0) {
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
    const yEdge = margin + planeSize;
    const xTicks = getTickPositions(minX, maxX, step);
    drawTicksAndLabels(
      ctx,
      xTicks,
      (x) => [
        margin + ((x - minX) / xRange) * planeSize,
        yEdge,
        margin + ((x - minX) / xRange) * planeSize,
        yEdge + tickSize,
      ],
      (x) => [margin + ((x - minX) / xRange) * planeSize, yEdge + tickSize * 2],
      (x) => x.toString(),
      'center',
      'top',
    );
  }
}

function CartesianPlane(passProps: Partial<CartesianPlaneProps>) {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.reset();

    drawGrid(ctx, props);
    drawAxis(ctx, props);
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      width={props.size}
      height={props.size}
      aria-label="Cartesian plane"
      role="img"
    />
  );
}

export default CartesianPlane;
