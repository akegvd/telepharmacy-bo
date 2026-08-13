import { render, screen } from "@testing-library/react";

import { makeTask } from "../mocks/taskFixtures";

import { SummaryBar } from "./SummaryBar";

describe("SummaryBar", () => {
  it("counts tasks per status", () => {
    render(
      <SummaryBar
        tasks={[
          makeTask({ id: "1", status: "new" }),
          makeTask({ id: "2", status: "new" }),
          makeTask({ id: "3", status: "in_progress" }),
          makeTask({ id: "4", status: "completed" }),
        ]}
      />,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows zero counts for every status when there are no tasks", () => {
    render(<SummaryBar tasks={[]} />);

    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(3);
  });
});
