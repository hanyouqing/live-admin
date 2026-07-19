"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function UsersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load(query = q) {
    try {
      const res = await adminApi.users(query);
      setItems(res.items || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    load(q);
  }

  return (
    <AdminShell>
      <h1>用户管理</h1>
      <form onSubmit={onSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", maxWidth: 480 }}>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索用户名 / 邮箱 / 昵称" />
        <button className="btn" type="submit">搜索</button>
      </form>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>状态</th>
            <th>余额</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td>
                @{u.username}
                <div className="muted">{u.email}</div>
              </td>
              <td>
                <select
                  className="input"
                  style={{ width: "auto", padding: "0.35rem 0.5rem" }}
                  value={u.role}
                  onChange={(e) => adminApi.setRole(u.id, e.target.value).then(() => load())}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>{u.status}</td>
              <td>{u.balance ?? 0}</td>
              <td style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <button className="btn ghost" onClick={() => adminApi.setStatus(u.id, "active").then(() => load())}>
                  解封
                </button>
                <button className="btn danger" onClick={() => adminApi.setStatus(u.id, "banned").then(() => load())}>
                  封禁
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
