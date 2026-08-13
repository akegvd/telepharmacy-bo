"use client";

import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { SearchResultWrapper } from "@/shared/components/SearchResultWrapper";

import { useTasksQuery } from "../hooks/useTaskQueries";
import { filterTasks } from "../utils/filterTasks";

import { DataIssuesBanner } from "./DataIssuesBanner";
import { FilterBar } from "./FilterBar";
import { SummaryBar } from "./SummaryBar";
import { TaskList } from "./TaskList";

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

        <SearchResultWrapper
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : "Something went wrong loading tasks."}
          onRetry={() => refetch()}
        >
          {data && (
            <Stack spacing={3}>
              <SummaryBar tasks={data.tasks} />
              <DataIssuesBanner tasks={data.tasks} duplicateIds={data.duplicateIds} />

              {filteredTasks.length === 0 ? (
                <Alert severity="info" variant="outlined">
                  {data.tasks.length === 0
                    ? "No consultation requests yet."
                    : "No requests match your filters."}
                </Alert>
              ) : (
                <TaskList tasks={filteredTasks} />
              )}
            </Stack>
          )}
        </SearchResultWrapper>
      </Stack>
    </Container>
  );
}
