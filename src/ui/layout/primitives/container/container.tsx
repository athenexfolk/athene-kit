import React from 'react';
import { StyledContainer } from './container.styled';
import type { ResponsiveValue } from '../../utilities';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  maxWidth?: number | string;
  center?: boolean;
  p?: ResponsiveValue;
};

const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  maxWidth = 800,
  center = true,
  p,
  style,
  children,
  ...rest
}) => {
  return (
    <StyledContainer
      as={Component}
      $maxWidth={maxWidth}
      $center={center}
      $p={p}
      style={style}
      {...rest}
    >
      {children}
    </StyledContainer>
  );
};

export default Container;
