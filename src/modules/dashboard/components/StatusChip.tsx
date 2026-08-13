import { Chip } from '@mui/material';

import { TStatus } from '../types/task';
import { STATUS_META } from '../utils/taskDisplay';

export function StatusChip({ status }: { status: TStatus }) {
  const meta = STATUS_META[status];
  return <Chip size="small" label={meta.label} color={meta.color} variant="filled" />;
}
