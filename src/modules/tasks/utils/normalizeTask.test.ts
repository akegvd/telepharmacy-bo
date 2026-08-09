import { normalizeTask, normalizeTasks } from "./normalizeTask";

describe("normalizeTask", () => {
  it("passes clean data through unchanged with no issues", () => {
    const result = normalizeTask({
      id: "1",
      customerName: "Somchai P.",
      serviceType: "video_call",
      symptom: "Persistent dry cough",
      status: "new",
      createdAt: "2026-08-09T09:12:00.000Z",
    });

    expect(result).toMatchObject({
      id: "1",
      customerName: "Somchai P.",
      serviceType: "video_call",
      symptom: "Persistent dry cough",
      status: "new",
      createdAt: "2026-08-09T09:12:00.000Z",
      issues: [],
    });
  });

  it("falls back a missing customerName instead of rendering null/undefined", () => {
    const result = normalizeTask({
      id: "7",
      customerName: null,
      serviceType: "voice_call",
      symptom: "Headache",
      status: "new",
      createdAt: "2026-08-09T11:18:00.000Z",
    });

    expect(result?.customerName).toBe("Unknown customer");
    expect(result?.issues).toContain("missing_name");
  });

  it("flags an unrecognized serviceType instead of mislabeling it", () => {
    const result = normalizeTask({
      id: "8",
      customerName: "Niran D.",
      serviceType: "phone_call",
      symptom: "Fever",
      status: "new",
      createdAt: "2026-08-09T06:47:00.000Z",
    });

    expect(result?.serviceType).toBe("unknown");
    expect(result?.issues).toContain("unknown_service_type");
  });

  it("resets an unrecognized status to 'new' rather than crashing the workflow", () => {
    const result = normalizeTask({
      id: "9",
      customerName: "Suda R.",
      serviceType: "video_call",
      symptom: "Follow-up",
      status: "pending_review",
      createdAt: "2026-08-08T09:00:00.000Z",
    });

    expect(result?.status).toBe("new");
    expect(result?.issues).toContain("unknown_status");
  });

  it("turns an unparseable createdAt into null instead of 'Invalid Date'", () => {
    const result = normalizeTask({
      id: "11",
      customerName: "Kanya H.",
      serviceType: "voice_call",
      symptom: "Nausea",
      status: "in_progress",
      createdAt: "not-a-real-date",
    });

    expect(result?.createdAt).toBeNull();
    expect(result?.issues).toContain("invalid_date");
  });

  it("returns null for a record with no usable id", () => {
    expect(normalizeTask({ customerName: "No id" })).toBeNull();
  });
});

describe("normalizeTasks", () => {
  it("drops duplicate ids, keeping the first occurrence, and reports them", () => {
    const { tasks, duplicateIds } = normalizeTasks([
      { id: "1", customerName: "First", serviceType: "chat", symptom: "a", status: "new", createdAt: "2026-08-09T09:00:00.000Z" },
      { id: "1", customerName: "Duplicate", serviceType: "chat", symptom: "b", status: "new", createdAt: "2026-08-09T10:00:00.000Z" },
    ]);

    expect(tasks).toHaveLength(1);
    expect(tasks[0].customerName).toBe("First");
    expect(duplicateIds).toEqual(["1"]);
  });

  it("ignores entries that aren't objects", () => {
    const { tasks } = normalizeTasks([null, "not a task", 42]);
    expect(tasks).toHaveLength(0);
  });
});
