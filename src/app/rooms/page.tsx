"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function RoomsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    adminApi.rooms().then((r) => setItems(r.items || []));
  }, []);

  return (
    <AdminShell>
      <h1>直播间</h1>
      <table className="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>主播</th>
            <th>状态</th>
            <th>观众</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>@{r.host_username}</td>
              <td>{r.status}</td>
              <td>{r.viewer_count}</td>
              <td>
                {r.status === "live" && (
                  <button className="btn danger" onClick={() => adminApi.forceEnd(r.id).then(() => adminApi.rooms().then((x) => setItems(x.items || [])))}>
                    强制下播
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
