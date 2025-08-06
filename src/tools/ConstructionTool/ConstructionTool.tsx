import { useEffect, useRef, useState, useReducer } from 'react';
import { getMousePos } from './utils';
import type { Point } from './point';
import {
  getRulerOrigin,
  getRulerRotatorOrigin,
  INITIAL_RULER_STATE,
  isPointInRuler,
  isPointInRulerDrawer,
  isPointInRulerRotator,
  ROTATE_ROTATOR_THRESHOLD,
  RULER_DRAWER_THRESHOLD,
  rulerReducer,
  toRulerLocal,
} from './ruler';
import type { Ruler, RulerState } from './ruler';
import {
  INITIAL_COMPASS_STATE,
  compassReducer,
  getCompassPencil,
  getCompassLeg,
  COMPASS_PIN_RADIUS,
  COMPASS_PENCIL_RADIUS,
  COMPASS_LEG_RADIUS,
  isPointInCompassPin,
  isPointInCompassPencil,
  isPointInCompassLeg,
} from './compass';

import type { CompassState } from './compass';

type ConstructionToolProps = {
  width?: number;
  height?: number;
  dpr?: number;
};

export default function ConstructionTool({
  width = 600,
  height = 400,
  dpr,
}: ConstructionToolProps) {
  // --- State and refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolCanvasRef = useRef<HTMLCanvasElement>(null);
  const DPR =
    dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const CANVAS_WIDTH = width;
  const CANVAS_HEIGHT = height;
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<Point | null>(null);
  const [activeTool, setActiveTool] = useState<'pen' | 'ruler' | 'compass'>(
    'pen',
  );
  const [rulerState, dispatchRuler] = useReducer(
    rulerReducer,
    INITIAL_RULER_STATE,
  );
  const [compassState, dispatchCompass] = useReducer(
    compassReducer,
    INITIAL_COMPASS_STATE,
  );

  // --- Helpers ---
  const drawLine = (from: Point, to: Point) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  // --- DPR adaptation for both canvases ---
  useEffect(() => {
    const adaptCanvas = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      // Set actual pixel size
      canvas.width = CANVAS_WIDTH * DPR;
      canvas.height = CANVAS_HEIGHT * DPR;
      // Set CSS size
      canvas.style.width = `${CANVAS_WIDTH}px`;
      canvas.style.height = `${CANVAS_HEIGHT}px`;
      // Scale context
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
        ctx.scale(DPR, DPR);
      }
    };
    adaptCanvas(canvasRef.current);
    adaptCanvas(toolCanvasRef.current);
  }, [DPR, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Draw the compass and its handles on the tool canvas
  const drawCompass = (
    ctx: CanvasRenderingContext2D,
    compassState: CompassState,
    activeTool: 'pen' | 'ruler' | 'compass',
  ) => {
    if (activeTool !== 'compass') return;
    const { compass, draggingPin, draggingPencil, draggingLeg } = compassState;
    // Draw line from pin to pencil
    const pin = compass.pin;
    const pencil = getCompassPencil(compass);
    const leg = getCompassLeg(compass);
    ctx.save();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pin.x, pin.y);
    ctx.lineTo(pencil.x, pencil.y);
    ctx.lineTo(leg.x, leg.y);
    ctx.stroke();
    ctx.restore();
    // Draw pin point
    ctx.save();
    ctx.globalAlpha = draggingPin ? 0.7 : 1;
    ctx.fillStyle = draggingPin ? '#FFEB3B' : '#0074D9';
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, COMPASS_PIN_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.restore();
    // Draw pencil
    ctx.save();
    ctx.globalAlpha = draggingPencil ? 0.7 : 1;
    ctx.fillStyle = draggingPencil ? '#FF4136' : '#FFDC00';
    ctx.beginPath();
    ctx.arc(pencil.x, pencil.y, COMPASS_PENCIL_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.restore();
    // Draw leg
    ctx.save();
    ctx.globalAlpha = draggingLeg ? 0.7 : 1;
    ctx.fillStyle = draggingLeg ? '#00B16A' : '#00B16A';
    ctx.beginPath();
    ctx.arc(leg.x, leg.y, COMPASS_LEG_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.restore();
  };

  const drawRuler = (
    ctx: CanvasRenderingContext2D,
    rulerState: RulerState,
    activeTool: 'pen' | 'ruler' | 'compass',
  ) => {
    if (activeTool !== 'ruler') return;
    ctx.strokeStyle = '#0074D9';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = rulerState.draggingRuler ? '#FFEB3B' : '#0074D9'; // yellow when dragging, blue otherwise
    // Draw rotated ruler
    ctx.save();
    ctx.translate(
      rulerState.ruler.x + rulerState.ruler.width / 2,
      rulerState.ruler.y + rulerState.ruler.height / 2,
    );
    ctx.rotate(rulerState.ruler.angle);
    ctx.fillRect(
      -rulerState.ruler.width / 2,
      -rulerState.ruler.height / 2,
      rulerState.ruler.width,
      rulerState.ruler.height,
    );
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#0074D9';
    ctx.fillRect(
      -rulerState.ruler.width / 2,
      -rulerState.ruler.height / 2 - RULER_DRAWER_THRESHOLD,
      rulerState.ruler.width,
      RULER_DRAWER_THRESHOLD,
    );
    ctx.fillRect(
      -rulerState.ruler.width / 2,
      rulerState.ruler.height / 2,
      rulerState.ruler.width,
      RULER_DRAWER_THRESHOLD,
    );
    ctx.globalAlpha = 1;
    ctx.restore();

    // Draw rotation handle
    const handle = getRulerRotatorOrigin(rulerState.ruler);
    ctx.save();
    // Draw square handle instead of circle
    ctx.fillStyle = rulerState.rotatingRuler ? '#FF4136' : '#FFDC00';
    ctx.globalAlpha = 0.9;
    ctx.translate(handle.x, handle.y);
    ctx.rotate(rulerState.ruler.angle); // align with ruler
    // Draw square centered at (0,0)
    ctx.fillRect(
      -ROTATE_ROTATOR_THRESHOLD,
      -ROTATE_ROTATOR_THRESHOLD,
      ROTATE_ROTATOR_THRESHOLD * 2,
      ROTATE_ROTATOR_THRESHOLD * 2,
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#888';
    ctx.globalAlpha = 1;
    ctx.strokeRect(
      -ROTATE_ROTATOR_THRESHOLD,
      -ROTATE_ROTATOR_THRESHOLD,
      ROTATE_ROTATOR_THRESHOLD * 2,
      ROTATE_ROTATOR_THRESHOLD * 2,
    );
    ctx.restore();
  };

  // Helper to reset ruler manipulation state
  const resetRulerManipulation = () => {
    dispatchRuler({ type: 'setDraggingRuler', draggingRuler: false });
    dispatchRuler({ type: 'setDragOffset', dragOffset: null });
    dispatchRuler({ type: 'setLinearMode', linearMode: null });
    dispatchRuler({ type: 'resetManipulation' });
  };

  // --- Ruler interaction handlers ---
  const handleRulerRotator = (pos: Point, ruler: Ruler) => {
    // Start rotating ruler
    const { x: cx, y: cy } = getRulerOrigin(ruler);
    const mouseAngle = Math.atan2(pos.y - cy, pos.x - cx);
    dispatchRuler({ type: 'setRotatingRuler', rotatingRuler: true });
    dispatchRuler({
      type: 'setRotateStart',
      rotateStart: { angle0: ruler.angle, mouseAngle0: mouseAngle },
    });
  };

  const handleRulerDrag = (pos: Point, ruler: Ruler) => {
    // Start dragging ruler
    dispatchRuler({ type: 'setDraggingRuler', draggingRuler: true });
    dispatchRuler({
      type: 'setDragOffset',
      dragOffset: { x: pos.x - ruler.x, y: pos.y - ruler.y },
    });
  };

  const handleRulerDrawer = (pos: Point, ruler: Ruler) => {
    // Start linear mode aligned with ruler
    const local = toRulerLocal(pos.x, pos.y, ruler);
    const { x: cx, y: cy } = getRulerOrigin(ruler);
    // Snap to nearest edge (top or bottom in local coordinates)
    const edgeY = local.y < ruler.height / 2 ? 0 : ruler.height;
    // Convert edge point back to global coordinates
    const edgeDx = local.x - ruler.width / 2;
    const edgeDy = edgeY - ruler.height / 2;
    const globalX =
      cx + edgeDx * Math.cos(ruler.angle) - edgeDy * Math.sin(ruler.angle);
    const globalY =
      cy + edgeDx * Math.sin(ruler.angle) + edgeDy * Math.cos(ruler.angle);

    const anchor = { x: globalX, y: globalY };
    const dir = { x: Math.cos(ruler.angle), y: Math.sin(ruler.angle) };

    // Calculate anchor's offset from center along the ruler axis
    const anchorOffset = local.x - ruler.width / 2;
    // The min and max t relative to anchor, so that drawing stays within ruler
    const tMin = -anchorOffset - ruler.width / 2;
    const tMax = -anchorOffset + ruler.width / 2;

    dispatchRuler({
      type: 'setLinearMode',
      linearMode: { anchor, dir, tMin, tMax },
    });
    setDrawing(true);
    // Clamp t to allowed range
    const t = (pos.x - anchor.x) * dir.x + (pos.y - anchor.y) * dir.y;
    const tClamped = Math.max(tMin, Math.min(t, tMax));
    setLastPos({
      x: anchor.x + tClamped * dir.x,
      y: anchor.y + tClamped * dir.y,
    });
  };

  // --- Compass interaction handlers ---
  const handleCompassPin = (pos: Point, compass = compassState.compass) => {
    dispatchCompass({ type: 'setDraggingPin', draggingPin: true });
    dispatchCompass({
      type: 'setDragOffset',
      dragOffset: { x: pos.x - compass.pin.x, y: pos.y - compass.pin.y },
    });
  };
  const handleCompassPencil = (pos: Point, compass = compassState.compass) => {
    // Start rotating (draw arc)
    const { x, y } = compass.pin;
    const mouseAngle = Math.atan2(pos.y - y, pos.x - x);
    dispatchCompass({ type: 'setDraggingPencil', draggingPencil: true });
    dispatchCompass({
      type: 'setRotateStart',
      rotateStart: { angle0: compass.angle, mouseAngle0: mouseAngle },
    });
  };
  const handleCompassLeg = (pos: Point, compass = compassState.compass) => {
    // Start adjusting radius and angle
    const { x, y } = compass.pin;
    const mouseDist = Math.hypot(pos.x - x, pos.y - y);
    const mouseAngle = Math.atan2(pos.y - y, pos.x - x);
    dispatchCompass({ type: 'setDraggingLeg', draggingLeg: true });
    dispatchCompass({
      type: 'setAdjustStart',
      adjustStart: {
        radius0: compass.radius,
        mouseDist0: mouseDist,
        angle0: compass.angle,
        mouseAngle0: mouseAngle,
      },
    });
  };

  // Helper to reset compass manipulation state
  const resetCompassManipulation = () => {
    dispatchCompass({ type: 'setDraggingPin', draggingPin: false });
    dispatchCompass({ type: 'setDraggingPencil', draggingPencil: false });
    dispatchCompass({ type: 'setDraggingLeg', draggingLeg: false });
    dispatchCompass({ type: 'setDragOffset', dragOffset: null });
    dispatchCompass({ type: 'setRotateStart', rotateStart: null });
    dispatchCompass({ type: 'setAdjustStart', adjustStart: null });
    dispatchCompass({ type: 'resetManipulation' });
  };
  const handleToolMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e, toolCanvasRef);
    dispatchRuler({ type: 'setLinearMode', linearMode: null });
    if (activeTool === 'ruler') {
      const ruler = rulerState.ruler;
      if (isPointInRulerRotator(pos.x, pos.y, ruler)) {
        handleRulerRotator(pos, ruler);
        return;
      }
      if (isPointInRuler(pos.x, pos.y, ruler)) {
        handleRulerDrag(pos, ruler);
        return;
      }
      if (isPointInRulerDrawer(pos.x, pos.y, ruler)) {
        handleRulerDrawer(pos, ruler);
        return;
      }
      setDrawing(true);
      setLastPos(pos);
      return;
    } else if (activeTool === 'compass') {
      const compass = compassState.compass;
      if (isPointInCompassPin(pos.x, pos.y, compass)) {
        handleCompassPin(pos, compass);
        return;
      }
      if (isPointInCompassPencil(pos.x, pos.y, compass)) {
        handleCompassPencil(pos, compass);
        setDrawing(true);
        // Set lastPos to a point on the leg's circle at the current pencil angle
        const pin = compass.pin;
        const leg = getCompassLeg(compass);
        const legRadius = Math.hypot(leg.x - pin.x, leg.y - pin.y);
        const pencilAngle = Math.atan2(
          getCompassPencil(compass).y - pin.y,
          getCompassPencil(compass).x - pin.x,
        );
        setLastPos({
          x: pin.x + legRadius * Math.cos(pencilAngle),
          y: pin.y + legRadius * Math.sin(pencilAngle),
        });
        return;
      }
      if (isPointInCompassLeg(pos.x, pos.y, compass)) {
        handleCompassLeg(pos, compass);
        return;
      }
      // If not on any handle, treat as pen (draw)
      setDrawing(true);
      setLastPos(pos);
      return;
    }
    setDrawing(true);
    setLastPos(pos);
  };

  const handleToolMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e, toolCanvasRef);
    if (activeTool === 'ruler') {
      const ruler = rulerState.ruler;
      if (rulerState.rotatingRuler && rulerState.rotateStart) {
        const cx = ruler.x + ruler.width / 2;
        const cy = ruler.y + ruler.height / 2;
        const mouseAngle2 = Math.atan2(pos.y - cy, pos.x - cx);
        dispatchRuler({
          type: 'setRuler',
          ruler: {
            ...ruler,
            angle:
              rulerState.rotateStart.angle0 +
              (mouseAngle2 - rulerState.rotateStart.mouseAngle0),
          },
        });
        return;
      }
      if (rulerState.draggingRuler && rulerState.dragOffset) {
        dispatchRuler({
          type: 'setRuler',
          ruler: {
            ...ruler,
            x: pos.x - rulerState.dragOffset.x,
            y: pos.y - rulerState.dragOffset.y,
          },
        });
        return;
      }
      if (!rulerState.linearMode) {
        dispatchRuler({
          type: 'setNearRuler',
          nearRuler: isPointInRulerDrawer(pos.x, pos.y, ruler),
        });
      }
      if (!drawing) return;
      let drawPos = pos;
      if (rulerState.linearMode !== null) {
        const { anchor, dir, tMin, tMax } = rulerState.linearMode;
        const t = (pos.x - anchor.x) * dir.x + (pos.y - anchor.y) * dir.y;
        const tClamped = Math.max(tMin, Math.min(t, tMax));
        drawPos = {
          x: anchor.x + tClamped * dir.x,
          y: anchor.y + tClamped * dir.y,
        };
      }
      if (lastPos) {
        drawLine(lastPos, drawPos);
      }
      setLastPos(drawPos);
    } else if (activeTool === 'compass') {
      const compass = compassState.compass;
      // Drag pin
      if (compassState.draggingPin && compassState.dragOffset) {
        dispatchCompass({
          type: 'setCompass',
          compass: {
            ...compass,
            pin: {
              x: pos.x - compassState.dragOffset.x,
              y: pos.y - compassState.dragOffset.y,
            },
          },
        });
        return;
      }
      // Rotate pencil
      if (compassState.draggingPencil && compassState.rotateStart) {
        const { x, y } = compass.pin;
        const mouseAngle2 = Math.atan2(pos.y - y, pos.x - x);
        const newAngle =
          compassState.rotateStart.angle0 +
          (mouseAngle2 - compassState.rotateStart.mouseAngle0);
        dispatchCompass({
          type: 'setCompass',
          compass: {
            ...compass,
            angle: newAngle,
          },
        });
        // Draw arc by interpolating points between lastPos and current angle, always on leg's circle
        if (drawing && lastPos) {
          const pin = compass.pin;
          const leg = getCompassLeg(compass);
          const legRadius = Math.hypot(leg.x - pin.x, leg.y - pin.y);
          const lastAngle = Math.atan2(lastPos.y - pin.y, lastPos.x - pin.x);
          let startAngle = lastAngle;
          let endAngle = newAngle;
          // Ensure shortest direction
          if (Math.abs(endAngle - startAngle) > Math.PI) {
            if (endAngle > startAngle) {
              startAngle += 2 * Math.PI;
            } else {
              endAngle += 2 * Math.PI;
            }
          }
          const steps = Math.max(
            4,
            Math.ceil(Math.abs(endAngle - startAngle) / (Math.PI / 32)),
          );
          let prev = lastPos;
          for (let i = 1; i <= steps; ++i) {
            const t = i / steps;
            const theta = startAngle + (endAngle - startAngle) * t;
            const next = {
              x: pin.x + legRadius * Math.cos(theta),
              y: pin.y + legRadius * Math.sin(theta),
            };
            drawLine(prev, next);
            prev = next;
          }
        }
        // Set lastPos to the new point on the leg's circle at the new angle
        const pin = compass.pin;
        const leg = getCompassLeg(compass);
        const legRadius = Math.hypot(leg.x - pin.x, leg.y - pin.y);
        setLastPos({
          x: pin.x + legRadius * Math.cos(newAngle),
          y: pin.y + legRadius * Math.sin(newAngle),
        });
        return;
      }
      // Adjust leg (radius)
      if (compassState.draggingLeg && compassState.adjustStart) {
        const { x, y } = compass.pin;
        const mouseDist = Math.hypot(pos.x - x, pos.y - y);
        const mouseAngle = Math.atan2(pos.y - y, pos.x - x);
        // If adjustStart has angle0/mouseAngle0, use them, else fallback to old behavior
        const adjustStart = compassState.adjustStart;
        let newAngle = compass.angle;
        if (
          adjustStart.angle0 !== undefined &&
          adjustStart.mouseAngle0 !== undefined
        ) {
          newAngle =
            adjustStart.angle0 + (mouseAngle - adjustStart.mouseAngle0);
        } else {
          newAngle = mouseAngle;
        }
        const newRadius = Math.max(
          10,
          adjustStart.radius0 + (mouseDist - adjustStart.mouseDist0),
        );
        dispatchCompass({
          type: 'setCompass',
          compass: {
            ...compass,
            radius: newRadius,
            angle: newAngle,
          },
        });
        return;
      }
      // Drawing with compass (free draw, not on handle)
      if (!drawing) return;
      if (lastPos) {
        drawLine(lastPos, pos);
      }
      setLastPos(pos);
    } else {
      if (!drawing) return;
      if (lastPos) {
        drawLine(lastPos, pos);
      }
      setLastPos(pos);
    }
  };

  const handleToolMouseUp = () => {
    setDrawing(false);
    setLastPos(null);
    resetRulerManipulation();
    resetCompassManipulation();
  };

  const handleToolMouseLeave = () => {
    // For compass pencil rotation, do not stop drawing or reset lastPos on mouse leave
    if (activeTool === 'compass' && compassState.draggingPencil) {
      // Do nothing, allow arc drawing to continue
      return;
    }
    if (drawing) {
      setLastPos(null);
    }
    dispatchRuler({ type: 'setDraggingRuler', draggingRuler: false });
    dispatchRuler({ type: 'setDragOffset', dragOffset: null });
    resetCompassManipulation();
  };

  useEffect(() => {
    const canvas = toolCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Clear in device pixels, but drawing is in CSS pixels
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    drawRuler(ctx, rulerState, activeTool);
    drawCompass(ctx, compassState, activeTool);
    ctx.restore();
  }, [activeTool, rulerState, compassState, DPR, CANVAS_WIDTH, CANVAS_HEIGHT]);

  return (
    <>
      <div className="mx-auto flex justify-center items-center gap-2 p-2">
        <button
          onClick={() => setActiveTool('pen')}
          style={{ fontWeight: activeTool === 'pen' ? 'bold' : undefined }}
        >
          Pen
        </button>
        <button
          onClick={() => {
            setActiveTool('ruler');
            dispatchRuler({ type: 'setLinearMode', linearMode: null });
            dispatchRuler({ type: 'setNearRuler', nearRuler: false });
          }}
          style={{
            fontWeight: activeTool === 'ruler' ? 'bold' : undefined,
            marginLeft: 8,
          }}
        >
          Ruler
        </button>
        <button
          onClick={() => setActiveTool('compass')}
          style={{
            fontWeight: activeTool === 'compass' ? 'bold' : undefined,
            marginLeft: 8,
          }}
        >
          Compass
        </button>
      </div>
      <div
        className="relative mx-auto"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="pointer-events-none absolute top-0 left-0 z-1 touch-none rounded-xl bg-white shadow-lg"
          style={{
            cursor: rulerState.nearRuler ? 'pointer' : 'crosshair',
          }}
        />
        <canvas
          ref={toolCanvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="pointer-events-auto absolute top-0 left-0 z-2"
          onMouseDown={handleToolMouseDown}
          onMouseUp={handleToolMouseUp}
          onMouseLeave={handleToolMouseLeave}
          onMouseMove={handleToolMouseMove}
        />
      </div>
    </>
  );
}
