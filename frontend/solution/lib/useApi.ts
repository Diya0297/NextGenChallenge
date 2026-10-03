import { useEffect, useState } from "react";
import { getJson } from "./api";

export type ApiState<T> =
  | { status: "loading" }
  | { status: "error"; error: string; retry: () => void }
  | { status: "success"; data: T };

// Fetches JSON whenever `url` changes. Pass null to wait (e.g. until an account is known).
export function useApi<T>(url: string | null): ApiState<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data?: T;
    error?: string;
  } | null>(null);

  // The result only counts if it belongs to the current url and attempt.
  const key = `${url}#${attempt}`;

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    getJson<T>(url, controller.signal).then(
      (data) => setResult({ key, data }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setResult({ key, error: message });
      },
    );

    // Cancel the request if the url changes before it finishes.
    return () => controller.abort();
  }, [url, key]);

  if (!url || result?.key !== key) return { status: "loading" };

  if (result.error !== undefined) {
    return {
      status: "error",
      error: result.error,
      retry: () => setAttempt((count) => count + 1),
    };
  }

  return { status: "success", data: result.data as T };
}
