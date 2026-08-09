import { render, screen } from "@testing-library/react";

import { TaskCard } from "../TaskCard";
import { NormalizedTask } from "../../types/task";

function makeTask(overrides: Partial<NormalizedTask> = {}): NormalizedTask {
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

describe("TaskCard", () => {
  it("shows the customer name, status, and symptom", () => {
    render(<TaskCard task={makeTask()} />);

    expect(screen.getByText("Somchai P.")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText(/Persistent dry cough/)).toBeInTheDocument();
  });

  it("links to the task's detail route", () => {
    render(<TaskCard task={makeTask({ id: "42" })} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/task/42");
  });

  it("shows a data-issue warning icon only when the task has flagged issues", () => {
    const { rerender } = render(<TaskCard task={makeTask({ issues: [] })} />);
    expect(screen.queryByTestId("data-issue-warning")).not.toBeInTheDocument();

    rerender(
      <TaskCard
        task={makeTask({ customerName: "Unknown customer", issues: ["missing_name"] })}
      />,
    );
    expect(screen.getByTestId("data-issue-warning")).toBeInTheDocument();
  });
});
