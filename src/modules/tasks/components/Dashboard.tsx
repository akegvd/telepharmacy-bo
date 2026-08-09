"use client";

import { Alert, Box, Container, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { DataIssuesBanner } from "./DataIssuesBanner";
import { FilterBar } from "./FilterBar";
import { SummaryBar } from "./SummaryBar";
import { TaskCard } from "./TaskCard";
import { useTasksQuery } from "../hooks/useTaskQueries";
import { filterTasks } from "../utils/filterTasks";

export function Dashboard() {
  const searchParams = useSearchParams();
  const { data, isLoading, isError, error, refetch, isRefetching } = useTasksQuery();

  const filters = {
    q: searchParams.get("q") ?? "",
    service: searchParams.get("service") ?? "all",
    status: searchParams.get("status") ?? "all",
  };

  const filteredTasks = useMemo(
    () => (data ? filterTasks(data.tasks, filters) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filters.q, filters.service, filters.status],
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Telepharmacy Task Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review incoming consultation requests and move them through the workflow.
            {isRefetching && " · refreshing…"}
          </Typography>
        </Box>

        <FilterBar />

        {isLoading && (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={64} />
            <Grid container spacing={2}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant="rounded" height={150} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}

        {isError && (
          <Alert
            severity="error"
            action={
              <Typography
                component="button"
                onClick={() => refetch()}
                sx={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "inherit",
                  textDecoration: "underline",
                  font: "inherit",
                }}
              >
                Retry
              </Typography>
            }
          >
            {error instanceof Error ? error.message : "Something went wrong loading tasks."}
          </Alert>
        )}

        {data && (
          <>
            <SummaryBar tasks={data.tasks} />
            <DataIssuesBanner tasks={data.tasks} duplicateIds={data.duplicateIds} />

            {filteredTasks.length === 0 ? (
              <Alert severity="info" variant="outlined">
                {data.tasks.length === 0
                  ? "No consultation requests yet."
                  : "No requests match your filters."}
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {filteredTasks.map((task) => (
                  <Grid key={task.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <TaskCard task={task} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
