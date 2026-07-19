"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function RoomsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("live");
  const [kickUser, setKickUser] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function load() {
    try {
      const r = await adminApi.rooms({ q, status });
      setItems(r.items || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    load();
  }

  return (
    <AdminShell>
      <h1>直播间</h1>
      <form onSubmit={onSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input className="input" style={{ maxWidth: 280 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="标题 / 主播" />
        <select className="input" style={{ width: "auto" }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">全部状态</option>
          <option value="live">直播中</option>
          <option value="ended">已结束</option>
          <option value="idle">未开播</option>
        </select>
        <button className="btn" type="submit">筛选</button>
      </form>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>主播</th>
            <th>分类</th>
            <th>状态</th>
            <th>观众</th>
            <th>运营操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>
                {r.title}
                <div className="muted" style={{ fontSize: "0.75rem" }}>{r.id.slice(0, 8)}…</div>
              </td>
              <td>@{r.host_username}</td>
              <td>{r.category || "—"}</td>
              <td>{r.status}</td>
              <td>{r.viewer_count}</td>
              <td style={{ display: "grid", gap: "0.4rem", minWidth: 260 }}>
                {r.status === "live" && (
                  <button className="btn danger" onClick={() => adminApi.forceEnd(r.id).then(load)}>
                    强制下播
                  </button>
                )}
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <input
                    className="input"
                    placeholder="公告"
                    value={notice[r.id] || ""}
                    onChange={(e) => setNotice((n) => ({ ...n, [r.id]: e.target.value }))}
                  />
                  <button
                    className="btn ghost"
                    onClick={() => adminApi.setNotice(r.id, notice[r.id] || "").then(load)}
                  >
                    发公告
                  </button>
                </div>
                {r.status === "live" && (
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <input
                      className="input"
                      placeholder="用户 UUID 踢出/禁言"
                      value={kickUser[r.id] || ""}
                      onChange={(e) => setKickUser((k) => ({ ...k, [r.id]: e.target.value }))}
                    />
                    <button
                      className="btn ghost"
                      onClick={() => {
                        const uid = (kickUser[r.id] || "").trim();
                        if (!uid) return;
                        adminApi.kick(r.id, uid).then(load);
                      }}
                    >
                      踢出
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => {
                        const uid = (kickUser[r.id] || "").trim();
                        if (!uid) return;
                        adminApi.mute(r.id, uid, true).then(load);
                      }}
                    >
                      禁言
                    </button>
                  </div>
                )}
                <button className="btn ghost" onClick={() => adminApi.setStatus(r.host_id, "banned").then(load)}>
                  封禁主播
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
