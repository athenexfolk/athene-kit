import styled from 'styled-components';

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownButton = styled.button`
  background: var(--color-neutral100);
  color: var(--color-neutral0);
  border: 2px solid var(--color-neutral0);
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  border-radius: 4px;
  min-width: 120px;
  min-height: 2.5rem;
  box-sizing: border-box;
  transition:
    background 0.2s,
    color 0.2s,
    border 0.2s;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  &:hover,
  &:focus {
    background: var(--color-neutral0);
    color: var(--color-neutral100);
  }
`;

export const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-neutral100);
  border: 2px solid var(--color-neutral0);
  border-radius: 4px;
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  z-index: 10;
`;

export const DropdownItem = styled.li<{ selected?: boolean }>`
  padding: 0.5rem 1.25rem;
  color: var(--color-neutral0);
  background: ${({ selected }) => (selected ? 'var(--color-neutral95)' : 'var(--color-neutral100)')};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  &:hover,
  &:focus {
    background: var(--color-neutral0);
    color: var(--color-neutral100);
  }
`;
