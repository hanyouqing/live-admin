"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function ModerationPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<{ word: string; action: string }[]>([]);
  const [word, setWord] = useState("");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function load() {
    try {
      const [c, k] = await Promise.all([adminApi.cases(status), adminApi.keywords()]);
      setCases(c.items || []);
      setKeywords(k.items || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function addKeyword(e: FormEvent) {
    e.preventDefault();
    if (!word.trim()) return;
    await adminApi.addKeyword(word.trim());
    setWord("");
    await load();
  }

  return (
    <AdminShell>
      <h1>审核中台</h1>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <section className="card" style={{ marginBottom: "1rem" }}>
        <h3>敏感词</h3>
        <form onSubmit={addKeyword} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <input className="input" value={word} onChange={(e) => setWord(e.target.value)} placeholder="新增关键词" />
          <button className="btn" type="submit">添加</button>
        </form>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {keywords.map((k) => (
            <button key={k.word} className="btn ghost" onClick={() => adminApi.deleteKeyword(k.word).then(load)}>
              {k.word} ×
            </button>
          ))}
        </div>
      </section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h3 style={{ margin: 0 }}>审核案件</h3>
        <select className="input" style={{ width: "auto" }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">待审</option>
          <option value="approved">已通过</option>
          <option value="rejected">已驳回</option>
          <option value="all">全部</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>类型</th>
            <th>用户</th>
            <th>内容</th>
            <th>原因</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.kind}</td>
              <td>{c.username ? `@${c.username}` : "—"}</td>
              <td style={{ maxWidth: 280 }}>{c.content}</td>
              <td>{c.reason}</td>
              <td>{c.status}</td>
              <td style={{ display: "grid", gap: "0.35rem", minWidth: 220 }}>
                {c.status === "pending" ? (
                  <>
                    <input
                      className="input"
                      placeholder="处理备注（可选）"
                      value={notes[c.id] || ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))}
                    />
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <button
                        className="btn"
                        onClick={() => adminApi.resolveCase(c.id, "approved", notes[c.id] || "").then(load)}
                      >
                        通过
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => adminApi.resolveCase(c.id, "rejected", notes[c.id] || "").then(load)}
                      >
                        驳回
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="muted">{c.resolution || "—"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
