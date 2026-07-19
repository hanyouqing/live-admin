"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function WalletPage() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const r = await adminApi.orders(status);
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
      <h1>充值订单</h1>
      <select className="input" style={{ width: "auto", marginBottom: "1rem" }} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">全部</option>
        <option value="pending">pending</option>
        <option value="paid">paid</option>
        <option value="failed">failed</option>
      </select>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>渠道</th>
            <th>金额</th>
            <th>币</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o.id}>
              <td>{new Date(o.created_at).toLocaleString()}</td>
              <td>@{o.username}</td>
              <td>{o.provider}</td>
              <td>¥{(o.amount_cents / 100).toFixed(2)}</td>
              <td>{o.coins}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
