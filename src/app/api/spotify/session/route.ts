import { NextResponse } from "next/server";
import { getSpotifyConfig } from "@/lib/spotify/config";
import { hasSpotifySession } from "@/lib/spotify/session";

/** 僅檢查本機 cookie，不呼叫 Spotify API，避免卡住載入畫面 */
export async function GET() {
  if (!getSpotifyConfig()) {
    return NextResponse.json({ configured: false, connected: false });
  }

  const connected = await hasSpotifySession();
  return NextResponse.json({ configured: true, connected });
}
