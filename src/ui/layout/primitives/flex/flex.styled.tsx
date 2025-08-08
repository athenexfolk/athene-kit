import styled from 'styled-components';
import {
  breakpoints,
  responsiveSpace,
  type ResponsiveValue,
} from '../../utilities';

interface StyledFlexProps {
  $align?: React.CSSProperties['alignItems'];
  $justify?: React.CSSProperties['justifyContent'];
  $wrap?: boolean;
  $gap?: ResponsiveValue;
  $direction?: ResponsiveValue | React.CSSProperties['flexDirection'];
}

export const StyledFlex = styled.div<StyledFlexProps>`
  display: flex;
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
  ${({ $direction }) =>
    $direction &&
    (typeof $direction === 'string'
      ? `flex-direction: ${$direction};`
      : Object.entries($direction)
          .map(([key, value]) =>
            key === 'xs'
              ? `flex-direction: ${value};`
              : `@media (min-width: ${breakpoints[key as keyof typeof breakpoints]}px) { flex-direction: ${value}; }`,
          )
          .join('\n'))}
  ${({ $gap }) => $gap && responsiveSpace($gap, 'gap')}
`;
