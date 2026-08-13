import { Container, Stack } from '@mui/material';
import { Suspense } from 'react';

import { Dashboard } from '@/modules/dashboard/components/Dashboard';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

function DashboardFallback() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <LoadingSpinner size={40} />
      </Stack>
    </Container>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <Dashboard />
    </Suspense>
  );
}
