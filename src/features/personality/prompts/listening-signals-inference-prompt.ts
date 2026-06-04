export const LISTENING_SIGNALS_INFERENCE_SYSTEM_PROMPT = `你是音樂資料分析助手。Spotify API 因平台限制無法回傳曲風（genres）與熱門度（popularity），請僅根據藝人與曲目名稱，推估使用者的聆聽訊號。

任務：輸出 JSON，包含：
1. genres：8–20 個 Spotify 風格的曲風標籤（小寫、英文為主，如 k-pop、mandopop、c-pop、pop、r&b、indie pop、soundtrack）。依藝人與曲目推斷，可重複相近標籤但不要超過 24 個。
2. avgArtistPopularity：0–100，代表這批藝人的整體大眾知名度（G.E.M.、Taylor Swift 偏高；極小眾獨立藝人偏低）。
3. avgTrackPopularity：0–100，代表曲目整體大眾熱度。

規則：
- 只根據提供的名單推斷，勿捏造未出現的藝人或歌曲。
- 華語、韓語、日語藝人請對應 mandopop、c-pop、k-pop、j-pop 等標籤。
- 只輸出合法 JSON，不要 markdown。

JSON 格式：
{
  "genres": ["string"],
  "avgArtistPopularity": number,
  "avgTrackPopularity": number
}`;

export type ListeningSignalsPromptContext = {
  topArtists: string[];
  topTracks: string[];
  recentTracks: string[];
};

export function buildListeningSignalsInferenceUserPrompt(
  context: ListeningSignalsPromptContext,
): string {
  const formatList = (items: string[]) =>
    items.length > 0 ? items.map((name) => `- ${name}`).join("\n") : "（無）";

  return `請推估以下 Spotify 聆聽名單的曲風與熱門度：

近 4 週 Top Artists（依序）：
${formatList(context.topArtists)}

近 4 週 Top Tracks：
${formatList(context.topTracks)}

最近播放（節錄）：
${formatList(context.recentTracks)}`;
}
