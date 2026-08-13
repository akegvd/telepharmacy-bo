'use client';

import { MenuItem, Stack, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

import { mapDisplayStatusLabelByStatus } from '../constants/mapDisplayStatusLabelByStatus';
import { serviceTypeOptionList } from '../constants/serviceTypeOptionList';
import { taskStatusOptionList } from '../constants/taskStatusOptionList';

const ALL = 'all';

export const FilterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const debouncedSearch = useDebouncedValue(search, 300);

  const service = searchParams.get('service') ?? ALL;
  const status = searchParams.get('status') ?? ALL;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
    // Only re-run when the debounced search term changes — service/status
    // filters update the URL directly in their own onChange handlers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        label="Search customer"
        placeholder="e.g. Somchai"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        size="small"
        fullWidth
      />
      <TextField
        select
        label="Service"
        value={service}
        onChange={(event) => updateParam('service', event.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        <MenuItem value={ALL}>All services</MenuItem>
        {serviceTypeOptionList.map((type) => (
          <MenuItem key={type} value={type}>
            {type.replace('_', ' ')}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Status"
        value={status}
        onChange={(event) => updateParam('status', event.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        <MenuItem value={ALL}>All statuses</MenuItem>
        {taskStatusOptionList.map((value) => (
          <MenuItem key={value} value={value}>
            {mapDisplayStatusLabelByStatus[value]}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};
