# live-admin

PulseLive 运营后台（Next.js），对接 `live-backend` 的 `/api/v1/admin/*`。

## 启动

```bash
# 先启动后端（会自动创建 admin 账号）
cd ../live-backend && docker compose up -d && go run ./cmd/api

cd ../live-admin
cp .env.example .env.local
npm install
npm run dev
```

打开 http://localhost:3001

默认管理员：本地 `APP_ENV=dev` 时可引导创建 `admin`（密码见 `ADMIN_PASSWORD`，默认仅开发用）。生产必须设置强 `ADMIN_PASSWORD`（≥12）与强 `JWT_SECRET`。

## 功能

- 总览指标
- 用户封禁/解封
- 直播间强制下播
- 举报结案
- 审核中台（敏感词 + 待审案件）
