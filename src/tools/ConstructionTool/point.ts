export type Point = { x: number; y: number };

export function drawPoint(
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
