import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import { getTickPositions, drawArrow, drawTicksAndLabels } from './utils/canvasUtils';

interface NumberLineProps {
  min: number;
  max: number;
  size: number;
  margin: number;
  step: number;
  lineColor: string;
  lineWidth: number;
  tickSize: number;
  arrowHeadSize: number;
  axisExtension: number;
  showArrows: boolean;
  onDraw?: (ctx: CanvasRenderingContext2D, props: NumberLineProps) => void;
}

const defaultProps: NumberLineProps = {
  min: -10,
  max: 10,
  step: 1,
  size: 800,
  margin: 50,
  lineColor: '#222',
  lineWidth: 2,
  tickSize: 5,
  arrowHeadSize: 10,
  axisExtension: 20,
  showArrows: true,
};

const NumberLine = forwardRef<HTMLCanvasElement, Partial<NumberLineProps>>(
  function NumberLine(passProps, ref) {
    const props = useMemo(
      () => ({ ...defaultProps, ...passProps }),
      [passProps],
    );

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
      canvas.height = (props.margin * 2 + props.tickSize * 3) * dpr;
      canvas.style.width = `${props.size}px`;
      canvas.style.height = `${props.margin * 2 + props.tickSize * 3}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.reset();
      ctx.save();
      ctx.scale(dpr, dpr);
      drawNumberLine(ctx, props);
      if (props.onDraw) {
        props.onDraw(ctx, props);
      }
      ctx.restore();
    }, [props]);

    return <canvas ref={canvasRef} aria-label="Number line" role="img" />;
  },
);

export default NumberLine;

function drawNumberLine(ctx: CanvasRenderingContext2D, props: NumberLineProps) {
  const {
    min,
    max,
    size,
    margin,
    step,
    lineColor,
    lineWidth,
    tickSize,
    arrowHeadSize,
    axisExtension,
    showArrows,
  } = props;

  const y = margin + tickSize;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(size - margin, y);
  ctx.stroke();

  if (showArrows) {
    // Left arrow
    drawArrow(ctx, margin, y, margin - axisExtension, y, arrowHeadSize);
    // Right arrow
    drawArrow(
      ctx,
      size - margin,
      y,
      size - margin + axisExtension,
      y,
      arrowHeadSize,
    );
  }

  // Draw ticks and labels
  const x0 = margin;
  const x1 = size - margin;
  const range = max - min;
  const ticks = getTickPositions(min, max, step);
  drawTicksAndLabels(
    ctx,
    ticks,
    (val) => {
      const x = x0 + ((val - min) / range) * (x1 - x0);
      return [x, y - tickSize, x, y + tickSize];
    },
    (val) => [x0 + ((val - min) / range) * (x1 - x0), y + tickSize + 4],
    (val) => val.toString(),
    'center',
    'top',
    true,
  );
}
