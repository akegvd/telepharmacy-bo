import { NotFoundPage } from '@/shared/components/NotFoundPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
};

const NotFound = () => {
  return <NotFoundPage />;
};

export default NotFound;
