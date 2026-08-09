import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Card, CardActionArea, CardContent, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";

import { ServiceTypeIcon } from "./ServiceTypeIcon";
import { StatusChip } from "./StatusChip";
import { formatTaskDate, SERVICE_TYPE_META } from "../utils/taskDisplay";
import { NormalizedTask } from "../types/task";

const ISSUE_LABELS: Record<string, string> = {
  missing_name: "Customer name was missing",
  unknown_service_type: "Unrecognized service type",
  unknown_status: "Unrecognized status, shown as New",
  missing_symptom: "Symptom description was missing",
  invalid_date: "Requested date could not be parsed",
};

export function TaskCard({ task }: { task: NormalizedTask }) {
  return (
    <Card variant="outlined">
      <CardActionArea component={Link} href={`/task/${task.id}`}>
        <CardContent>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
              {task.customerName}
            </Typography>
            <StatusChip status={task.status} />
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mt: 0.5, alignItems: "center", color: "text.secondary" }}
          >
            <ServiceTypeIcon serviceType={task.serviceType} />
            <Typography variant="body2">{SERVICE_TYPE_META[task.serviceType].label}</Typography>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            &ldquo;{task.symptom}&rdquo;
          </Typography>

          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center", mt: 1.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              {formatTaskDate(task.createdAt)}
            </Typography>
            {task.issues.length > 0 && (
              <Tooltip title={task.issues.map((issue) => ISSUE_LABELS[issue] ?? issue).join(" · ")}>
                <Box
                  data-testid="data-issue-warning"
                  sx={{ display: "flex", alignItems: "center", color: "warning.main" }}
                >
                  <WarningAmberIcon fontSize="small" />
                </Box>
              </Tooltip>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
