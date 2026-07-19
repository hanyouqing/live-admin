"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { adminApi } from "@/lib/api";

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .features()
      .then((r) => {
        setFeatures(r.features || {});
        setNote(r.note || "");
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <AdminShell>
      <h1>功能开关</h1>
      <p className="muted">{note || "只读视图，对应后端 FEATURE_* 环境变量。"}</p>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>状态</th>
            <th>Env</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(features)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, on]) => (
              <tr key={key}>
                <td>{key}</td>
                <td style={{ color: on ? "var(--accent)" : "var(--danger)" }}>{on ? "ON" : "OFF"}</td>
                <td className="muted">FEATURE_{key.toUpperCase()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
