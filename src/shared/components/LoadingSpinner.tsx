import { CircularProgress, CircularProgressProps } from '@mui/material';

const LoadingSpinner = ({ size = 32, thickness = 4, ...props }: CircularProgressProps) => {
  return <CircularProgress size={size} thickness={thickness} {...props} />;
};

export default LoadingSpinner;
