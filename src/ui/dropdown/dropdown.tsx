import React, { useState, useRef, useEffect } from 'react';
import {
  DropdownContainer,
  DropdownButton,
  DropdownList,
  DropdownItem,
} from './dropdown.styled';
import { Icon } from '../icon';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <DropdownContainer ref={ref}>
      <DropdownButton
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        <span>{selected ? selected.label : placeholder || 'Select...'}</span>
        <Icon name="unfold_more" aria-hidden="true" />
      </DropdownButton>
      {open && (
        <DropdownList role="listbox">
          {options.map((opt) => (
            <DropdownItem
              key={opt.value}
              selected={opt.value === value}
              tabIndex={0}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};
