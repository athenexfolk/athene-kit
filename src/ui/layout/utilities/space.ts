// Spacing utility for consistent spacing in layout components
// Usage: space(2) => '8px', space(3.5) => '14px', space(0) => '0px', space(1) => '4px'

export function space(multiplier: number = 1, unit: string = 'px') {
  return `${multiplier * 4}${unit}`;
}
