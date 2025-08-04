import React, { useEffect, useRef, useState } from 'react';
import type { Point } from './point';
// import type { Compass } from './compass';
// import type { Ruler } from './ruler';
// import type { Point } from './point';

// const INITIAL_COMPASS: Compass = {
//   pivot: { x: 350, y: 200 },
//   radius: 80,
//   angle: Math.PI / 2.2,
//   theta: 0,
//   dragging: null,
//   drawingArc: false,
// };

// const INITIAL_RULER: Ruler = {
//   x: 100,
//   y: 100,
//   width: 480,
//   height: 80,
//   angle: 0,
// };

export default function ConstructionTool() {
  // const [compassEnabled, setCompassEnabled] = useState(false);
  // const [compass, setCompass] = useState<Compass | null>(null);

  // const [rulerEnabled, setRulerEnabled] = useState(false);
  // const [ruler, setRuler] = useState<Ruler | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<Point | null>(null);

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
    };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true);

    const pos = getMousePos(e);
    setLastPos(pos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const pos = getMousePos(e);
    if (lastPos) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      setLastPos(pos);
    } else {
      setLastPos(pos);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setDrawing(false);
    setLastPos(null);
  };

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) return;
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   if (!drawing) return;

  //   ctx.beginPath();
  //   ctx.moveTo(, );
  // }, [drawing]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          border: '1px solid #ccc',
          background: '#eee',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        // onTouchStart={handlePointerDown}
        // onTouchMove={handlePointerMove}
        // onTouchEnd={handlePointerUp}
        // onTouchCancel={handlePointerUp}
      />
    </>
  );
}
