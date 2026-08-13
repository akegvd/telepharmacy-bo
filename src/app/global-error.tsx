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
        {/* This file replaces the root layout, so the layout's metadata title never applies here.
            Error boundaries are Client Components and can't export metadata — React hoists this instead. */}
        <title>Something went wrong | Telepharmacy - Back Office</title>
        <AppThemeProvider>
          <ErrorPage error={error} reset={reset} />
        </AppThemeProvider>
      </body>
    </html>
  );
};

export default GlobalError;
