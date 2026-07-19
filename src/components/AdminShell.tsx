"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearAdminToken, hasAdminToken } from "@/lib/api";

const links = [
  { href: "/dashboard", label: "总览" },
  { href: "/users", label: "用户" },
  { href: "/rooms", label: "直播间" },
  { href: "/reports", label: "举报" },
  { href: "/moderation", label: "审核中台" },
  { href: "/gifts", label: "礼物" },
  { href: "/posts", label: "投稿" },
  { href: "/products", label: "商品" },
  { href: "/wallet", label: "充值订单" },
  { href: "/features", label: "功能开关" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!hasAdminToken()) router.replace("/");
  }, [router]);

  return (
    <div className="shell">
      <aside className="side">
        <div style={{ fontWeight: 800, marginBottom: "1rem" }}>PulseLive Ops</div>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href || pathname?.startsWith(l.href + "/") ? "active" : ""}>
            {l.label}
          </Link>
        ))}
        <button
          className="btn ghost"
          style={{ marginTop: "1rem", width: "100%" }}
          onClick={() => {
            clearAdminToken();
            router.push("/");
          }}
        >
          退出
        </button>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
