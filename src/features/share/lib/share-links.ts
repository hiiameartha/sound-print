import { formatTraitShareLine } from "@/features/personality/constants/trait-display";
import { SITE } from "@/constants/site";
import type { ShareCardData } from "@/features/share/types";

export function buildShareText(data: ShareCardData): string {
  const traitLines = data.radar.map((p) =>
    formatTraitShareLine(p.key, p.score),
  );

  const lines = [
    `【${data.yearlyTitle}】`,
    `Life is Fine · 音樂人格報告`,
    `🎧 主人格：${data.primaryShortName}`,
    `副人格：${data.secondaryArchetype.title.split("（")[0]?.trim()}`,
    ...traitLines,
  ];

  if (data.toxicCommentary) {
    lines.push(`AI 吐槽：${data.toxicCommentary}`);
  }
  if (data.humorousCommentary) {
    lines.push(data.humorousCommentary);
  }

  lines.push(SITE.url);
  return lines.join("\n");
}

export function buildLineShareUrl(text: string): string {
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
