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

export default function ConstructionTool() {
  // --- State and refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolCanvasRef = useRef<HTMLCanvasElement>(null);
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
    ctx.lineWidth = 3;
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
    // Start adjusting radius
    const { x, y } = compass.pin;
    const mouseDist = Math.hypot(pos.x - x, pos.y - y);
    dispatchCompass({ type: 'setDraggingLeg', draggingLeg: true });
    dispatchCompass({
      type: 'setAdjustStart',
      adjustStart: { radius0: compass.radius, mouseDist0: mouseDist },
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
        setLastPos(pos);
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
        dispatchCompass({
          type: 'setCompass',
          compass: {
            ...compass,
            angle:
              compassState.rotateStart.angle0 +
              (mouseAngle2 - compassState.rotateStart.mouseAngle0),
          },
        });
        // Optionally: draw arc here if drawing
        if (drawing && lastPos) {
          // Draw arc segment from lastPos to current
          drawLine(
            lastPos,
            getCompassPencil({
              ...compass,
              angle:
                compassState.rotateStart.angle0 +
                (mouseAngle2 - compassState.rotateStart.mouseAngle0),
            }),
          );
        }
        setLastPos(
          getCompassPencil({
            ...compass,
            angle:
              compassState.rotateStart.angle0 +
              (mouseAngle2 - compassState.rotateStart.mouseAngle0),
          }),
        );
        return;
      }
      // Adjust leg (radius)
      if (compassState.draggingLeg && compassState.adjustStart) {
        const { x, y } = compass.pin;
        const mouseDist = Math.hypot(pos.x - x, pos.y - y);
        const newRadius = Math.max(
          10,
          compassState.adjustStart.radius0 +
            (mouseDist - compassState.adjustStart.mouseDist0),
        );
        dispatchCompass({
          type: 'setCompass',
          compass: {
            ...compass,
            radius: newRadius,
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    drawRuler(ctx, rulerState, activeTool);
    drawCompass(ctx, compassState, activeTool);
    ctx.restore();
  }, [activeTool, rulerState, compassState]);

  return (
    <>
      <div style={{ marginBottom: 8 }}>
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
        style={{
          position: 'relative',
          width: 600,
          height: 400,
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            border: '1px solid #ccc',
            background: '#eee',
            borderRadius: 8,
            boxShadow: '0 2px 8px #0001',
            cursor: rulerState.nearRuler ? 'pointer' : 'crosshair',
            touchAction: 'none',
            pointerEvents: 'none',
          }}
        />
        <canvas
          ref={toolCanvasRef}
          width={600}
          height={400}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 2,
            pointerEvents: 'auto',
          }}
          onMouseDown={handleToolMouseDown}
          onMouseUp={handleToolMouseUp}
          onMouseLeave={handleToolMouseLeave}
          onMouseMove={handleToolMouseMove}
        />
      </div>
    </>
  );
}
