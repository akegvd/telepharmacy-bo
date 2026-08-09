import { render, screen } from "@testing-library/react";

import { TaskList } from "./TaskList";
import { makeTask } from "../test-utils/taskFixtures";

function mockMatchMedia(matches: boolean) {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

describe("TaskList", () => {
  it("renders a card for each task", () => {
    const tasks = [
      makeTask({ id: "1", customerName: "Somchai P." }),
      makeTask({ id: "2", customerName: "Nutcha R." }),
    ];

    render(<TaskList tasks={tasks} />);

    expect(screen.getByText("Somchai P.")).toBeInTheDocument();
    expect(screen.getByText("Nutcha R.")).toBeInTheDocument();
  });

  it("renders no cards when there are no tasks", () => {
    render(<TaskList tasks={[]} />);

    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("groups tasks into rows using the responsive column count", () => {
    const original = window.matchMedia;
    window.matchMedia = mockMatchMedia(true); // simulate an md+ viewport -> 3 columns

    const tasks = Array.from({ length: 3 }, (_, index) =>
      makeTask({ id: String(index), customerName: `Task ${index}` }),
    );

    const { container } = render(<TaskList tasks={tasks} />);

    const row = container.querySelector('[data-index="0"]');
    expect(row).toHaveStyle({ gridTemplateColumns: "repeat(3, 1fr)" });

    window.matchMedia = original;
  });
});
