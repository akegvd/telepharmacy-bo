import DATA_ISSUE from '../../../enums/dataIssue';

/**
 * Output of `transformTask`. `serviceType`/`status` hold the raw source value verbatim
 * (trimmed, or '' if absent) — there's no separate "unknown" sentinel value. Whether a value
 * is recognized is decided by looking it up in `mapDisplayServiceTypeLabelByServiceType`/
 * `mapDisplayStatusLabelByStatus` (`constants/`): present as a key there means known, missing means unknown.
 *
 * Fields come in two flavors:
 * - plain name (`status`, `serviceType`, `customerName`): meant for conditions/business logic
 *   (filtering, workflow lookups, equality checks).
 * - `display`-prefixed (`displayStatus`, `displaySymptom`, ...): meant to be rendered by the
 *   UI. Present even when it holds the same value as the plain field — the prefix documents
 *   *how* a call site is using it, not just what it contains. See AGENTS.md for the full
 *   convention.
 */
export interface ITransformTask {
  id: string;
  customerName: string;
  displayCustomerName: string;
  serviceType: string;
  displayServiceType: string;
  status: string;
  displayStatus: string;
  displaySymptom: string;
  /** Unparseable or missing createdAt becomes null instead of an "Invalid Date". */
  displayCreatedAt: string | null;
  issues: DATA_ISSUE[];
  raw: {
    customerName: unknown;
    serviceType: unknown;
    status: unknown;
    symptom: unknown;
    createdAt: unknown;
  };
}
