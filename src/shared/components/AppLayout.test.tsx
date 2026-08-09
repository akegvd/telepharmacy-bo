import { render, screen } from "@testing-library/react";

let pathname = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

import { AppLayout } from "./AppLayout";

describe("AppLayout", () => {
  beforeEach(() => {
    pathname = "/";
  });

  it("renders the sidebar navigation and the page content", () => {
    render(
      <AppLayout>
        <p>Page content</p>
      </AppLayout>,
    );

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("marks the Dashboard nav item as selected when on the dashboard route", () => {
    pathname = "/";
    render(
      <AppLayout>
        <p>Page content</p>
      </AppLayout>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveClass("Mui-selected");
  });

  it("does not mark the Dashboard nav item as selected on other routes", () => {
    pathname = "/task/123";
    render(
      <AppLayout>
        <p>Page content</p>
      </AppLayout>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveClass("Mui-selected");
  });
});
