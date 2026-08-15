'use client';

import { Container, Stack, styled } from '@mui/material';
import { Suspense } from 'react';

import { ChatLauncherButton } from '@/modules/chat/components/ChatLauncherButton';
import Dashboard from '@/modules/dashboard/components/Dashboard';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

const Fallback = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 320,
});

const DashboardFallback = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fallback>
        <LoadingSpinner size={40} />
      </Fallback>
    </Container>
  );
};

const Home = () => {
  return (
    <>
      <Suspense fallback={<DashboardFallback />}>
        <Dashboard />
      </Suspense>

      <ChatLauncherButton />
    </>
  );
};

export default Home;
