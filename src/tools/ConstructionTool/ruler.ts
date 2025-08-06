import type { Point } from './point';

export type Ruler = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
};

export type RulerLinearMode = {
  anchor: Point;
  dir: Point;
  tMin: number;
  tMax: number;
} | null;

export type RulerState = {
  ruler: Ruler;
  nearRuler: boolean;
  draggingRuler: boolean;
  dragOffset: Point | null;
  rotatingRuler: boolean;
  rotateStart: { angle0: number; mouseAngle0: number } | null;
  linearMode: RulerLinearMode;
};

export type RulerAction =
  | { type: 'setRuler'; ruler: Ruler }
  | { type: 'setNearRuler'; nearRuler: boolean }
  | { type: 'setDraggingRuler'; draggingRuler: boolean }
  | { type: 'setDragOffset'; dragOffset: Point | null }
  | { type: 'setRotatingRuler'; rotatingRuler: boolean }
  | {
      type: 'setRotateStart';
      rotateStart: { angle0: number; mouseAngle0: number } | null;
    }
  | { type: 'setLinearMode'; linearMode: RulerLinearMode }
  | { type: 'resetManipulation' };

export function rulerReducer(
  state: RulerState,
  action: RulerAction,
): RulerState {
  switch (action.type) {
    case 'setRuler':
      return { ...state, ruler: action.ruler };
    case 'setNearRuler':
      return { ...state, nearRuler: action.nearRuler };
    case 'setDraggingRuler':
      return { ...state, draggingRuler: action.draggingRuler };
    case 'setDragOffset':
      return { ...state, dragOffset: action.dragOffset };
    case 'setRotatingRuler':
      return { ...state, rotatingRuler: action.rotatingRuler };
    case 'setRotateStart':
      return { ...state, rotateStart: action.rotateStart };
    case 'setLinearMode':
      return { ...state, linearMode: action.linearMode };
    case 'resetManipulation':
      return {
        ...state,
        draggingRuler: false,
        dragOffset: null,
        rotatingRuler: false,
        rotateStart: null,
        linearMode: null,
      };
    default:
      return state;
  }
}

export const INITIAL_RULER: Ruler = {
  x: 100,
  y: 100,
  width: 400,
  height: 40,
  angle: 0,
};

export const INITIAL_RULER_STATE: RulerState = {
  ruler: INITIAL_RULER,
  nearRuler: false,
  draggingRuler: false,
  dragOffset: null,
  rotatingRuler: false,
  rotateStart: null,
  linearMode: null,
};

export const RULER_DRAWER_THRESHOLD = 16;
export const ROTATE_ROTATOR_THRESHOLD = 12;

export function toRulerLocal(x: number, y: number, ruler: Ruler) {
  const cx = ruler.x + ruler.width / 2;
  const cy = ruler.y + ruler.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const cos = Math.cos(-ruler.angle);
  const sin = Math.sin(-ruler.angle);
  return {
    x: dx * cos - dy * sin + ruler.width / 2,
    y: dx * sin + dy * cos + ruler.height / 2,
  };
}

export function getRulerOrigin(ruler: Ruler) {
  return {
    x: ruler.x + ruler.width / 2,
    y: ruler.y + ruler.height / 2,
  };
}

export function getRulerRotatorOrigin(ruler: Ruler) {
  const { x, y } = getRulerOrigin(ruler);
  return { x, y };
}

export function isPointInRuler(x: number, y: number, ruler: Ruler) {
  const local = toRulerLocal(x, y, ruler);
  return (
    local.x >= 0 &&
    local.x <= ruler.width &&
    local.y >= 0 &&
    local.y <= ruler.height
  );
}

export function isPointInRulerRotator(x: number, y: number, ruler: Ruler) {
  const local = toRulerLocal(x, y, ruler);
  return (
    local.x >= ruler.width / 2 - ROTATE_ROTATOR_THRESHOLD &&
    local.x <= ruler.width / 2 + ROTATE_ROTATOR_THRESHOLD &&
    local.y >= ruler.height / 2 - ROTATE_ROTATOR_THRESHOLD &&
    local.y <= ruler.height / 2 + ROTATE_ROTATOR_THRESHOLD
  );
}

export function isPointInRulerDrawer(x: number, y: number, ruler: Ruler) {
  const local = toRulerLocal(x, y, ruler);
  const nearAbove = local.y >= -RULER_DRAWER_THRESHOLD && local.y < 0;
  const nearBelow =
    local.y > ruler.height && local.y <= ruler.height + RULER_DRAWER_THRESHOLD;
  const inWidth = local.x >= 0 && local.x <= ruler.width;
  return inWidth && (nearAbove || nearBelow);
}
