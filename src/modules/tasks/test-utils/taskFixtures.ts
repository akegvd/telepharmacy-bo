import { NormalizedTask } from "../types/task";

export function makeTask(overrides: Partial<NormalizedTask> = {}): NormalizedTask {
  return {
    id: "1",
    customerName: "Somchai P.",
    serviceType: "video_call",
    symptom: "Persistent dry cough",
    status: "new",
    createdAt: "2026-08-09T09:12:00.000Z",
    issues: [],
    raw: {
      customerName: "Somchai P.",
      serviceType: "video_call",
      symptom: "Persistent dry cough",
      status: "new",
      createdAt: "2026-08-09T09:12:00.000Z",
    },
    ...overrides,
  };
}
