import React from 'react';
import { StyledBox } from './box.styled';
import type { ResponsiveValue } from '../../utilities';

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  borderWidth?: number;
  radius?: number;
  p?: ResponsiveValue;
  m?: ResponsiveValue;
};

const Box: React.FC<BoxProps> = ({
  as: Component = 'div',
  borderWidth,
  radius,
  p,
  m,
  style,
  ...rest
}) => {
  return (
    <StyledBox
      as={Component}
      $borderWidth={borderWidth}
      $radius={radius}
      $p={p}
      $m={m}
      style={style}
      {...rest}
    />
  );
};

export default Box;
