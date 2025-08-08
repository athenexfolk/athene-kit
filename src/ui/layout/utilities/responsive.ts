import { css } from 'styled-components';
import { breakpoints } from './breakpoint';
import { space } from './space';

export type ResponsiveValue<T = number> =
  | T
  | { [key in keyof typeof breakpoints]?: T };

export function responsiveSpace(prop: ResponsiveValue, cssProp: string) {
  if (typeof prop === 'number') {
    return css`
      ${() => `${cssProp}: ${space(prop)};`}
    `;
  }
  return Object.entries(prop).map(([key, value]) => {
    if (key === 'xs') {
      return css`
        ${() => `${cssProp}: ${space(value as number)};`}
      `;
    }
    return css`
      @media (min-width: ${breakpoints[key as keyof typeof breakpoints]}px) {
        ${() => `${cssProp}: ${space(value as number)};`}
      }
    `;
  });
}
