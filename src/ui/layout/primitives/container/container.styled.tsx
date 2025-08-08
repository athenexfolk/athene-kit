import styled from 'styled-components';
import { responsiveSpace, type ResponsiveValue } from '../../utilities';

interface StyledContainerProps {
  $maxWidth?: number | string;
  $center?: boolean;
  $p?: ResponsiveValue;
}

export const StyledContainer = styled.div<StyledContainerProps>`
  max-width: ${({ $maxWidth }) =>
    typeof $maxWidth === 'number' ? `${$maxWidth}px` : $maxWidth || '800px'};
  margin-left: ${({ $center }) => ($center ? 'auto' : 'unset')};
  margin-right: ${({ $center }) => ($center ? 'auto' : 'unset')};
  ${({ $p }) => $p && responsiveSpace($p, 'padding')}
  width: 100%;
`;
