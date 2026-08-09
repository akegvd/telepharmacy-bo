import { Chip } from "@mui/material";

import { STATUS_META } from "../utils/taskDisplay";
import { Status } from "../types/task";

export function StatusChip({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  return <Chip size="small" label={meta.label} color={meta.color} variant="filled" />;
}
