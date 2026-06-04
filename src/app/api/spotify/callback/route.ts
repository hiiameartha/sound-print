import { NextResponse } from "next/server";
import { exchangeSpotifyCode } from "@/lib/spotify/oauth";
import {
  consumeSpotifyAuthState,
  setSpotifyTokens,
} from "@/lib/spotify/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const siteOrigin = new URL(request.url).origin;
  const failRedirect = `${siteOrigin}/spotify?error=auth_failed`;

  if (error || !code) {
    return NextResponse.redirect(failRedirect);
  }

  const stateOk = await consumeSpotifyAuthState(state);
  if (!stateOk) {
    return NextResponse.redirect(`${siteOrigin}/spotify?error=invalid_state`);
  }

  try {
    const tokens = await exchangeSpotifyCode(code);
    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${siteOrigin}/spotify?error=no_refresh`);
    }

    await setSpotifyTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
    });

    return NextResponse.redirect(`${siteOrigin}/spotify?connected=1`);
  } catch {
    return NextResponse.redirect(failRedirect);
  }
}
