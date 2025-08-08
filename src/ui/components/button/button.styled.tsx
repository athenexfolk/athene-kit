import styled, { css } from 'styled-components';

const variantStyles = {
  primary: css`
    background: var(--color-neutral100);
    color: var(--color-neutral0);
    border: 2px solid var(--color-neutral0);
    &:hover:not(:disabled) {
      background: var(--color-neutral95);
      color: var(--color-neutral0);
    }
  `,
  secondary: css`
    background: var(--color-neutral100);
    color: var(--color-neutral0);
    border: 2px solid transparent;
    &:hover:not(:disabled) {
      background: var(--color-neutral95);
      color: var(--color-neutral0);
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  `,
  md: css`
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
  `,
  lg: css`
    padding: 0.75rem 1.75rem;
    font-size: 1.25rem;
  `,
};

export const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary';
  $size: 'sm' | 'md' | 'lg';
  $loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background 0.2s,
    color 0.2s,
    border 0.2s;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
  ${({ $loading }) =>
    $loading &&
    css`
      cursor: wait;
      opacity: 0.7;
    `}
`;
