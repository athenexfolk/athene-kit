import { useRef, useEffect } from 'react';

function adjustSquareValue(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): [number, number, number, number] {
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const diff = Math.abs(xRange - yRange);

  if (xRange > yRange) {
    maxY += diff;
  } else {
    maxX += diff;
  }

  return [minX, minY, maxX, maxY];
}

interface CartesianPlaneProps {
  size: number;
  margin: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  step: number;
}

function CartesianPlane({
  size = 500,
  margin = 50,
  minX = -10,
  maxX = 10,
  minY = -10,
  maxY = 10,
  step = 1,
}: Partial<CartesianPlaneProps>) {
  // Squaring the plane
  [, , maxX, maxY] = adjustSquareValue(minX, maxX, minY, maxY);
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const diff = Math.abs(xRange - yRange);
  if (xRange > yRange) {
    maxY += diff;
  } else {
    maxX += diff;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const planeSize = size - margin * 2;

    ctx.reset();

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;

    const xRange = maxX - minX;
    const yRange = maxY - minY;

    // Vertical grid lines (constant X)
    for (let x = Math.ceil(minX / step) * step; x <= maxX; x += step) {
      const px = margin + ((x - minX) / xRange) * planeSize;
      ctx.beginPath();
      ctx.moveTo(px, margin);
      ctx.lineTo(px, margin + planeSize);
      ctx.stroke();
    }

    // Horizontal grid lines (constant Y)
    for (let y = Math.ceil(minY / step) * step; y <= maxY; y += step) {
      const py = margin + planeSize - ((y - minY) / yRange) * planeSize;
      ctx.beginPath();
      ctx.moveTo(margin, py);
      ctx.lineTo(margin + planeSize, py);
      ctx.stroke();
    }

    // Draw axes (x=0 and y=0) with ticks and labels
    ctx.save();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Arrow length for axes
    const arrowLength = 15;

    // y axis (x=0)
    if (minX <= 0 && maxX >= 0) {
      const x0 = margin + ((0 - minX) / xRange) * planeSize;
      // Draw y axis line only inside the plane
      ctx.beginPath();
      ctx.moveTo(x0, margin);
      ctx.lineTo(x0, margin + planeSize);
      ctx.stroke();

      // Draw ticks and labels on y axis
      for (let y = Math.ceil(minY / step) * step; y <= maxY; y += step) {
        // Hide edge ticks/labels
        if (y === minY || y === maxY) continue;
        const py = margin + planeSize - ((y - minY) / yRange) * planeSize;
        ctx.beginPath();
        ctx.moveTo(x0 - 5, py);
        ctx.lineTo(x0 + 5, py);
        ctx.stroke();
        if (Math.abs(y) > 1e-8) {
          // skip label at 0, will be on x axis
          ctx.textAlign =
            x0 - 30 < margin
              ? 'left'
              : x0 + 30 > size - margin
                ? 'right'
                : 'right';
          ctx.fillText(y.toString(), x0 - 15, py);
        }
      }

      // Draw y axis arrows outside the plane
      // Top arrow (up)
      if (margin - arrowLength >= 0) {
        ctx.beginPath();
        ctx.moveTo(x0, margin - arrowLength); // tip
        ctx.lineTo(x0 - 7, margin);
        ctx.lineTo(x0 + 7, margin);
        ctx.closePath();
        ctx.fill();
      }
      // Bottom arrow (down)
      if (margin + planeSize + arrowLength <= size) {
        ctx.beginPath();
        ctx.moveTo(x0, margin + planeSize + arrowLength); // tip
        ctx.lineTo(x0 - 7, margin + planeSize);
        ctx.lineTo(x0 + 7, margin + planeSize);
        ctx.closePath();
        ctx.fill();
      }
    }

    // x axis (y=0)
    if (minY <= 0 && maxY >= 0) {
      const y0 = margin + planeSize - ((0 - minY) / yRange) * planeSize;
      // Draw x axis line only inside the plane
      ctx.beginPath();
      ctx.moveTo(margin, y0);
      ctx.lineTo(margin + planeSize, y0);
      ctx.stroke();

      // Draw ticks and labels on x axis
      for (let x = Math.ceil(minX / step) * step; x <= maxX; x += step) {
        // Hide edge ticks/labels
        if (x === minX || x === maxX) continue;
        const px = margin + ((x - minX) / xRange) * planeSize;
        ctx.beginPath();
        ctx.moveTo(px, y0 - 5);
        ctx.lineTo(px, y0 + 5);
        ctx.stroke();
        if (Math.abs(x) > 1e-8) {
          // skip label at 0, will be on y axis
          ctx.textAlign =
            px - 30 < margin
              ? 'left'
              : px + 30 > size - margin
                ? 'right'
                : 'center';
          ctx.fillText(x.toString(), px, y0 + 15);
        }
      }

      // Draw x axis arrows outside the plane
      // Left arrow
      if (margin - arrowLength >= 0) {
        ctx.beginPath();
        ctx.moveTo(margin - arrowLength, y0); // tip
        ctx.lineTo(margin, y0 - 7);
        ctx.lineTo(margin, y0 + 7);
        ctx.closePath();
        ctx.fill();
      }
      // Right arrow
      if (margin + planeSize + arrowLength <= size) {
        ctx.beginPath();
        ctx.moveTo(margin + planeSize + arrowLength, y0); // tip
        ctx.lineTo(margin + planeSize, y0 - 7);
        ctx.lineTo(margin + planeSize, y0 + 7);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }, [size, margin, maxX, minX, maxY, minY, step]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}

export default CartesianPlane;
