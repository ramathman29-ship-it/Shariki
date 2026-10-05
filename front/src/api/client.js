import { session } from "@/lib/session";

export const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
export const API_ORIGIN = API_URL.replace(/\/api$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, errors = {}, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors; // Laravel validation errors: { field: [messages] }
    this.data = data;
  }

  get isNetwork() {
    return this.status === 0;
  }
}

/**
 * fetch wrapper for the Laravel API: JSON in/out, bearer token, uniform errors.
 * Throws ApiError for network failures, non-2xx responses and `{ success: false }`.
 */
export async function request(path, { method = "GET", body, headers, signal } = {}) {
  const token = session.getToken();
  const isForm = body instanceof FormData;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body && !isForm && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body && !isForm ? JSON.stringify(body) : body,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("network", { status: 0 });
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token) {
    window.dispatchEvent(new Event("auth:expired"));
  }

  if (!res.ok || data?.success === false) {
    throw new ApiError(data?.message || res.statusText || "Request failed", {
      status: res.status,
      errors: data?.errors || {},
      data,
    });
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

/** First message per field, e.g. { email: "The email has already been taken." } */
export const fieldErrors = (err) =>
  Object.fromEntries(Object.entries(err?.errors || {}).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
