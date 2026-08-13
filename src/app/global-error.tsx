'use client';

import { ErrorPage, IAppError } from '@/shared/components/ErrorPage';
import { AppThemeProvider } from '@/theme';

interface IGlobalErrorProps {
  error: IAppError;
  reset: () => void;
}

const GlobalError = ({ error, reset }: IGlobalErrorProps) => {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <ErrorPage error={error} reset={reset} />
        </AppThemeProvider>
      </body>
    </html>
  );
};

export default GlobalError;
