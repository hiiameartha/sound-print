import { refreshSpotifyAccessToken } from "@/lib/spotify/oauth";
import {
  getSpotifyTokensFromCookies,
  setSpotifyTokens,
} from "@/lib/spotify/session";

const EXPIRY_BUFFER_MS = 60_000;

export async function getValidSpotifyAccessToken(): Promise<string | null> {
  const { accessToken, refreshToken, expiresAt } =
    await getSpotifyTokensFromCookies();

  if (
    accessToken &&
    expiresAt &&
    expiresAt - Date.now() > EXPIRY_BUFFER_MS
  ) {
    return accessToken;
  }

  if (!refreshToken) return accessToken;

  const refreshed = await refreshSpotifyAccessToken(refreshToken);
  await setSpotifyTokens({
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token ?? refreshToken,
    expiresIn: refreshed.expires_in,
  });

  return refreshed.access_token;
}
