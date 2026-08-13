"use client";

import { ErrorPage } from "@/shared/components/ErrorPage";

interface IErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: IErrorProps) {
  return <ErrorPage error={error} reset={reset} />;
}
