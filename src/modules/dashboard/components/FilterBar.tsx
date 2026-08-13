'use client';

import { MenuItem, Stack, styled, TextField } from '@mui/material';
import { ChangeEvent, useCallback } from 'react';

import { mapDisplayTaskStatusLabelByStatus } from '../constants/mapDisplayTaskStatusLabelByStatus';
import { serviceTypeOptionList } from '../constants/serviceTypeOptionList';
import { taskStatusOptionList } from '../constants/taskStatusOptionList';

export const ALL = 'all';

const FilterSelect = styled(TextField)({
  minWidth: 160,
});

export interface IFilterBarProps {
  search: string;
  service: string;
  status: string;
  onSearchChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const FilterBar = ({
  search,
  service,
  status,
  onSearchChange,
  onServiceChange,
  onStatusChange,
}: IFilterBarProps) => {
  const handleSearchInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value),
    [onSearchChange]
  );

  const handleServiceInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onServiceChange(event.target.value),
    [onServiceChange]
  );

  const handleStatusInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onStatusChange(event.target.value),
    [onStatusChange]
  );

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        label="Search customer"
        placeholder="e.g. Somchai"
        value={search}
        onChange={handleSearchInputChange}
        size="small"
        fullWidth
      />
      <FilterSelect select label="Service" value={service} onChange={handleServiceInputChange} size="small">
        <MenuItem value={ALL}>All services</MenuItem>
        {serviceTypeOptionList.map((type) => (
          <MenuItem key={type} value={type}>
            {type.replace('_', ' ')}
          </MenuItem>
        ))}
      </FilterSelect>
      <FilterSelect select label="Status" value={status} onChange={handleStatusInputChange} size="small">
        <MenuItem value={ALL}>All statuses</MenuItem>
        {taskStatusOptionList.map((value) => (
          <MenuItem key={value} value={value}>
            {mapDisplayTaskStatusLabelByStatus[value]}
          </MenuItem>
        ))}
      </FilterSelect>
    </Stack>
  );
};
