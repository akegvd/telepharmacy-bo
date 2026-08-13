import DATA_ISSUE from '../enums/dataIssue';

export const mapDataIssueLabelByDataIssue: Record<DATA_ISSUE, string> = {
  [DATA_ISSUE.MISSING_NAME]: 'The customer name was missing from this request.',
  [DATA_ISSUE.UNKNOWN_SERVICE_TYPE]:
    "The service type wasn't recognized, so the raw value from the source data is shown.",
  [DATA_ISSUE.UNKNOWN_STATUS]: "The status wasn't recognized, so workflow actions are disabled for this request.",
  [DATA_ISSUE.MISSING_SYMPTOM]: 'No symptom description was provided.',
  [DATA_ISSUE.INVALID_DATE]: "The request date is missing or couldn't be parsed.",
};
