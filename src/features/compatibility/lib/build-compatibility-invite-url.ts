import { SITE } from "@/constants/site";

export const COMPATIBILITY_COMPARE_PARAM = "with" as const;
export const SPOTIFY_COMPARE_PARAM = "compare" as const;
export const COMPATIBILITY_SESSION_KEY = "sound-print-compat-with" as const;

export function buildCompatibilityInviteUrl(reportId: string): string {
  const base = SITE.productionUrl.replace(/\/$/, "");
  return `${base}/compatibility?${COMPATIBILITY_COMPARE_PARAM}=${encodeURIComponent(reportId)}`;
}

export function buildSpotifyCompareUrl(reportId: string): string {
  const base = SITE.url.replace(/\/$/, "");
  return `${base}/spotify?${SPOTIFY_COMPARE_PARAM}=${encodeURIComponent(reportId)}`;
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

export const COMPATIBILITY_INVITE_CTA = {
  headline: "邀請好友比較 Spotify 相容性",
  steps: "① 分享連結　② 好友連結 Spotify　③ 查看合拍指數",
  action: "複製邀請連結",
} as const;
