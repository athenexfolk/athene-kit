import { drawPoint, type Point } from './point';

export type Compass = {
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

export function drawCompass(ctx: CanvasRenderingContext2D, compass: Compass) {
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

  if (drawingArc && arcStartAngle !== undefined && arcEndAngle !== undefined) {
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
