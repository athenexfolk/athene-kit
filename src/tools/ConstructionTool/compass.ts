import type { Point } from './point';

// --- Types ---
export type Compass = {
  pin: Point;      // Center of arc (pin point)
  radius: number;  // Distance from pin to pencil/leg
  angle: number;   // Angle (radians) from pin to pencil
  legOffset: number; // Offset for leg handle (relative to pin, along the line)
};

export type CompassState = {
  compass: Compass;
  draggingPin: boolean;
  draggingPencil: boolean;
  draggingLeg: boolean;
  dragOffset: Point | null;
  rotateStart: { angle0: number; mouseAngle0: number } | null;
  adjustStart: { radius0: number; mouseDist0: number } | null;
};

export type CompassAction =
  | { type: 'setCompass'; compass: Compass }
  | { type: 'setDraggingPin'; draggingPin: boolean }
  | { type: 'setDraggingPencil'; draggingPencil: boolean }
  | { type: 'setDraggingLeg'; draggingLeg: boolean }
  | { type: 'setDragOffset'; dragOffset: Point | null }
  | { type: 'setRotateStart'; rotateStart: { angle0: number; mouseAngle0: number } | null }
  | { type: 'setAdjustStart'; adjustStart: { radius0: number; mouseDist0: number } | null }
  | { type: 'resetManipulation' };

export function compassReducer(
  state: CompassState,
  action: CompassAction,
): CompassState {
  switch (action.type) {
    case 'setCompass':
      return { ...state, compass: action.compass };
    case 'setDraggingPin':
      return { ...state, draggingPin: action.draggingPin };
    case 'setDraggingPencil':
      return { ...state, draggingPencil: action.draggingPencil };
    case 'setDraggingLeg':
      return { ...state, draggingLeg: action.draggingLeg };
    case 'setDragOffset':
      return { ...state, dragOffset: action.dragOffset };
    case 'setRotateStart':
      return { ...state, rotateStart: action.rotateStart };
    case 'setAdjustStart':
      return { ...state, adjustStart: action.adjustStart };
    case 'resetManipulation':
      return {
        ...state,
        draggingPin: false,
        draggingPencil: false,
        draggingLeg: false,
        dragOffset: null,
        rotateStart: null,
        adjustStart: null,
      };
    default:
      return state;
  }
}

export const INITIAL_COMPASS: Compass = {
  pin: { x: 200, y: 200 },
  radius: 80,
  angle: 0,
  legOffset: 1.2, // Leg is further out than pencil (as a multiplier of radius)
};

export const INITIAL_COMPASS_STATE: CompassState = {
  compass: INITIAL_COMPASS,
  draggingPin: false,
  draggingPencil: false,
  draggingLeg: false,
  dragOffset: null,
  rotateStart: null,
  adjustStart: null,
};

// --- Geometry helpers ---
export const COMPASS_PIN_RADIUS = 16;
export const COMPASS_PENCIL_RADIUS = 16;
export const COMPASS_LEG_RADIUS = 16;

// Get positions of handles
export function getCompassPencil(compass: Compass): Point {
  return {
    x: compass.pin.x + compass.radius * Math.cos(compass.angle),
    y: compass.pin.y + compass.radius * Math.sin(compass.angle),
  };
}
export function getCompassLeg(compass: Compass): Point {
  return {
    x: compass.pin.x + compass.radius * compass.legOffset * Math.cos(compass.angle),
    y: compass.pin.y + compass.radius * compass.legOffset * Math.sin(compass.angle),
  };
}

// Hit test helpers
export function isPointInCompassPin(x: number, y: number, compass: Compass): boolean {
  const dx = x - compass.pin.x;
  const dy = y - compass.pin.y;
  return dx * dx + dy * dy <= COMPASS_PIN_RADIUS * COMPASS_PIN_RADIUS;
}
export function isPointInCompassPencil(x: number, y: number, compass: Compass): boolean {
  const p = getCompassPencil(compass);
  const dx = x - p.x;
  const dy = y - p.y;
  return dx * dx + dy * dy <= COMPASS_PENCIL_RADIUS * COMPASS_PENCIL_RADIUS;
}
export function isPointInCompassLeg(x: number, y: number, compass: Compass): boolean {
  const p = getCompassLeg(compass);
  const dx = x - p.x;
  const dy = y - p.y;
  return dx * dx + dy * dy <= COMPASS_LEG_RADIUS * COMPASS_LEG_RADIUS;
}
