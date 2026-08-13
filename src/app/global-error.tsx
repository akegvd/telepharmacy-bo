'use client';

import { ErrorPage } from '@/shared/components/ErrorPage';
import { AppThemeProvider } from '@/theme';

import './globals.css';

interface IGlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: IGlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <ErrorPage error={error} reset={reset} />
        </AppThemeProvider>
      </body>
    </html>
  );
}
