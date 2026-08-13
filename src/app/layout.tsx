'use client';

import { AppLayout } from '@/shared/components/AppLayout';
import { DevApiControlPanel } from '@/shared/dev/components/DevApiControlPanel';

import Providers from './providers';

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
          <DevApiControlPanel />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
