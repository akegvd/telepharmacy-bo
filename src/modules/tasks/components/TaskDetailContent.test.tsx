import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { fetchTask, updateTaskStatus } from "../services/taskApi";
import { makeTask } from "../test-utils/taskFixtures";

jest.mock("../services/taskApi");

const mockFetchTask = fetchTask as jest.MockedFunction<typeof fetchTask>;
const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

import { TaskDetailContent } from "./TaskDetailContent";

function renderDetail(id: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskDetailContent id={id} />
    </QueryClientProvider>,
  );
}

describe("TaskDetailContent", () => {
  beforeEach(() => {
    mockFetchTask.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it("shows a loading skeleton before the task resolves", () => {
    mockFetchTask.mockReturnValue(new Promise(() => {}));

    const { container } = renderDetail("1");

    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("renders the task once loaded", async () => {
    mockFetchTask.mockResolvedValue(makeTask({ id: "1", customerName: "Somchai P.", status: "new" }));

    renderDetail("1");

    expect(await screen.findByText("Somchai P.")).toBeInTheDocument();
    expect(screen.getByText("Persistent dry cough")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Advance to In progress" })).toBeInTheDocument();
  });

  it("shows an error state when the task can't be found", async () => {
    mockFetchTask.mockRejectedValue(new Error("not found"));

    renderDetail("missing");

    expect(await screen.findByText("This request could not be found.")).toBeInTheDocument();
  });

  it("shows the completed message with no advance action for a completed task", async () => {
    mockFetchTask.mockResolvedValue(makeTask({ id: "1", status: "completed" }));

    renderDetail("1");

    await screen.findByText("This request has been completed.");
    expect(screen.queryByRole("button", { name: /Advance to/ })).not.toBeInTheDocument();
  });

  it("advances the task status when the button is clicked", async () => {
    const user = userEvent.setup();
    mockFetchTask.mockResolvedValue(makeTask({ id: "1", status: "new" }));
    mockUpdateTaskStatus.mockResolvedValue(makeTask({ id: "1", status: "in_progress" }));

    renderDetail("1");

    const button = await screen.findByRole("button", { name: "Advance to In progress" });
    await user.click(button);

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith("1", "in_progress");
    await screen.findByRole("button", { name: "Advance to Completed" });
  });

  it("shows an error message when the status update fails", async () => {
    const user = userEvent.setup();
    mockFetchTask.mockResolvedValue(makeTask({ id: "1", status: "new" }));
    mockUpdateTaskStatus.mockRejectedValue(new Error("network error"));

    renderDetail("1");

    const button = await screen.findByRole("button", { name: "Advance to In progress" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Couldn't update the status. Please try again.")).toBeInTheDocument();
    });
  });
});
