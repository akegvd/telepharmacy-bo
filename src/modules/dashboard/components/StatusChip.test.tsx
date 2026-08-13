import { render, screen } from "@testing-library/react";

import { TStatus } from "../types/task";

import { StatusChip } from "./StatusChip";

describe("StatusChip", () => {
  it.each<[TStatus, string]>([
    ["new", "New"],
    ["in_progress", "In progress"],
    ["completed", "Completed"],
  ])("renders the label for status %s", (status, label) => {
    render(<StatusChip status={status} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("matches snapshot for each status", () => {
    const statuses: TStatus[] = ["new", "in_progress", "completed"];

    statuses.forEach((status) => {
      const { container, unmount } = render(<StatusChip status={status} />);
      expect(container).toMatchSnapshot(status);
      unmount();
    });
  });
});
