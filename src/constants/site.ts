export const SITE = {
  name: "Life is Fine",
  title: "Life is Fine — 音樂人格",
  description:
    "Tell me what you listen to, and I'll tell you who you are. 用 Spotify 聆聽資料分析你的音樂人格。",
  keywords: [
    "音樂人格",
    "Spotify",
    "Life is Fine",
    "人格分析",
  ] as const,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-TW",
  author: "Life is Fine Team",
} as const;
