export const breakpoints = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function breakpoint(key: keyof typeof breakpoints) {
  return `@media (min-width: ${breakpoints[key]}px)`;
}
