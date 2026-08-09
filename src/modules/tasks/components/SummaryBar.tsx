import { Paper, Stack, Typography } from "@mui/material";

import { STATUS_META } from "../utils/taskDisplay";
import { NormalizedTask, STATUSES } from "../types/task";

export function SummaryBar({ tasks }: { tasks: NormalizedTask[] }) {
  const counts = STATUSES.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));

  return (
    <Paper variant="outlined" sx={{ p: 1.5, px: 2 }}>
      <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
        {counts.map(({ status, count }) => (
          <Stack key={status} direction="row" spacing={0.75} sx={{ alignItems: "baseline" }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
              {count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {STATUS_META[status].label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
