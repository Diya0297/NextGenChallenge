import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Remove rendered components between tests so they don't leak into each other.
afterEach(() => {
  cleanup();
});
