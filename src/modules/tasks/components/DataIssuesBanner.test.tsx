import { render, screen } from "@testing-library/react";

import { DataIssuesBanner } from "./DataIssuesBanner";
import { makeTask } from "../test-utils/taskFixtures";

describe("DataIssuesBanner", () => {
  it("renders nothing when there are no flagged issues or duplicates", () => {
    const { container } = render(
      <DataIssuesBanner tasks={[makeTask({ issues: [] })]} duplicateIds={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("uses singular wording for exactly one flagged record", () => {
    render(
      <DataIssuesBanner tasks={[makeTask({ issues: ["missing_name"] })]} duplicateIds={[]} />,
    );

    expect(screen.getByText(/1 request had missing or invalid data and was shown/)).toBeInTheDocument();
  });

  it("uses plural wording for multiple flagged records", () => {
    render(
      <DataIssuesBanner
        tasks={[
          makeTask({ id: "1", issues: ["missing_name"] }),
          makeTask({ id: "2", issues: ["invalid_date"] }),
        ]}
        duplicateIds={[]}
      />,
    );

    expect(screen.getByText(/2 requests had missing or invalid data and were shown/)).toBeInTheDocument();
  });

  it("reports duplicate ids", () => {
    render(<DataIssuesBanner tasks={[makeTask()]} duplicateIds={["1", "2"]} />);

    expect(screen.getByText(/2 duplicate records \(id: 1, 2\) were hidden/)).toBeInTheDocument();
  });
});
