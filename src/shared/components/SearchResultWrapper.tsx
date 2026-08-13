import { Alert, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { LoadingSpinner } from './LoadingSpinner';

interface ISearchResultWrapperProps {
  isLoading: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  loadingLabel?: ReactNode;
  errorMessage?: ReactNode;
  emptyMessage?: ReactNode;
  onRetry?: () => void;
  minHeight?: number | string;
  children: ReactNode;
}

export function SearchResultWrapper({
  isLoading,
  isError = false,
  isEmpty = false,
  loadingLabel = 'Loading…',
  errorMessage = 'Something went wrong loading this data.',
  emptyMessage = 'No results found.',
  onRetry,
  minHeight = 200,
  children,
}: ISearchResultWrapperProps) {
  if (isLoading) {
    return (
      <Stack spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center', minHeight, py: 4 }}>
        <LoadingSpinner size={32} />
        <Typography variant="body2" color="text.secondary">
          {loadingLabel}
        </Typography>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Typography
              component="button"
              onClick={onRetry}
              sx={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'inherit',
                textDecoration: 'underline',
                font: 'inherit',
              }}
            >
              Retry
            </Typography>
          ) : undefined
        }
      >
        {errorMessage}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Alert severity="info" variant="outlined">
        {emptyMessage}
      </Alert>
    );
  }

  return <>{children}</>;
}
