"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const r = await adminApi.products();
      setItems(r.items || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell>
      <h1>商品管理</h1>
      <p className="muted">对应 C 端带货商品与讲解置顶。删除会同时取消讲解。</p>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>商品</th>
            <th>主播</th>
            <th>价格</th>
            <th>讲解中</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                {p.title}
                {p.buy_url ? (
                  <div>
                    <a href={p.buy_url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "0.8rem" }}>
                      购买链接
                    </a>
                  </div>
                ) : null}
              </td>
              <td>@{p.host_username}</td>
              <td>¥{(p.price_cents / 100).toFixed(2)}</td>
              <td>{p.pinned_room_id ? "是" : "—"}</td>
              <td style={{ display: "flex", gap: "0.35rem" }}>
                {p.pinned_room_id && (
                  <button className="btn ghost" onClick={() => adminApi.unpinProduct(p.pinned_room_id).then(load)}>
                    取消讲解
                  </button>
                )}
                <button className="btn danger" onClick={() => adminApi.deleteProduct(p.id).then(load)}>
                  下架删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
