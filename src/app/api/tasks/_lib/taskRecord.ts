/** Deliberately loose: db.json carries deformed rows the dashboard is meant to flag. */
export interface ITaskRecord {
  id: unknown;
  [key: string]: unknown;
}
