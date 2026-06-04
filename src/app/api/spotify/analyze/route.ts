import { NextResponse } from "next/server";
import { analyzeSpotifyPersonality } from "@/features/personality/services/analyze-spotify-personality";
import { fetchSpotifyListeningData } from "@/lib/spotify/api";
import { diagnoseSpotifyListeningData } from "@/lib/spotify/diagnose";
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
    const { profile } = await analyzeSpotifyPersonality(listening);

    if (process.env.NODE_ENV === "development") {
      const diagnosis = diagnoseSpotifyListeningData(listening);
      console.log("[spotify:analyze] listening", listening);
      console.log("[spotify:analyze] profile", profile);
      console.log("[spotify:analyze] diagnosis", diagnosis);
    }

    return NextResponse.json({ profile });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "無法分析 Spotify 聆聽資料";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
