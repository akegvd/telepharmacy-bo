export const SERVICE_TYPES = ["video_call", "voice_call", "chat"] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const STATUSES = ["new", "in_progress", "completed"] as const;
export type Status = (typeof STATUSES)[number];

/** The order a task moves through the workflow; used to compute the "advance" action. */
export const STATUS_ORDER: readonly Status[] = ["new", "in_progress", "completed"];

export type Task = {
  id: string;
  customerName: string;
  serviceType: ServiceType;
  symptom: string;
  status: Status;
  createdAt: string;
};

/**
 * A service type that couldn't be matched to a known value in the seed data.
 * Kept as its own value (instead of silently coercing to a real service type)
 * so the UI can flag it rather than mislabel a call as e.g. a chat.
 */
export const UNKNOWN_SERVICE_TYPE = "unknown" as const;

export type NormalizedServiceType = ServiceType | typeof UNKNOWN_SERVICE_TYPE;

export type DataIssue =
  | "missing_name"
  | "unknown_service_type"
  | "unknown_status"
  | "missing_symptom"
  | "invalid_date";

/**
 * A Task as rendered by the UI: same shape as the API's data model, but every
 * field is guaranteed to be safe to render (no null/undefined/"Invalid Date"),
 * with `issues` recording which fields were repaired from bad source data and
 * `raw` preserving what the API actually sent for debugging/audit purposes.
 */
export type NormalizedTask = Omit<Task, "serviceType" | "createdAt"> & {
  serviceType: NormalizedServiceType;
  /** Unparseable createdAt becomes null instead of an "Invalid Date". */
  createdAt: string | null;
  issues: DataIssue[];
  raw: {
    customerName: unknown;
    serviceType: unknown;
    status: unknown;
    symptom: unknown;
    createdAt: unknown;
  };
};
