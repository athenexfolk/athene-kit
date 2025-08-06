import type { RefObject } from 'react';
import type { Point } from './point';

export function getMousePos(
  e: React.MouseEvent,
  canvasRef: RefObject<HTMLCanvasElement | null>,
): Point {
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
