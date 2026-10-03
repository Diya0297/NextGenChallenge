import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders as the page banner", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeDefined();
  });

  it("has slots for the account selector and the currency toggle", () => {
    render(<Header />);

    expect(screen.getByText("Account selector")).toBeDefined();
    expect(screen.getByText("CAD / USD")).toBeDefined();
  });
});
