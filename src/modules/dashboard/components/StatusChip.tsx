import { Chip } from '@mui/material';

import { TStatusColor } from '../types/taskStatus';

interface IStatusChipProps {
  label: string;
  color?: TStatusColor | null;
}

const StatusChip = ({ label, color }: IStatusChipProps) => {
  if (!color) {
    return <Chip size="small" label={label || 'Unrecognized'} variant="outlined" />;
  }

  return <Chip size="small" label={label} color={color} variant="filled" />;
};

export default StatusChip;
