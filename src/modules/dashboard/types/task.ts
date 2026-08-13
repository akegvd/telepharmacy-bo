export const SERVICE_TYPES = ["video_call", "voice_call", "chat"] as const;
export type TServiceType = (typeof SERVICE_TYPES)[number];

export const STATUSES = ["new", "in_progress", "completed"] as const;
export type TStatus = (typeof STATUSES)[number];

/** The order a task moves through the workflow; used to compute the "advance" action. */
export const STATUS_ORDER: readonly TStatus[] = ["new", "in_progress", "completed"];

/**
 * A service type that couldn't be matched to a known value in the seed data.
 * Kept as its own value (instead of silently coercing to a real service type)
 * so the UI can flag it rather than mislabel a call as e.g. a chat.
 */
export const UNKNOWN_SERVICE_TYPE = "unknown" as const;

export type TNormalizedServiceType = TServiceType | typeof UNKNOWN_SERVICE_TYPE;

export type TDataIssue =
  | "missing_name"
  | "unknown_service_type"
  | "unknown_status"
  | "missing_symptom"
  | "invalid_date";
