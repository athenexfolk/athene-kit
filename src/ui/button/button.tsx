import React, { forwardRef, memo } from 'react';
import { StyledButton } from './button.styled';
import type { IconProps } from '../icon/icon';
import Icon from '../icon/icon';

export type ButtonProps = {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loadingIndicator?: React.ReactNode;
  loadingText?: string;
  icon?: IconProps['name'];
  iconPosition?: 'left' | 'right';
  iconSize?: IconProps['size'];
  iconColor?: IconProps['color'];
  ariaLabel?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        disabled = false,
        loading = false,
        onClick,
        className = '',
        type = 'button',
        variant = 'primary',
        size = 'md',
        loadingIndicator,
        loadingText,
        tabIndex,
        icon,
        iconPosition = 'left',
        iconSize = 24,
        iconColor,
        ariaLabel,
        ...rest
      },
      ref,
    ) => {
      const hasIcon = !!icon;
      const isIconOnly = hasIcon && !children && !loadingText;
      return (
        <StyledButton
          ref={ref}
          type={type}
          $variant={variant}
          $size={size}
          $loading={loading}
          disabled={disabled || loading}
          aria-busy={loading}
          aria-disabled={disabled || loading}
          tabIndex={tabIndex}
          onClick={onClick}
          className={className}
          aria-label={
            isIconOnly
              ? ariaLabel || (typeof icon === 'string' ? icon : undefined)
              : undefined
          }
          {...rest}
        >
          {loading ? (
            <>
              {loadingIndicator || (
                <Icon
                  name="progress_activity"
                  size={hasIcon ? iconSize : 16}
                  style={{
                    marginRight: loadingText || children ? 8 : 0,
                    verticalAlign: 'middle',
                  }}
                  aria-hidden="true"
                  className="atk-btn-loading-icon"
                />
              )}
              {loadingText ? (
                <span aria-live="polite">{loadingText}</span>
              ) : null}
            </>
          ) : (
            <>
              {hasIcon && iconPosition === 'left' && (
                <Icon
                  name={icon}
                  size={iconSize}
                  color={iconColor}
                  style={{ marginRight: children ? 8 : 0 }}
                  aria-hidden={isIconOnly ? undefined : true}
                />
              )}
              {children}
              {hasIcon && iconPosition === 'right' && (
                <Icon
                  name={icon!}
                  size={iconSize}
                  color={iconColor}
                  style={{ marginLeft: children ? 8 : 0 }}
                  aria-hidden={isIconOnly ? undefined : true}
                />
              )}
            </>
          )}
        </StyledButton>
      );
    },
  ),
);

export default Button;
