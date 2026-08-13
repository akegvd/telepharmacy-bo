import { Container, Paper } from "@mui/material";

import { TaskDetailContent } from "@/modules/dashboard/components/TaskDetailContent";

export default async function TaskPage({ params }: PageProps<"/task/[id]">) {
  const { id } = await params;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <TaskDetailContent id={id} />
      </Paper>
    </Container>
  );
}
