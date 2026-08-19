import { Alert, Stack, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';

import LoadingSpinner from './LoadingSpinner';

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

interface ILoadingStateProps {
  minHeight: number | string;
}

const LoadingState = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'minHeight',
})<ILoadingStateProps>(({ minHeight }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  minHeight,
}));

const RetryButton = styled('button')({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: 'inherit',
  textDecoration: 'underline',
  font: 'inherit',
});

const SearchResultWrapper = ({
  isLoading,
  isError = false,
  isEmpty = false,
  loadingLabel = 'Loading…',
  errorMessage = 'Something went wrong loading this data.',
  emptyMessage = 'No results found.',
  onRetry,
  minHeight = 200,
  children,
}: ISearchResultWrapperProps) => {
  if (isLoading) {
    return (
      <LoadingState spacing={1.5} minHeight={minHeight} sx={{ py: 4 }}>
        <LoadingSpinner size={32} />
        <Typography variant="body2" color="text.secondary">
          {loadingLabel}
        </Typography>
      </LoadingState>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          onRetry ? (
            <RetryButton type="button" onClick={onRetry}>
              Retry
            </RetryButton>
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
};

export default SearchResultWrapper;
