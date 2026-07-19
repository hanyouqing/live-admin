"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function PostsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const r = await adminApi.posts();
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
      <h1>投稿管理</h1>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>作者</th>
            <th>内容</th>
            <th>媒体</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>@{p.author_username}</td>
              <td style={{ maxWidth: 360 }}>{p.caption}</td>
              <td>
                {p.media_url ? (
                  <a href={p.media_url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
                    查看
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
              <td>
                <button
                  className="btn danger"
                  onClick={() => {
                    if (confirm("确认删除该投稿？")) adminApi.deletePost(p.id).then(load);
                  }}
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
