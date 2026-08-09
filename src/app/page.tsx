import { Container, Skeleton, Stack } from "@mui/material";
import { Suspense } from "react";

import { Dashboard } from "@/modules/tasks/components/Dashboard";

function DashboardFallback() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Skeleton variant="text" width={320} height={48} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={200} />
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
