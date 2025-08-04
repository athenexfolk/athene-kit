import type { Point } from "./point";

export type Ruler = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
};

export function getLocalPos(ruler: Ruler, pos: Point): Point {
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

export function drawRuler(
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
