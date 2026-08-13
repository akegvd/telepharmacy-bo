'use client';

import { Box, MenuItem, styled, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerSlotProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, memo, useCallback, useMemo } from 'react';

import DebouncedSearchField from '@/shared/components/DebouncedSearchField';

import { ALL } from '../constants/filters';
import { mapDisplayTaskStatusLabelByStatus } from '../constants/mapDisplayTaskStatusLabelByStatus';
import { serviceTypeOptionList } from '../constants/serviceTypeOptionList';
import { taskStatusOptionList } from '../constants/taskStatusOptionList';

const DATE_VALUE_FORMAT = 'YYYY-MM-DD';

const FilterGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const SearchField = styled(DebouncedSearchField)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    gridColumn: 'span 2',
  },
}));

const datePickerSlotProps: DatePickerSlotProps = {
  textField: { size: 'small', fullWidth: true },
  field: { clearable: true },
};

const toDateValue = (value: string): Dayjs | null => (value ? dayjs(value, DATE_VALUE_FORMAT) : null);

export interface IFilterBarProps {
  search: string;
  service: string;
  status: string;
  createdFrom: string;
  createdTo: string;
  onSearchChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreatedFromChange: (value: string) => void;
  onCreatedToChange: (value: string) => void;
}

const FilterBar = ({
  search,
  service,
  status,
  createdFrom,
  createdTo,
  onSearchChange,
  onServiceChange,
  onStatusChange,
  onCreatedFromChange,
  onCreatedToChange,
}: IFilterBarProps) => {
  // Parsing on every render would hand the pickers a brand new Dayjs each time,
  // which is enough to make them re-sync their field state for no reason.
  const createdFromValue = useMemo(() => toDateValue(createdFrom), [createdFrom]);
  const createdToValue = useMemo(() => toDateValue(createdTo), [createdTo]);

  const handleServiceInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onServiceChange(event.target.value),
    [onServiceChange]
  );

  const handleStatusInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onStatusChange(event.target.value),
    [onStatusChange]
  );

  const handleCreatedFromChange = useCallback(
    (value: Dayjs | null) => onCreatedFromChange(value?.isValid() ? value.format(DATE_VALUE_FORMAT) : ''),
    [onCreatedFromChange]
  );

  const handleCreatedToChange = useCallback(
    (value: Dayjs | null) => onCreatedToChange(value?.isValid() ? value.format(DATE_VALUE_FORMAT) : ''),
    [onCreatedToChange]
  );

  return (
    <FilterGrid>
      <SearchField
        label="Search customer"
        placeholder="e.g. Somchai"
        value={search}
        onDebouncedChange={onSearchChange}
      />
      <TextField select label="Service" value={service} onChange={handleServiceInputChange} size="small">
        <MenuItem value={ALL}>All services</MenuItem>
        {serviceTypeOptionList.map((type) => (
          <MenuItem key={type} value={type}>
            {type.replace('_', ' ')}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Status" value={status} onChange={handleStatusInputChange} size="small">
        <MenuItem value={ALL}>All statuses</MenuItem>
        {taskStatusOptionList.map((value) => (
          <MenuItem key={value} value={value}>
            {mapDisplayTaskStatusLabelByStatus[value]}
          </MenuItem>
        ))}
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Created from"
          value={createdFromValue}
          onChange={handleCreatedFromChange}
          maxDate={createdToValue ?? undefined}
          slotProps={datePickerSlotProps}
        />
        <DatePicker
          label="Created to"
          value={createdToValue}
          onChange={handleCreatedToChange}
          minDate={createdFromValue ?? undefined}
          slotProps={datePickerSlotProps}
        />
      </LocalizationProvider>
    </FilterGrid>
  );
};

export default memo(FilterBar);
