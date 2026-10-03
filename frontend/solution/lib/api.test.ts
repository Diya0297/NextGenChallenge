import { afterEach, describe, expect, it, vi } from "vitest";
import { apiUrl, getJson, pickMockOptions } from "./api";

describe("pickMockOptions", () => {
  it("keeps only the mock API's test options from the page URL", () => {
    const params = new URLSearchParams("scenario=empty&fail=true&tab=holdings");
    expect(pickMockOptions(params)).toBe("scenario=empty&fail=true");
  });

  it("returns nothing when there are no options", () => {
    expect(pickMockOptions(null)).toBe("");
  });
});

describe("apiUrl", () => {
  it("adds the options to the mock API address", () => {
    expect(apiUrl("/accounts")).toBe("http://localhost:4000/accounts");
    expect(apiUrl("/accounts", "scenario=empty")).toBe(
      "http://localhost:4000/accounts?scenario=empty",
    );
  });
});

describe("getJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the API's error message when a request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({ message: "Service unavailable" }, { status: 503 }),
      ),
    );

    await expect(getJson("http://localhost:4000/accounts")).rejects.toThrow(
      "Service unavailable",
    );
  });

  it("explains when the mock server can't be reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    await expect(getJson("http://localhost:4000/accounts")).rejects.toThrow(
      "Is the mock server running?",
    );
  });
});
