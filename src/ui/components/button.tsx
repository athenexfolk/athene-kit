import React, { forwardRef, memo } from 'react';
import Icon, { type IconProps } from './icon';

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
        <button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          aria-busy={loading}
          aria-disabled={disabled || loading}
          tabIndex={tabIndex}
          onClick={onClick}
          aria-label={
            isIconOnly
              ? ariaLabel || (typeof icon === 'string' ? icon : undefined)
              : undefined
          }
          className={[
            // Base styles
            'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-200',
            // Variant styles
            variant === 'primary'
              ? 'hover:bg-neutral95 hover:text-neutral0 bg-neutral100 border-2'
              : 'hover:bg-neutral95 hover:text-neutral0 bg-neutral100 border-2 border-transparent',
            // Size styles
            size === 'sm'
              ? 'px-3 py-1 text-sm'
              : size === 'lg'
                ? 'px-7 py-3 text-xl'
                : 'px-5 py-2 text-base',
            // Loading/disabled styles
            disabled || loading ? 'pointer-events-none opacity-60' : '',
            loading ? 'cursor-wait opacity-70' : 'cursor-pointer',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {loading ? (
            <>
              {loadingIndicator || (
                <Icon
                  name="progress_activity"
                  size={hasIcon ? iconSize : 16}
                  aria-hidden="true"
                  className="animate-spin"
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
                  aria-hidden={isIconOnly ? undefined : true}
                />
              )}
              {children}
              {hasIcon && iconPosition === 'right' && (
                <Icon
                  name={icon}
                  size={iconSize}
                  color={iconColor}
                  aria-hidden={isIconOnly ? undefined : true}
                />
              )}
            </>
          )}
        </button>
      );
    },
  ),
);

export default Button;
