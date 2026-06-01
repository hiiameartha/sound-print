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

## 指令

```bash
npm run dev    # 開發伺服器
npm run build  # 正式建置
npm run start  # 啟動正式伺服器
npm run lint   # ESLint
```
