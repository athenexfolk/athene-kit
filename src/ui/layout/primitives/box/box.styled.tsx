import styled from 'styled-components';
import { responsiveSpace, type ResponsiveValue } from '../../utilities';

interface StyledBoxProps {
  $borderWidth?: number;
  $radius?: number;
  $p?: ResponsiveValue;
  $m?: ResponsiveValue;
}

export const StyledBox = styled.div<StyledBoxProps>`
  border-width: ${({ $borderWidth }) =>
    $borderWidth ? `${$borderWidth}px` : 0};
  border-style: ${({ $borderWidth }) => ($borderWidth ? 'solid' : 'none')};
  border-radius: ${({ $radius }) => ($radius ? `${$radius}px` : 0)};
  ${({ $p }) => $p && responsiveSpace($p, 'padding')}
  ${({ $m }) => $m && responsiveSpace($m, 'margin')}
`;
