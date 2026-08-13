'use client';

import { Container, Paper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { TaskDetailContent } from '@/modules/dashboard/components/TaskDetailContent';

const TaskPageContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';

  return <TaskDetailContent id={id} />;
};

const TaskPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Suspense fallback={null}>
          <TaskPageContent />
        </Suspense>
      </Paper>
    </Container>
  );
};

export default TaskPage;
