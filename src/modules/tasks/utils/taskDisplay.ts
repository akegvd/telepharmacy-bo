import { NormalizedServiceType, Status } from "../types/task";

export const STATUS_META: Record<
  Status,
  { label: string; color: "info" | "warning" | "success" }
> = {
  new: { label: "New", color: "info" },
  in_progress: { label: "In progress", color: "warning" },
  completed: { label: "Completed", color: "success" },
};

export const NEXT_STATUS: Record<Status, Status | null> = {
  new: "in_progress",
  in_progress: "completed",
  completed: null,
};

export const SERVICE_TYPE_META: Record<
  NormalizedServiceType,
  { label: string }
> = {
  video_call: { label: "Video call" },
  voice_call: { label: "Voice call" },
  chat: { label: "Chat" },
  unknown: { label: "Unknown service" },
};

export function formatTaskDate(iso: string | null): string {
  if (!iso) return "Unknown date";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
