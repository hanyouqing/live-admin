const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

function authHeader(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeader(), ...(init.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || res.statusText);
  return data as T;
}

export const adminApi = {
  login: (login: string, password: string) =>
    request<{ access_token: string; user: { role: string; username: string } }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    }),
  stats: () => request<Record<string, number>>("/api/v1/admin/stats"),
  users: () => request<{ items: any[] }>("/api/v1/admin/users"),
  setStatus: (id: string, status: string) =>
    request(`/api/v1/admin/users/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }),
  rooms: () => request<{ items: any[] }>("/api/v1/admin/rooms"),
  forceEnd: (id: string) => request(`/api/v1/admin/rooms/${id}/force-end`, { method: "POST" }),
  reports: () => request<{ items: any[] }>("/api/v1/admin/reports"),
  resolveReport: (id: string) =>
    request(`/api/v1/admin/reports/${id}/resolve`, { method: "POST", body: JSON.stringify({ status: "resolved" }) }),
  cases: () => request<{ items: any[] }>("/api/v1/admin/cases?status=pending"),
  resolveCase: (id: string, status: string) =>
    request(`/api/v1/admin/cases/${id}/resolve`, { method: "POST", body: JSON.stringify({ status }) }),
  keywords: () => request<{ items: { word: string; action: string }[] }>("/api/v1/admin/keywords"),
  addKeyword: (word: string, action = "block") =>
    request(`/api/v1/admin/keywords`, { method: "POST", body: JSON.stringify({ word, action }) }),
  deleteKeyword: (word: string) => request(`/api/v1/admin/keywords/${encodeURIComponent(word)}`, { method: "DELETE" }),
};

export function saveAdminToken(token: string) {
  localStorage.setItem("admin_token", token);
}
export function clearAdminToken() {
  localStorage.removeItem("admin_token");
}
export function hasAdminToken() {
  return typeof window !== "undefined" && !!localStorage.getItem("admin_token");
}
