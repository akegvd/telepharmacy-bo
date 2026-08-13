'use client';

import { AppLayout } from '@/shared/components/AppLayout';

import Providers from './providers';

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
