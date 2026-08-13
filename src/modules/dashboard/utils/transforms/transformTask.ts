import dayjs from 'dayjs';

import { TDataIssue, SERVICE_TYPES, STATUSES, UNKNOWN_SERVICE_TYPE } from '../../types/task';
import { ITransformTask, ITransformTasksResponse } from '../../types/utils/transforms/transformTask';

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

/**
 * json-server hands back whatever is in db.json verbatim, including the
 * intentionally-broken rows (null names, unknown enum values, unparsable
 * dates, blank symptoms). Rather than let those crash a render or show up
 * as "undefined"/"Invalid Date", every field is repaired to a safe fallback
 * here, once, at the API boundary — and the repair is recorded in `issues`
 * so the UI can flag it instead of hiding it.
 */
export function transformTask(input: unknown): ITransformTask | null {
  if (typeof input !== 'object' || input === null) return null;

  const raw = input as Record<string, unknown>;
  const id = raw.id;
  if (!isNonEmptyString(id) && typeof id !== 'number') return null;

  const issues: TDataIssue[] = [];

  const customerName = isNonEmptyString(raw.customerName)
    ? raw.customerName.trim()
    : (issues.push('missing_name'), 'Unknown customer');

  const serviceType = (SERVICE_TYPES as readonly string[]).includes(raw.serviceType as string)
    ? (raw.serviceType as ITransformTask['serviceType'])
    : (issues.push('unknown_service_type'), UNKNOWN_SERVICE_TYPE);

  const status = (STATUSES as readonly string[]).includes(raw.status as string)
    ? (raw.status as ITransformTask['status'])
    : (issues.push('unknown_status'), 'new');

  const symptom = isNonEmptyString(raw.symptom)
    ? raw.symptom.trim()
    : (issues.push('missing_symptom'), 'No symptom description provided.');

  const createdAtMs =
    isNonEmptyString(raw.createdAt) && dayjs(raw.createdAt).isValid()
      ? raw.createdAt
      : (issues.push('invalid_date'), null);

  return {
    id: String(id),
    customerName,
    displayCustomerName: customerName,
    serviceType,
    displayServiceType: serviceType,
    status,
    displayStatus: status,
    displaySymptom: symptom,
    displayCreatedAt: createdAtMs,
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

/** Transforms a raw task list response and drops duplicate ids (keeping the first occurrence). */
export function transformTasksResponse(input: unknown): ITransformTasksResponse {
  const list = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const tasks: ITransformTask[] = [];

  for (const item of list) {
    const task = transformTask(item);
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
