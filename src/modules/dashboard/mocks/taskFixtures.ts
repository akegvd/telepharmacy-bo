import { ITransformTask } from "../types/utils/transforms/transformTask";

const DEFAULTS: ITransformTask = {
  id: "1",
  customerName: "Somchai P.",
  displayCustomerName: "Somchai P.",
  serviceType: "video_call",
  displayServiceType: "video_call",
  status: "new",
  displayStatus: "new",
  displaySymptom: "Persistent dry cough",
  displayCreatedAt: "2026-08-09T09:12:00.000Z",
  issues: [],
  raw: {
    customerName: "Somchai P.",
    serviceType: "video_call",
    symptom: "Persistent dry cough",
    status: "new",
    createdAt: "2026-08-09T09:12:00.000Z",
  },
};

export function makeTask(overrides: Partial<ITransformTask> = {}): ITransformTask {
  const task: ITransformTask = { ...DEFAULTS, ...overrides };

  if (overrides.customerName && !overrides.displayCustomerName) {
    task.displayCustomerName = overrides.customerName;
  }
  if (overrides.serviceType && !overrides.displayServiceType) {
    task.displayServiceType = overrides.serviceType;
  }
  if (overrides.status && !overrides.displayStatus) {
    task.displayStatus = overrides.status;
  }

  if (!overrides.raw) {
    task.raw = {
      customerName: task.customerName,
      serviceType: task.serviceType,
      symptom: task.displaySymptom,
      status: task.status,
      createdAt: task.displayCreatedAt,
    };
  }

  return task;
}
