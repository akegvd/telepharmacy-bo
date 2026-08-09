import { render, screen } from "@testing-library/react";

import { TaskCard } from "./TaskCard";
import { makeTask } from "../test-utils/taskFixtures";

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
