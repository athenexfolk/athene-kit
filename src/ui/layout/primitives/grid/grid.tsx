import React from 'react';
import { StyledGrid } from './grid.styled';
import type { ResponsiveValue } from '../../utilities';

export type GridProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  columns?: ResponsiveValue;
  gap?: ResponsiveValue;
};

const Grid: React.FC<GridProps> = ({
  as: Component = 'div',
  columns = 2,
  gap = 0,
  style,
  children,
  ...rest
}) => {
  return (
    <StyledGrid
      as={Component}
      $columns={columns}
      $gap={gap}
      style={style}
      {...rest}
    >
      {children}
    </StyledGrid>
  );
};

export default Grid;
