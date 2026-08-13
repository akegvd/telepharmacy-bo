import { TDataIssue, TNormalizedServiceType, TStatus } from '../../task';

/**
 * Output of `transformTask`. Fields come in two flavors:
 * - plain name (`status`, `serviceType`, `customerName`): raw value, meant for
 *   conditions/business logic (filtering, workflow lookups, equality checks).
 * - `display`-prefixed (`displayStatus`, `displaySymptom`, ...): meant to be
 *   rendered by the UI. Present even when it holds the same value as the raw
 *   field — the prefix documents *how* a call site is using it, not just what
 *   it contains. See AGENTS.md for the full convention.
 */
export interface ITransformTask {
  id: string;
  customerName: string;
  displayCustomerName: string;
  serviceType: TNormalizedServiceType;
  displayServiceType: TNormalizedServiceType;
  status: TStatus;
  displayStatus: TStatus;
  displaySymptom: string;
  /** Unparseable createdAt becomes null instead of an "Invalid Date". */
  displayCreatedAt: string | null;
  issues: TDataIssue[];
  raw: {
    customerName: unknown;
    serviceType: unknown;
    status: unknown;
    symptom: unknown;
    createdAt: unknown;
  };
}

/** Output of `transformTasksResponse`. */
export interface ITransformTasksResponse {
  tasks: ITransformTask[];
  duplicateIds: string[];
}
