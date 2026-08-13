import { NotFoundPage } from '@/shared/components/NotFoundPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return <NotFoundPage />;
}
