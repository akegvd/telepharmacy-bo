"use client";

import { Alert, Box, Button, Stack, Typography } from "@mui/material";

import { SearchResultWrapper } from "@/shared/components/SearchResultWrapper";

import {
  useTaskQuery,
  useUpdateTaskStatusMutation,
} from "../hooks/useTaskQueries";
import {
  formatTaskDate,
  NEXT_STATUS,
  SERVICE_TYPE_META,
  STATUS_META,
} from "../utils/taskDisplay";

import { ServiceTypeIcon } from "./ServiceTypeIcon";
import { StatusChip } from "./StatusChip";

const ISSUE_LABELS: Record<string, string> = {
  missing_name:
    "The customer name was missing from this request and was shown as “Unknown customer”.",
  unknown_service_type:
    "The service type wasn't one of the known values and was shown as “Unknown service”.",
  unknown_status:
    "The status wasn't one of the known workflow states and was reset to “New”.",
  missing_symptom: "No symptom description was provided.",
  invalid_date: "The request date couldn't be parsed.",
};

export function TaskDetailContent({ id }: { id: string }) {
  const { data: task, isLoading, isError } = useTaskQuery(id);
  const mutation = useUpdateTaskStatusMutation();
  const nextStatus = task ? NEXT_STATUS[task.status] : undefined;

  return (
    <SearchResultWrapper
      isLoading={isLoading}
      isError={isError || !task}
      errorMessage="This request could not be found."
    >
      {task && (
        <Stack spacing={2}>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {task.displayCustomerName}
              </Typography>
              <StatusChip status={task.displayStatus} />
            </Stack>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ mt: 0.5, alignItems: "center", color: "text.secondary" }}
            >
              <ServiceTypeIcon serviceType={task.displayServiceType} />
              <Typography variant="body2">
                {SERVICE_TYPE_META[task.displayServiceType].label}
              </Typography>
              <Typography variant="body2">·</Typography>
              <Typography variant="body2">
                {formatTaskDate(task.displayCreatedAt)}
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Reason for consultation
            </Typography>
            <Typography variant="body1">{task.displaySymptom}</Typography>
          </Box>

          {task.issues.length > 0 && (
            <Alert severity="warning" variant="outlined">
              <Stack spacing={0.5}>
                {task.issues.map((issue) => (
                  <Typography key={issue} variant="body2">
                    {ISSUE_LABELS[issue] ?? issue}
                  </Typography>
                ))}
              </Stack>
            </Alert>
          )}

          {mutation.isError && (
            <Alert severity="error">
              Couldn&apos;t update the status. Please try again.
            </Alert>
          )}

          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            {nextStatus ? (
              <Button
                variant="contained"
                loading={mutation.isPending}
                onClick={() =>
                  mutation.mutate({ id: task.id, status: nextStatus })
                }
              >
                Advance to {STATUS_META[nextStatus].label}
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                This request has been completed.
              </Typography>
            )}
          </Stack>
        </Stack>
      )}
    </SearchResultWrapper>
  );
}
