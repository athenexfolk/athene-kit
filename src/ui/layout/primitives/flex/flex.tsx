import React from 'react';
import { StyledFlex } from './flex.styled';
import type { ResponsiveValue } from '../../utilities';

export type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: boolean;
  gap?: ResponsiveValue;
  direction?: ResponsiveValue<React.CSSProperties['flexDirection']>;
};

const Flex: React.FC<FlexProps> = ({
  as: Component = 'div',
  align,
  justify,
  wrap = true,
  gap,
  direction,
  style,
  children,
  ...rest
}) => {
  return (
    <StyledFlex
      as={Component}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $gap={gap}
      $direction={direction}
      style={style}
      {...rest}
    >
      {children}
    </StyledFlex>
  );
};

export default Flex;
