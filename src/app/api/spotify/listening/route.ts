import { NextResponse } from "next/server";
import { formatSpotifyListeningSummary } from "@/features/spotify/lib/format-listening-summary";
import { fetchSpotifyListeningData } from "@/lib/spotify/api";
import { getValidSpotifyAccessToken } from "@/lib/spotify/get-access-token";
import { getSpotifyConfig } from "@/lib/spotify/config";

export async function GET() {
  if (!getSpotifyConfig()) {
    return NextResponse.json(
      { error: "Spotify 尚未設定環境變數" },
      { status: 503 },
    );
  }

  const accessToken = await getValidSpotifyAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "請先連結 Spotify 帳號" },
      { status: 401 },
    );
  }

  try {
    const listening = await fetchSpotifyListeningData(accessToken);
    const summary = formatSpotifyListeningSummary(
      listening,
      listening.playedAtByTrackId,
    );

    return NextResponse.json({ summary });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "無法取得 Spotify 聆聽紀錄";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
