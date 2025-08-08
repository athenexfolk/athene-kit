import { useState } from 'react';
import { Dropdown, type DropdownOption } from './dropdown';
import { Container } from '../layout/primitives';

const options: DropdownOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

export default function DropdownExamples() {
  const [value, setValue] = useState<string | undefined>();
  return (
    <Container p={4}>
      <Dropdown
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Choose an option"
      />
      <div style={{ marginTop: 16 }}>Selected: {value || 'None'}</div>
    </Container>
  );
}
