import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DateRangeSelector from "./DateRangeSelector";
import {
  filterTimeSeriesByRange,
  type TimeSeriesPoint,
} from "./chartUtils";

describe("DateRangeSelector Component", () => {
  it("renders all 5 range options", () => {
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

  it("marks the active range as aria-pressed", () => {
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

  it("invokes onRangeChange callback on click", () => {
    const handleRangeChange = vi.fn();
    render(
      <DateRangeSelector
        selectedRange="All"
        onRangeChange={handleRangeChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "1M" }));
    expect(handleRangeChange).toHaveBeenCalledWith("1M");
  });
});

describe("filterTimeSeriesByRange utility", () => {
  // 400-day series ending on 2025-10-01
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

  it("filters for '1D' correctly", () => {
    const res = filterTimeSeriesByRange(multiYearData, "1D");
    expect(res.length).toBeGreaterThanOrEqual(2);
    expect(res[res.length - 1].date).toBe("2025-10-01");
  });

  it("filters for '1M' correctly", () => {
    const res = filterTimeSeriesByRange(multiYearData, "1M");
    // Should include points from 2025-09-01 onwards
    expect(res.every((pt) => pt.date >= "2025-09-01")).toBe(true);
  });

  it("filters for 'YTD' calculating from Jan 1 of current reference year", () => {
    const res = filterTimeSeriesByRange(multiYearData, "YTD");
    expect(res.every((pt) => pt.date >= "2025-01-01")).toBe(true);
    expect(res.some((pt) => pt.date === "2024-06-01")).toBe(false);
  });

  it("gracefully falls back when dataset has less history than requested range", () => {
    // Only 2 points (2 months) of data
    const shortHistory: TimeSeriesPoint[] = [
      { date: "2025-08-01", marketValue: 400000 },
      { date: "2025-09-01", marketValue: 410000 },
    ];

    // Requested 1Y, but only 2 months exist
    const res = filterTimeSeriesByRange(shortHistory, "1Y");
    expect(res.length).toBe(2);
  });

  it("handles empty dataset without error", () => {
    const res = filterTimeSeriesByRange([], "1Y");
    expect(res).toEqual([]);
  });
});
