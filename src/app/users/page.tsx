"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function UsersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await adminApi.users();
      setItems(res.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell>
      <h1>用户管理</h1>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>用户名</th>
            <th>角色</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td>@{u.username}<div className="muted">{u.email}</div></td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td style={{ display: "flex", gap: "0.4rem" }}>
                <button className="btn ghost" onClick={() => adminApi.setStatus(u.id, "active").then(load)}>解封</button>
                <button className="btn danger" onClick={() => adminApi.setStatus(u.id, "banned").then(load)}>封禁</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
