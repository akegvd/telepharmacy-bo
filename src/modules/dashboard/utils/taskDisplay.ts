import dayjs from "dayjs";

import { TNormalizedServiceType, TStatus } from "../types/task";

export const STATUS_META: Record<
  TStatus,
  { label: string; color: "info" | "warning" | "success" }
> = {
  new: { label: "New", color: "info" },
  in_progress: { label: "In progress", color: "warning" },
  completed: { label: "Completed", color: "success" },
};

export const NEXT_STATUS: Record<TStatus, TStatus | null> = {
  new: "in_progress",
  in_progress: "completed",
  completed: null,
};

export const SERVICE_TYPE_META: Record<
  TNormalizedServiceType,
  { label: string }
> = {
  video_call: { label: "Video call" },
  voice_call: { label: "Voice call" },
  chat: { label: "Chat" },
  unknown: { label: "Unknown service" },
};

export function formatTaskDate(iso: string | null): string {
  if (!iso) return "Unknown date";
  return dayjs(iso).format("MMM D, hh:mm A");
}
