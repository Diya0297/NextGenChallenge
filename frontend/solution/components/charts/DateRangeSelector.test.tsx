import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DateRangeSelector from "./DateRangeSelector";
import PortfolioValueSection from "./PortfolioValueSection";
import {
  filterTimeSeriesByRange,
  type TimeSeriesPoint,
} from "./chartUtils";

describe("Task 6: DateRangeSelector Component", () => {
  it("satisfies Definition of Done: renders all 5 range options (1D, 1M, YTD, 1Y, All)", () => {
    const handleRangeChange = vi.fn();
    render(
      <DateRangeSelector
        selectedRange="All"
        onRangeChange={handleRangeChange}
      />
    );

    for (const option of ["1D", "1M", "YTD", "1Y", "All"]) {
      expect(screen.getByRole("button", { name: option })).toBeDefined();
    }
  });

  it("visually indicates the currently selected range with aria-pressed", () => {
    const handleRangeChange = vi.fn();
    render(
      <DateRangeSelector
        selectedRange="YTD"
        onRangeChange={handleRangeChange}
      />
    );

    const ytdBtn = screen.getByRole("button", { name: "YTD" });
    const allBtn = screen.getByRole("button", { name: "All" });

    expect(ytdBtn.getAttribute("aria-pressed")).toBe("true");
    expect(allBtn.getAttribute("aria-pressed")).toBe("false");
  });

  it("invokes onRangeChange callback when a pill option is clicked", () => {
    const handleRangeChange = vi.fn();
    render(
      <DateRangeSelector
        selectedRange="All"
        onRangeChange={handleRangeChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "1M" }));
    expect(handleRangeChange).toHaveBeenCalledWith("1M");

    fireEvent.click(screen.getByRole("button", { name: "1D" }));
    expect(handleRangeChange).toHaveBeenCalledWith("1D");
  });
});

describe("Task 6: filterTimeSeriesByRange utility & Edge Cases", () => {
  const multiYearData: TimeSeriesPoint[] = [
    { date: "2024-01-01", marketValue: 350000 },
    { date: "2024-06-01", marketValue: 380000 },
    { date: "2025-01-01", marketValue: 400000 },
    { date: "2025-05-01", marketValue: 420000 },
    { date: "2025-09-01", marketValue: 440000 },
    { date: "2025-09-30", marketValue: 450000 },
    { date: "2025-10-01", marketValue: 455000 },
  ];

  it("returns all points when 'All' is selected", () => {
    const res = filterTimeSeriesByRange(multiYearData, "All");
    expect(res.length).toBe(multiYearData.length);
  });

  it("filters for '1D' correctly and preserves at least 2 points if data permits", () => {
    const res = filterTimeSeriesByRange(multiYearData, "1D");
    expect(res.length).toBeGreaterThanOrEqual(2);
    expect(res[res.length - 1].date).toBe("2025-10-01");
  });

  it("filters for '1M' correctly by windowing within 1 month of latest date", () => {
    const res = filterTimeSeriesByRange(multiYearData, "1M");
    expect(res.every((pt) => pt.date >= "2025-09-01")).toBe(true);
    expect(res.some((pt) => pt.date === "2025-05-01")).toBe(false);
  });

  it("satisfies Edge Case: 'YTD' calculates from Jan 1 of current year, not dataset start date", () => {
    const res = filterTimeSeriesByRange(multiYearData, "YTD");
    expect(res.every((pt) => pt.date >= "2025-01-01")).toBe(true);
    expect(res.some((pt) => pt.date === "2024-01-01")).toBe(false);
    expect(res.some((pt) => pt.date === "2024-06-01")).toBe(false);
  });

  it("filters for '1Y' correctly", () => {
    const res = filterTimeSeriesByRange(multiYearData, "1Y");
    expect(res.every((pt) => pt.date >= "2024-10-01")).toBe(true);
  });

  it("satisfies Edge Case: gracefully falls back when dataset has less history than requested range", () => {
    const shortHistory: TimeSeriesPoint[] = [
      { date: "2025-08-01", marketValue: 400000 },
      { date: "2025-09-01", marketValue: 410000 },
    ];

    // Requested 1Y, but only 2 months of history exist
    const res = filterTimeSeriesByRange(shortHistory, "1Y");
    expect(res.length).toBe(2);
    expect(res).toEqual(shortHistory);
  });

  it("handles empty dataset without error", () => {
    const res = filterTimeSeriesByRange([], "1Y");
    expect(res).toEqual([]);
  });
});

describe("Task 6: Integration in PortfolioValueSection", () => {
  const dataset: TimeSeriesPoint[] = [
    { date: "2024-01-01", marketValue: 350000 },
    { date: "2024-06-01", marketValue: 380000 },
    { date: "2025-01-01", marketValue: 400000 },
    { date: "2025-05-01", marketValue: 420000 },
    { date: "2025-09-01", marketValue: 440000 },
    { date: "2025-10-01", marketValue: 450000 },
  ];

  it("updates chart when date range options are clicked", () => {
    render(<PortfolioValueSection initialData={dataset} />);

    // Initially "All" is active
    const allBtn = screen.getByRole("button", { name: "All" });
    expect(allBtn.getAttribute("aria-pressed")).toBe("true");

    // Click "1M"
    const oneMonthBtn = screen.getByRole("button", { name: "1M" });
    fireEvent.click(oneMonthBtn);
    expect(oneMonthBtn.getAttribute("aria-pressed")).toBe("true");
    expect(allBtn.getAttribute("aria-pressed")).toBe("false");

    // Click "YTD"
    const ytdBtn = screen.getByRole("button", { name: "YTD" });
    fireEvent.click(ytdBtn);
    expect(ytdBtn.getAttribute("aria-pressed")).toBe("true");
    expect(oneMonthBtn.getAttribute("aria-pressed")).toBe("false");

    // Click "1D"
    const oneDayBtn = screen.getByRole("button", { name: "1D" });
    fireEvent.click(oneDayBtn);
    expect(oneDayBtn.getAttribute("aria-pressed")).toBe("true");
  });
});
