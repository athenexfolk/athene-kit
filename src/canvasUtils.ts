export function drawTicksAndLabels(
  ctx: CanvasRenderingContext2D,
  ticks: number[],
  getTickPos: (val: number) => [number, number, number, number],
  getLabelPos: (val: number) => [number, number],
  label: (val: number) => string,
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  showZeroLabel = true,
) {
  ctx.font = '12px cambria-math';
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
    if (showZeroLabel || Math.abs(val) > 1e-8) {
      const [lx, ly] = getLabelPos(val);
      ctx.fillText(formatLabel(val), lx, ly);
    }
  }
}
export function getTickPositions(
  min: number,
  max: number,
  step: number,
): number[] {
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

export function drawArrow(
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
