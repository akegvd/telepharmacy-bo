'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const DEFAULT_DEBOUNCE_MS = 300;

export interface IDebouncedSearchFieldProps {
  label: string;
  value: string;
  onDebouncedChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  size?: TextFieldProps['size'];
  className?: string;
}

/**
 * Keeps the typed text in local state and only reports it upwards once typing pauses,
 * so a keystroke re-renders this field instead of the whole screen behind it.
 */
const DebouncedSearchField = ({
  label,
  value,
  onDebouncedChange,
  placeholder,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  size = 'small',
  className,
}: IDebouncedSearchFieldProps) => {
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmittedValueRef = useRef(value);

  useEffect(() => {
    if (value === lastEmittedValueRef.current) {
      return;
    }

    lastEmittedValueRef.current = value;
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      lastEmittedValueRef.current = nextValue;
      onDebouncedChange(nextValue);
    }, debounceMs);
  };

  return (
    <TextField
      className={className}
      label={label}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      size={size}
    />
  );
};

export default DebouncedSearchField;
