'use client';

import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Button } from '@mui/material';

import NextLink from './NextLink';
import { StatusPage } from './StatusPage';

export interface IAppError extends Error {
  digest?: string;
}

interface IErrorPageProps {
  error: IAppError;
  reset: () => void;
}

export const ErrorPage = ({ error, reset }: IErrorPageProps) => {
  return (
    <StatusPage
      tone="error"
      icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 48 }} />}
      title="Something went wrong"
      description="An unexpected error occurred. You can try again, or return to the dashboard."
      detail={error.digest ? `Reference: ${error.digest}` : undefined}
    >
      <Button variant="contained" color="error" onClick={reset}>
        Try again
      </Button>
      <Button variant="outlined" component={NextLink} href="/">
        Back to Dashboard
      </Button>
    </StatusPage>
  );
};
