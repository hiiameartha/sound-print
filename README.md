# Life is Fine

以 Next.js App Router、TypeScript 與 Tailwind CSS 建置的生活紀錄平台基礎架構。

## 技術棧

- [Next.js](https://nextjs.org)（App Router）
- TypeScript
- Tailwind CSS v4
- [next-themes](https://github.com/pacocoursey/next-themes)（深色模式）
- [Zustand](https://github.com/pmndrs/zustand)（UI 狀態）

## 專案結構

```
src/
├── app/           # App Router 路由與全域樣式
├── components/    # 共用 UI 元件（Layout、Theme）
├── features/      # 功能模組（Feature-based）
├── hooks/         # 自訂 React Hooks
├── services/      # API 與外部服務
├── store/         # Zustand 狀態
├── lib/           # 工具函式、SEO metadata
├── types/         # 共用型別
└── constants/     # 站點常數、導覽設定
```

## 開始使用

```bash
cp .env.example .env.local
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

## 環境變數

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 站點正式網址（用於 SEO、sitemap） |
| `SPOTIFY_CLIENT_ID` | Spotify Developer 應用 Client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify Client Secret（勿暴露至前端） |
| `SPOTIFY_REDIRECT_URI` | OAuth 回呼網址，須與 Dashboard Redirect URI 一致 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL（歷史人格報告 `personality_reports`） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `OPENAI_API_KEY` | 可選；見下方「AI 補強」與儀表板人格評論 |
| `OPENAI_MODEL` | 可選；OpenAI 模型，預設 `gpt-4o-mini` |

### Spotify 音樂人格分析

連結 Spotify 後，`/spotify` 會透過 Personality Engine 分析聆聽習慣（Top Artists／Tracks、最近播放），產出六項人格特質與主人格／副人格原型。

**Spotify API 限制（Development Mode，2026 年起）**

Spotify 在 Developer Mode 已移除多數物件的 `popularity`，且實務上常不回傳 `genres`。這會讓曲風比例（k-pop、chill 等）與熱門度相關特質無法直接計算。詳見 [February 2026 Web API 變更](https://developer.spotify.com/documentation/web-api/references/changes/february-2026)。

**AI 補強（需 `OPENAI_API_KEY`）**

當 Spotify 未提供曲風或熱門度時，分析流程會自動：

1. 將 Top Artists、Top Tracks、最近播放的**名稱**送給 OpenAI 推估曲風標籤與熱門度（0–100）
2. 合併為 `PersonalityInput` 後再跑人格引擎
3. 在結果上標記 `signalEnrichment: { source: "ai", fields: [...] }`

未設定 `OPENAI_API_KEY` 時仍可分析，但主要依賴藝人重疊度、重複播放、近期藝人多樣性等訊號。AI 推估為近似值，非 Spotify 官方資料。

**開發除錯**

- `GET /api/spotify/debug`（僅 `NODE_ENV=development`）：檢查原始資料與診斷 issue
- `node scripts/spotify-diagnose.mjs "<access_token>"`：直接對 Spotify API 驗證欄位

### Supabase 資料表

在 SQL Editor 依序執行：

1. `src/features/personality-reports/sql/personality_reports.sql`
2. `src/features/personality-reports/sql/personality_reports_rls_dev.sql`（本機開發用）

## 指令

```bash
npm run dev    # 開發伺服器
npm run build  # 正式建置
npm run start  # 啟動正式伺服器
npm run lint   # ESLint
```
