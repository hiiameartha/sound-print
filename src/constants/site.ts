export const PRODUCTION_SITE_URL = "https://sound-print.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;

  return "http://127.0.0.1:3000";
}

export const SITE = {
  name: "Sound Print",
  title: "Sound Print — 音樂人格",
  tagline: "Tell me what you listen to, and I'll tell you who you are.",
  description:
    "Tell me what you listen to, and I'll tell you who you are. 用 Spotify 聆聽資料分析你的音樂人格。",
  keywords: [
    "音樂人格",
    "Spotify",
    "Sound Print",
    "人格分析",
  ] as const,
  url: resolveSiteUrl(),
  productionUrl: PRODUCTION_SITE_URL,
  locale: "zh-TW",
  author: "Sound Print Team",
  scanEyebrow: "Sound Print",
  scanTitle: "音樂人格檢測",
} as const;
