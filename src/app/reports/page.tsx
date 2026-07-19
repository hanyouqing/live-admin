"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function ReportsPage() {
  const [items, setItems] = useState<any[]>([]);
  async function load() {
    const r = await adminApi.reports();
    setItems(r.items || []);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell>
      <h1>举报处理</h1>
      <table className="table">
        <thead>
          <tr>
            <th>房间</th>
            <th>原因</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.room_id}</td>
              <td>{r.reason}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "open" && (
                  <button className="btn" onClick={() => adminApi.resolveReport(r.id).then(load)}>
                    结案
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
