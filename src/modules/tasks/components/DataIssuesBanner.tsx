import { Alert } from "@mui/material";

import { NormalizedTask } from "../types/task";

export function DataIssuesBanner({
  tasks,
  duplicateIds,
}: {
  tasks: NormalizedTask[];
  duplicateIds: string[];
}) {
  const flaggedCount = tasks.filter((task) => task.issues.length > 0).length;
  if (flaggedCount === 0 && duplicateIds.length === 0) return null;

  const parts: string[] = [];
  if (flaggedCount > 0) {
    parts.push(
      `${flaggedCount} request${flaggedCount === 1 ? "" : "s"} had missing or invalid data and ${
        flaggedCount === 1 ? "was" : "were"
      } shown with a fallback (see the ⚠ on the card).`,
    );
  }
  if (duplicateIds.length > 0) {
    parts.push(
      `${duplicateIds.length} duplicate record${duplicateIds.length === 1 ? "" : "s"} (id: ${duplicateIds.join(", ")}) ${
        duplicateIds.length === 1 ? "was" : "were"
      } hidden, keeping the first occurrence.`,
    );
  }

  return (
    <Alert severity="warning" variant="outlined">
      {parts.join(" ")}
    </Alert>
  );
}
