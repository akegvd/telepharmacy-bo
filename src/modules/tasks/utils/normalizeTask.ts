import {
  DataIssue,
  NormalizedTask,
  SERVICE_TYPES,
  STATUSES,
  UNKNOWN_SERVICE_TYPE,
} from "../types/task";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * json-server hands back whatever is in db.json verbatim, including the
 * intentionally-broken rows (null names, unknown enum values, unparsable
 * dates, blank symptoms). Rather than let those crash a render or show up
 * as "undefined"/"Invalid Date", every field is repaired to a safe fallback
 * here, once, at the API boundary — and the repair is recorded in `issues`
 * so the UI can flag it instead of hiding it.
 */
export function normalizeTask(input: unknown): NormalizedTask | null {
  if (typeof input !== "object" || input === null) return null;

  const raw = input as Record<string, unknown>;
  const id = raw.id;
  if (!isNonEmptyString(id) && typeof id !== "number") return null;

  const issues: DataIssue[] = [];

  const customerName = isNonEmptyString(raw.customerName)
    ? raw.customerName.trim()
    : (issues.push("missing_name"), "Unknown customer");

  const serviceType = (SERVICE_TYPES as readonly string[]).includes(
    raw.serviceType as string,
  )
    ? (raw.serviceType as NormalizedTask["serviceType"])
    : (issues.push("unknown_service_type"), UNKNOWN_SERVICE_TYPE);

  const status = (STATUSES as readonly string[]).includes(raw.status as string)
    ? (raw.status as NormalizedTask["status"])
    : (issues.push("unknown_status"), "new");

  const symptom = isNonEmptyString(raw.symptom)
    ? raw.symptom.trim()
    : (issues.push("missing_symptom"), "No symptom description provided.");

  const createdAtMs =
    isNonEmptyString(raw.createdAt) && !Number.isNaN(Date.parse(raw.createdAt))
      ? raw.createdAt
      : (issues.push("invalid_date"), null);

  return {
    id: String(id),
    customerName,
    serviceType,
    status,
    symptom,
    createdAt: createdAtMs,
    issues,
    raw: {
      customerName: raw.customerName,
      serviceType: raw.serviceType,
      status: raw.status,
      symptom: raw.symptom,
      createdAt: raw.createdAt,
    },
  };
}

export type NormalizeTasksResult = {
  tasks: NormalizedTask[];
  duplicateIds: string[];
};

/** Normalizes a raw task list and drops duplicate ids (keeping the first occurrence). */
export function normalizeTasks(input: unknown): NormalizeTasksResult {
  const list = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const tasks: NormalizedTask[] = [];

  for (const item of list) {
    const task = normalizeTask(item);
    if (!task) continue;
    if (seen.has(task.id)) {
      duplicateIds.push(task.id);
      continue;
    }
    seen.add(task.id);
    tasks.push(task);
  }

  return { tasks, duplicateIds };
}
