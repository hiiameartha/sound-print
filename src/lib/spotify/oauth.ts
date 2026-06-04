import {
  getSpotifyConfig,
  SPOTIFY_ACCOUNTS_BASE,
  SPOTIFY_SCOPES,
} from "@/lib/spotify/config";

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

export function buildSpotifyAuthorizeUrl(state: string): string {
  const config = getSpotifyConfig();
  if (!config) {
    throw new Error("Spotify 尚未設定：請設定 SPOTIFY_CLIENT_ID 與 SPOTIFY_CLIENT_SECRET");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.redirectUri,
    scope: SPOTIFY_SCOPES.join(" "),
    state,
  });

  return `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params.toString()}`;
}

export async function exchangeSpotifyCode(
  code: string,
): Promise<SpotifyTokenResponse> {
  const config = getSpotifyConfig();
  if (!config) {
    throw new Error("Spotify 尚未設定");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
  });

  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`,
  ).toString("base64");

  const res = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token 交換失敗：${text}`);
  }

  return res.json() as Promise<SpotifyTokenResponse>;
}

export async function refreshSpotifyAccessToken(
  refreshToken: string,
): Promise<SpotifyTokenResponse> {
  const config = getSpotifyConfig();
  if (!config) {
    throw new Error("Spotify 尚未設定");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`,
  ).toString("base64");

  const res = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token 更新失敗：${text}`);
  }

  return res.json() as Promise<SpotifyTokenResponse>;
}
