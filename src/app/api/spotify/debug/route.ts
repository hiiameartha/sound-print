import { NextResponse } from "next/server";
import { diagnoseSpotifyListeningData } from "@/lib/spotify/diagnose";
import { fetchSpotifyListeningData } from "@/lib/spotify/api";
import { getValidSpotifyAccessToken } from "@/lib/spotify/get-access-token";
import { getSpotifyConfig } from "@/lib/spotify/config";

/** 開發用：檢查 Spotify 原始資料與轉換後訊號是否有空值 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "僅限開發環境" }, { status: 404 });
  }

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
    const diagnosis = diagnoseSpotifyListeningData(listening);

    console.log("[spotify:debug] listening", listening);
    console.log("[spotify:debug] diagnosis", diagnosis);

    return NextResponse.json({
      diagnosis,
      rawSummary: {
        userId: listening.user.id,
        displayName: listening.user.display_name,
        product: listening.user.product ?? null,
        followers: listening.user.followers?.total ?? null,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "無法取得 Spotify 診斷資料";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
