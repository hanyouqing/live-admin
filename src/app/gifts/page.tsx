"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function GiftsPage() {
  const [gifts, setGifts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", name: "", coin_cost: 1, icon: "" });
  const [error, setError] = useState("");

  async function load() {
    try {
      const [g, e] = await Promise.all([adminApi.gifts(), adminApi.giftEvents()]);
      setGifts(g.items || []);
      setEvents(e.items || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await adminApi.upsertGift({
      id: form.id.trim(),
      name: form.name.trim(),
      coin_cost: Number(form.coin_cost),
      icon: form.icon.trim(),
    });
    setForm({ id: "", name: "", coin_cost: 1, icon: "" });
    await load();
  }

  return (
    <AdminShell>
      <h1>礼物管理</h1>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <section className="card" style={{ marginBottom: "1.25rem" }}>
        <h3>新增 / 更新礼物</h3>
        <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
          <input className="input" placeholder="id (rose)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required />
          <input className="input" placeholder="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input
            className="input"
            type="number"
            min={0}
            placeholder="币价"
            value={form.coin_cost}
            onChange={(e) => setForm({ ...form, coin_cost: Number(e.target.value) })}
            required
          />
          <input className="input" placeholder="icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <button className="btn" type="submit">保存</button>
        </form>
      </section>

      <h3>礼物目录</h3>
      <table className="table" style={{ marginBottom: "1.5rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>币价</th>
            <th>Icon</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {gifts.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.name}</td>
              <td>{g.coin_cost}</td>
              <td>{g.icon || "—"}</td>
              <td>
                <button
                  className="btn ghost"
                  onClick={() => setForm({ id: g.id, name: g.name, coin_cost: g.coin_cost, icon: g.icon || "" })}
                >
                  编辑
                </button>{" "}
                <button className="btn danger" onClick={() => adminApi.deleteGift(g.id).then(load)}>
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>最近打赏流水</h3>
      <table className="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>送礼人</th>
            <th>礼物</th>
            <th>币</th>
            <th>直播间</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{new Date(e.created_at).toLocaleString()}</td>
              <td>@{e.sender_username}</td>
              <td>{e.gift_name}</td>
              <td>{e.coin_cost}</td>
              <td>{e.room_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
