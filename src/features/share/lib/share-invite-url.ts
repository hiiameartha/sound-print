import { SITE } from "@/constants/site";

/** 分享卡／文案導向的 Spotify 檢測入口（一律使用正式站，方便好友開啟） */
export function buildShareInviteUrl(): string {
  const base = SITE.productionUrl.replace(/\/$/, "");
  return `${base}/spotify?from=share`;
}

export function formatShareInviteUrlForDisplay(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.host}${parsed.pathname}`;
  } catch {
    return url;
  }
}

export const SHARE_INVITE_CTA = {
  headline: "你也想測自己的音樂人格？",
  steps: "① 掃描 QR Code 或開啟網址　② 連結 Spotify　③ 取得你的報告",
  action: "免費開始檢測",
} as const;
