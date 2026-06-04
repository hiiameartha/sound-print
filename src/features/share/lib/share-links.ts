import { SITE } from "@/constants/site";
import type { ShareCardData } from "@/features/share/types";

export function buildShareText(data: ShareCardData): string {
  const lines = [
    `【${data.title}】`,
    `Life.EXE 人生報告 · ${data.tier.code} ${data.tier.label}`,
    `總分 ${data.totalScore}/60（${data.percent}%）`,
    `王牌：${data.bestLabel} ${data.bestScore}/10`,
    `待補強：${data.weakestLabel} ${data.weakestScore}/10`,
  ];

  if (data.hasAiCommentary) {
    lines.push(
      `幽默分析：${data.commentary.humorousAnalysis}`,
      `鼓勵建議：${data.commentary.encouragement}`,
    );
  }

  lines.push(data.hookLine, SITE.url);
  return lines.join("\n");
}

export function buildLineShareUrl(text: string): string {
  const params = new URLSearchParams({ text });
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}

export function buildFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({ u: url });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function buildTwitterShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function openShareWindow(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=520");
}
