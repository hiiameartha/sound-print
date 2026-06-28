import { SITE } from "@/constants/site";

export const COMPATIBILITY_COMPARE_PARAM = "with" as const;
export const SPOTIFY_COMPARE_PARAM = "compare" as const;
export const COMPATIBILITY_SESSION_KEY = "sound-print-compat-with" as const;

/** 好友會開啟的連結：邀請一律導向正式站（與分享卡 QR 相同策略） */
function productionBaseUrl(): string {
  return SITE.productionUrl.replace(/\/$/, "");
}

/**
 * 使用者已在站內時的下一跳：跟隨目前網域，避免 NEXT_PUBLIC_SITE_URL
 */
function currentOriginBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  return productionBaseUrl();
}

export function buildCompatibilityInviteUrl(reportId: string): string {
  return `${productionBaseUrl()}/dashboard?${COMPATIBILITY_COMPARE_PARAM}=${encodeURIComponent(reportId)}`;
}

export function buildDashboardMusicMatchPath(reportId: string): string {
  return `/dashboard?${COMPATIBILITY_COMPARE_PARAM}=${encodeURIComponent(reportId)}#${MUSIC_MATCH_SECTION_ID}`;
}

export function buildSpotifyCompareUrl(reportId: string): string {
  return `${currentOriginBaseUrl()}/spotify?${SPOTIFY_COMPARE_PARAM}=${encodeURIComponent(reportId)}`;
}

/** 站內導向用相對路徑 */
export function buildSpotifyComparePath(reportId: string): string {
  return `/spotify?${SPOTIFY_COMPARE_PARAM}=${encodeURIComponent(reportId)}`;
}

export function persistCompatibilityTarget(reportId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(COMPATIBILITY_SESSION_KEY, reportId);
}

export function readCompatibilityTarget(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(COMPATIBILITY_SESSION_KEY);
}

export function clearCompatibilityTarget(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(COMPATIBILITY_SESSION_KEY);
}

export const MUSIC_MATCH_SECTION_ID = "music-match" as const;

export const MUSIC_MATCH_LABELS = {
  sectionTitle: "與好友的音樂合拍",
  sectionSubtitle: "看看彼此的音樂喜好有多相似",
  loading: "載入音樂合拍…",
  resultTitle: "合拍結果",
  scoreLabel: "合拍指數",
  friendInviteTitle: "好友邀請你比較音樂喜好",
  friendInviteBody:
    "想和你比較 Spotify 音樂喜好。連結你的 Spotify 後，就能看見口味相似度與一起聽歌的建議。",
  inviteTitle: "邀請好友比較",
  inviteSubtitle: "分享連結，好友連結 Spotify 後即可查看合拍指數",
  unsavedReportHint:
    "目前報告尚未儲存，無法產生邀請連結。請重新完成 Spotify 檢測並確認報告。",
} as const;

export const COMPATIBILITY_INVITE_CTA = {
  headline: "邀請好友比較音樂喜好",
  steps: "① 分享連結　② 好友連結 Spotify　③ 查看合拍指數",
  action: "複製邀請連結",
} as const;
