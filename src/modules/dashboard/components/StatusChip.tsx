import { Chip } from '@mui/material';

import { mapDisplayStatusColorByStatus } from '../constants/mapDisplayStatusColorByStatus';
import { mapDisplayStatusLabelByStatus } from '../constants/mapDisplayStatusLabelByStatus';
import { TStatusColor } from '../types/taskStatus';

export const StatusChip = ({ status }: { status: string }) => {
  const displayLabel = (mapDisplayStatusLabelByStatus as Partial<Record<string, string>>)[status];
  const displayColor = (mapDisplayStatusColorByStatus as Partial<Record<string, TStatusColor>>)[status];

  if (!displayLabel || !displayColor) {
    return <Chip size="small" label={status || 'Unrecognized'} variant="outlined" />;
  }

  return <Chip size="small" label={displayLabel} color={displayColor} variant="filled" />;
};
