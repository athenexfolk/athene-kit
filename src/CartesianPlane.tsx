import {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';

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
  tickSize: number;
  arrowHeadSize: number;
  axisExtension: number;
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

    ctx.reset();
    ctx.save();
    ctx.scale(dpr, dpr);
    if (props.showGrid) drawGrid(ctx, props);
    drawAxis(ctx, props);
    ctx.restore();
  }, [props]);

  return <canvas ref={canvasRef} aria-label="Cartesian plane" role="img" />;
});

export default CartesianPlane;

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

function drawTicksAndLabels(
  ctx: CanvasRenderingContext2D,
  ticks: number[],
  getTickPos: (val: number) => [number, number, number, number],
  getLabelPos: (val: number) => [number, number],
  label: (val: number) => string,
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
) {
  // Helper to use Unicode minus for negative numbers
  const formatLabel = (val: number) => {
    const str = label(val);
    return str.replace(/^-/, '\u2212');
  };
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
      ctx.fillText(formatLabel(val), lx, ly);
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
  ctx.font = '12px cambria-math';
  ctx.fillStyle = '#222';

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
    );
  }
}
