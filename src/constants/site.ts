export const SITE = {
  name: "Life is Fine",
  title: "Life is Fine — 生活還不錯",
  description:
    "Life is Fine 是一個以正念與日常紀錄為核心的生活平台，幫助你記錄、反思，並溫柔地面對每一天。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-TW",
  author: "Life is Fine Team",
  keywords: [
    "生活紀錄",
    "正念",
    "日記",
    "心理健康",
    "Life is Fine",
  ] as const,
} as const;
