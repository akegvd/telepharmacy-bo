import { CircularProgress, CircularProgressProps } from '@mui/material';

export const LoadingSpinner = ({ size = 32, thickness = 4, ...props }: CircularProgressProps) => {
  return <CircularProgress size={size} thickness={thickness} {...props} />;
};
