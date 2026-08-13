'use client';

import { ErrorPage } from '@/shared/components/ErrorPage';

interface IErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ error, reset }: IErrorProps) => {
  return <ErrorPage error={error} reset={reset} />;
};

export default Error;
