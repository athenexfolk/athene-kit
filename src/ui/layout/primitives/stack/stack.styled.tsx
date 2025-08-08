import styled from 'styled-components';
import {
  breakpoints,
  responsiveSpace,
  type ResponsiveValue,
} from '../../utilities';

interface StyledStackProps {
  $direction?: ResponsiveValue | 'vertical' | 'horizontal';
  $gap?: ResponsiveValue;
}

export const StyledStack = styled.div<StyledStackProps>`
  display: flex;
  ${({ $direction }) => {
    if (!$direction) return '';
    if (typeof $direction === 'string') {
      if ($direction === 'horizontal') return 'flex-direction: row;';
      if ($direction === 'vertical') return 'flex-direction: column;';
      return `flex-direction: ${$direction};`;
    }
    return Object.entries($direction)
      .map(([key, value]) => {
        let dir = value;
        if (dir === 'horizontal') dir = 'row';
        if (dir === 'vertical') dir = 'column';
        return key === 'xs'
          ? `flex-direction: ${dir};`
          : `@media (min-width: ${breakpoints[key as keyof typeof breakpoints]}px) { flex-direction: ${dir}; }`;
      })
      .join('\n');
  }}
  ${({ $gap }) => $gap && responsiveSpace($gap, 'gap')}
`;
