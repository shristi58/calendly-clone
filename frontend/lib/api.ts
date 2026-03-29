import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ── Silent refresh mutex ────────────────────────────────────────
// Ensures only one refresh request runs at a time.
// All concurrent 401'd requests queue behind it.
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: Error | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(undefined);
  });
  refreshQueue = [];
}

async function silentRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    return true;
  } catch {
    return false;
  }
}

// ── Core API client ─────────────────────────────────────────────
async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // send cookies on every request
  });

  // Handle 401 — attempt silent refresh (once)
  if (res.status === 401 && !_isRetry) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshed = await silentRefresh();
      isRefreshing = false;

      if (refreshed) {
        processQueue(null);
        // Retry the original request with the new cookies
        return apiClient<T>(endpoint, options, true);
      } else {
        processQueue(new ApiError("Session expired", 401));
        // Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new ApiError("Session expired", 401);
      }
    } else {
      // Another refresh is in progress — wait for it
      return new Promise<T>((resolve, reject) => {
        refreshQueue.push({
          resolve: () => resolve(apiClient<T>(endpoint, options, true)),
          reject,
        });
      });
    }
  }

  // Handle 204 No Content (e.g., DELETE)
  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    let message = json.message;
    if (!message && json.errors && Array.isArray(json.errors)) {
      message = json.errors.map((e: any) => e.message).join(", ");
    }
    throw new ApiError(message || "Something went wrong", res.status);
  }

  return json.data;
}

// Convenience methods
export const api = {
  get: <T>(url: string) => apiClient<T>(url),

  post: <T>(url: string, data?: unknown) =>
    apiClient<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data: unknown) =>
    apiClient<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(url: string, data?: unknown) =>
    apiClient<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string) =>
    apiClient<T>(url, {
      method: "DELETE",
    }),
};

/**
 * Wrapper that catches API errors and shows a toast.
 */
export async function apiWithToast<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : errorMessage || "An unexpected error occurred";
    toast.error(message);
    return undefined;
  }
}
