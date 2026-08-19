'use client';

import ErrorPage, { IAppError } from '@/shared/components/ErrorPage';

interface IErrorProps {
  error: IAppError;
  reset: () => void;
}

const Error = ({ error, reset }: IErrorProps) => {
  return <ErrorPage error={error} reset={reset} />;
};

export default Error;
