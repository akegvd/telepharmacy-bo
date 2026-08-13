import NotFoundPage from '@/shared/components/NotFoundPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found - Telepharmacy Back Office',
};

const NotFound = () => {
  return <NotFoundPage />;
};

export default NotFound;
