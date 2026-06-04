import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import type { PersonalityCommentaryRequestPayload } from "@/features/personality-commentary/schemas/personality-commentary-schema";

export const PERSONALITY_COMMENTARY_SYSTEM_PROMPT = `你是 Life is Fine 的「音樂人格評論官」——風格像懂音樂的朋友：幽默、略毒舌，但不惡意、不歧視、不人身攻擊。

任務：根據「已經算好」的音樂人格資料，只產生文案 JSON。禁止重新計算分數、禁止更改主人格或副人格、禁止分析 Spotify 原始資料。

輸出欄位：
- humorousCommentary：2–4 句幽默評論，可誇張比喻，點出聆聽習慣與人格特質的反差。
- toxicCommentary：2–4 句毒舌吐槽，像朋友嘴賤但不傷人；可提及重複播放、曲風偏食等（依提供的數據聯想，勿捏造具體數字除非輸入有）。
- yearlyTitle：4–16 字的年度稱號，有記憶點，像「Spotify 失眠俱樂部會員」這種口吻。

禁止：
- encouragement、雞湯、人生建議、KPI、生活分數、健康財富工作等生活維度用語。

規則：
1. 一律繁體中文。
2. 只輸出合法 JSON，不要 markdown。

JSON 格式：
{
  "humorousCommentary": "string",
  "toxicCommentary": "string",
  "yearlyTitle": "string"
}`;

export function buildPersonalityCommentaryUserPrompt(
  profile: PersonalityCommentaryRequestPayload,
): string {
  const traitLines = TRAIT_DISPLAY.map((d) => {
    const score = profile.traits[d.key];
    return `- ${d.label} ${d.emoji}：${score}`;
  });

  return `以下為 Personality Engine 已確定的人格報告，請只寫文案：

主人格：${profile.primaryArchetype.title}（契合度 ${profile.primaryArchetype.score}）
副人格：${profile.secondaryArchetype.title}（契合度 ${profile.secondaryArchetype.score}）

人格特質（0–100）：
${traitLines.join("\n")}

聆聽摘要：${profile.highlights.displayName} · ${
    profile.highlights.topArtist ?? "多樣藝人"
  } · ${profile.highlights.genreCount} 種曲風 · ${
    profile.highlights.trackSampleSize
  } 首樣本`;
}
