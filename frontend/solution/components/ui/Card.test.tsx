import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("Card", () => {
  it("shows its title as a heading", () => {
    render(<Card title="Portfolio Summary">content</Card>);

    expect(
      screen.getByRole("heading", { name: "Portfolio Summary" }),
    ).toBeDefined();
  });

  it("shows whatever is placed inside it", () => {
    render(
      <Card title="Holdings">
        <p>No holdings to display</p>
      </Card>,
    );

    expect(screen.getByText("No holdings to display")).toBeDefined();
  });

  it("keeps an extra class so the page can place it in the grid", () => {
    render(
      <Card title="Top Movers" className="movers">
        content
      </Card>,
    );

    const section = screen.getByRole("region", { name: "Top Movers" });
    expect(section.className).toContain("movers");
  });
});
