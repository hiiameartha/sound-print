import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { buildSpotifyAuthorizeUrl } from "@/lib/spotify/oauth";
import { getSpotifyConfig } from "@/lib/spotify/config";
import { setSpotifyAuthState } from "@/lib/spotify/session";

export async function GET() {
  if (!getSpotifyConfig()) {
    return NextResponse.json(
      { error: "Spotify 尚未設定環境變數" },
      { status: 503 },
    );
  }

  const state = randomBytes(16).toString("hex");
  await setSpotifyAuthState(state);

  const url = buildSpotifyAuthorizeUrl(state);
  return NextResponse.redirect(url);
}
