import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  className = '',
  style,
  ...rest
}) => {
  return (
    <span
      className={`material-symbols-rounded ${className}`.trim()}
      style={{
        fontSize: size,
        color,
        verticalAlign: 'middle',
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
};

export default Icon;
