export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Mock API test options that can be passed through from the page URL,
// e.g. http://localhost:3000/?scenario=negative or ?fail=true
const MOCK_OPTIONS = ["scenario", "delayMs", "fail"];

export function pickMockOptions(params: URLSearchParams | null): string {
  const picked = new URLSearchParams();
  for (const name of MOCK_OPTIONS) {
    const value = params?.get(name);
    if (value) picked.set(name, value);
  }
  return picked.toString();
}

export function apiUrl(path: string, mockOptions = ""): string {
  return `${API_BASE_URL}${path}${mockOptions ? `?${mockOptions}` : ""}`;
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error(
      "Can't reach the portfolio service. Is the mock server running?",
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}
