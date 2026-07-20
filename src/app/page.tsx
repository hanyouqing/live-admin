"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, saveAdminToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const pair = await adminApi.login(login, password);
      if (pair.user.role !== "admin") {
        setError("该账号不是管理员");
        return;
      }
      saveAdminToken(pair.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1rem" }}>
      <form onSubmit={onSubmit} className="card" style={{ width: "min(400px, 100%)", display: "grid", gap: "0.75rem" }}>
        <h1 style={{ margin: 0 }}>PulseLive Admin</h1>
        <p className="muted" style={{ margin: 0 }}>使用管理员账号登录（生产请配置强密码 ADMIN_PASSWORD）</p>
        <input className="input" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="用户名" autoComplete="username" />
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" autoComplete="current-password" />
        {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
        <button className="btn" type="submit">登录</button>
      </form>
    </div>
  );
}
