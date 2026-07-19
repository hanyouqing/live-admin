"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function ModerationPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<{ word: string; action: string }[]>([]);
  const [word, setWord] = useState("");

  async function load() {
    const [c, k] = await Promise.all([adminApi.cases(), adminApi.keywords()]);
    setCases(c.items || []);
    setKeywords(k.items || []);
  }

  useEffect(() => {
    load();
  }, []);

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
      <h3>待审案件</h3>
      <table className="table">
        <thead>
          <tr>
            <th>类型</th>
            <th>内容</th>
            <th>原因</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.kind}</td>
              <td>{c.content}</td>
              <td>{c.reason}</td>
              <td style={{ display: "flex", gap: "0.4rem" }}>
                <button className="btn" onClick={() => adminApi.resolveCase(c.id, "approved").then(load)}>通过</button>
                <button className="btn danger" onClick={() => adminApi.resolveCase(c.id, "rejected").then(load)}>驳回</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
