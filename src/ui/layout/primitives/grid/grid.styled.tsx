import styled from 'styled-components';
import {
  breakpoints,
  responsiveSpace,
  type ResponsiveValue,
} from '../../utilities';

interface StyledGridProps {
  $columns?: ResponsiveValue;
  $gap?: ResponsiveValue;
}

export const StyledGrid = styled.div<StyledGridProps>`
  display: grid;
  ${({ $columns }) =>
    $columns &&
    (typeof $columns === 'number'
      ? `grid-template-columns: repeat(${$columns}, 1fr);`
      : Object.entries($columns)
          .map(([key, value]) =>
            key === 'xs'
              ? `grid-template-columns: repeat(${value}, 1fr);`
              : `@media (min-width: ${breakpoints[key as keyof typeof breakpoints]}px) { grid-template-columns: repeat(${value}, 1fr); }`,
          )
          .join('\n'))}
  ${({ $gap }) => $gap && responsiveSpace($gap, 'gap')}
`;
