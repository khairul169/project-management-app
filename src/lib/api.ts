//
export const API_BASEURL = "http://localhost:3000";

type FetchOptions = Omit<RequestInit, "method" | "body"> & {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: object;
  body?: any;
};

export async function fetchAPI<T = any>(path: string, opts: FetchOptions = {}) {
  const url = new URL(path, API_BASEURL);
  if (opts.params) {
    for (const [key, value] of Object.entries(opts.params)) {
      url.searchParams.set(key, value);
    }
  }

  if (opts.body) {
    opts.body = JSON.stringify(opts.body);
    opts.headers = {
      ...opts.headers,
      "Content-Type": "application/json",
    };
  }

  const res = await fetch(url, opts);

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    const message = json?.message || res.statusText;
    throw new APIError(message, res.status);
  }

  const json = (await res.json()) as any;
  if (!("data" in json)) {
    throw new APIError("Unknown response");
  }

  return json.data as T;
}

export class APIError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}
