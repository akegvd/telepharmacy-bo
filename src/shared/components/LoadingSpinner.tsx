import { CircularProgress, CircularProgressProps } from '@mui/material';

export function LoadingSpinner({ size = 32, thickness = 4, ...props }: CircularProgressProps) {
  return <CircularProgress size={size} thickness={thickness} {...props} />;
}
