"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function ReportsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("open");
  const [error, setError] = useState("");

  async function load() {
    try {
      const r = await adminApi.reports(status);
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

  return (
    <AdminShell>
      <h1>举报处理</h1>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <select className="input" style={{ width: "auto" }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">待处理</option>
          <option value="resolved">已结案</option>
          <option value="dismissed">已驳回</option>
          <option value="">全部</option>
        </select>
      </div>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>直播间</th>
            <th>主播</th>
            <th>举报人</th>
            <th>原因</th>
            <th>房间状态</th>
            <th>状态</th>
            <th>处置</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>
                {r.room_title || r.room_id}
                <div className="muted" style={{ fontSize: "0.75rem" }}>{r.room_id.slice(0, 8)}…</div>
              </td>
              <td>@{r.host_username}</td>
              <td>@{r.reporter_username}</td>
              <td>{r.reason}</td>
              <td>{r.room_status}</td>
              <td>{r.status}</td>
              <td style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {r.status === "open" && (
                  <>
                    <button className="btn" onClick={() => adminApi.resolveReport(r.id).then(load)}>
                      结案
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => adminApi.resolveReport(r.id, { force_end: true }).then(load)}
                    >
                      下播并结案
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => adminApi.resolveReport(r.id, { force_end: true, ban_host: true }).then(load)}
                    >
                      封禁主播
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => adminApi.resolveReport(r.id, { status: "dismissed" }).then(load)}
                    >
                      驳回
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
