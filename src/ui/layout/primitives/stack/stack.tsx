import React from 'react';
import { StyledStack } from './stack.styled';
import type { ResponsiveValue } from '../../utilities';

export type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  direction?:
    | ResponsiveValue<'vertical' | 'horizontal'>
    | 'vertical'
    | 'horizontal';
  gap?: ResponsiveValue;
};

const Stack: React.FC<StackProps> = ({
  as: Component = 'div',
  direction = 'vertical',
  gap = 0,
  style,
  children,
  ...rest
}) => {
  return (
    <StyledStack
      as={Component}
      $direction={direction}
      $gap={gap}
      style={style}
      {...rest}
    >
      {children}
    </StyledStack>
  );
};

export default Stack;
