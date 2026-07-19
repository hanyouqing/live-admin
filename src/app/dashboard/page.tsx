"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.stats().then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <AdminShell>
      <h1>运营总览</h1>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <div className="cards">
        {[
          ["用户", stats?.users],
          ["直播中", stats?.live_rooms],
          ["待处理举报", stats?.open_reports],
          ["待审案件", stats?.pending_cases],
          ["今日礼物", stats?.gifts_today],
          ["今日礼物币", stats?.coins_today],
          ["投稿数", stats?.posts],
          ["商品数", stats?.products],
          ["今日已支付订单", stats?.orders_today],
          ["今日充值币", stats?.paid_coins_today],
        ].map(([label, value]) => (
          <div className="card" key={String(label)}>
            <div className="muted">{label}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{value ?? "—"}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
