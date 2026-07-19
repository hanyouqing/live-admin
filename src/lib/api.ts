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

function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const adminApi = {
  login: (login: string, password: string) =>
    request<{ access_token: string; user: { role: string; username: string } }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    }),
  stats: () => request<Record<string, number>>("/api/v1/admin/stats"),
  features: () => request<{ features: Record<string, boolean>; note: string }>("/api/v1/admin/features"),

  users: (q = "") => request<{ items: any[] }>(`/api/v1/admin/users${qs({ q })}`),
  setStatus: (id: string, status: string) =>
    request(`/api/v1/admin/users/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }),
  setRole: (id: string, role: string) =>
    request(`/api/v1/admin/users/${id}/role`, { method: "POST", body: JSON.stringify({ role }) }),

  rooms: (opts: { q?: string; status?: string } = {}) =>
    request<{ items: any[] }>(`/api/v1/admin/rooms${qs(opts)}`),
  forceEnd: (id: string) => request(`/api/v1/admin/rooms/${id}/force-end`, { method: "POST" }),
  setNotice: (id: string, notice: string) =>
    request(`/api/v1/admin/rooms/${id}/notice`, { method: "POST", body: JSON.stringify({ notice }) }),
  kick: (roomId: string, userId: string) =>
    request(`/api/v1/admin/rooms/${roomId}/kick`, { method: "POST", body: JSON.stringify({ user_id: userId }) }),
  mute: (roomId: string, userId: string, muted = true) =>
    request(`/api/v1/admin/rooms/${roomId}/mute`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, muted }),
    }),

  reports: (status = "") => request<{ items: any[] }>(`/api/v1/admin/reports${qs({ status })}`),
  resolveReport: (id: string, opts: { status?: string; force_end?: boolean; ban_host?: boolean } = {}) =>
    request(`/api/v1/admin/reports/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify({ status: "resolved", ...opts }),
    }),

  cases: (status = "pending") => request<{ items: any[] }>(`/api/v1/admin/cases${qs({ status })}`),
  resolveCase: (id: string, status: string, resolution = "") =>
    request(`/api/v1/admin/cases/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify({ status, resolution }),
    }),
  keywords: () => request<{ items: { word: string; action: string }[] }>("/api/v1/admin/keywords"),
  addKeyword: (word: string, action = "block") =>
    request(`/api/v1/admin/keywords`, { method: "POST", body: JSON.stringify({ word, action }) }),
  deleteKeyword: (word: string) =>
    request(`/api/v1/admin/keywords/${encodeURIComponent(word)}`, { method: "DELETE" }),

  gifts: () => request<{ items: any[] }>("/api/v1/admin/gifts"),
  upsertGift: (gift: { id: string; name: string; coin_cost: number; icon?: string }) =>
    request(`/api/v1/admin/gifts`, { method: "POST", body: JSON.stringify(gift) }),
  deleteGift: (id: string) => request(`/api/v1/admin/gifts/${encodeURIComponent(id)}`, { method: "DELETE" }),
  giftEvents: () => request<{ items: any[] }>("/api/v1/admin/gift-events"),

  posts: () => request<{ items: any[] }>("/api/v1/admin/posts"),
  deletePost: (id: string) => request(`/api/v1/admin/posts/${id}`, { method: "DELETE" }),

  products: () => request<{ items: any[] }>("/api/v1/admin/products"),
  deleteProduct: (id: string) => request(`/api/v1/admin/products/${id}`, { method: "DELETE" }),
  unpinProduct: (roomId: string) =>
    request(`/api/v1/admin/rooms/${roomId}/unpin-product`, { method: "POST" }),

  orders: (status = "") => request<{ items: any[] }>(`/api/v1/admin/orders${qs({ status })}`),
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
