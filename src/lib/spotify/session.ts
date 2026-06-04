import { cookies } from "next/headers";

export const SPOTIFY_COOKIE = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expiresAt: "spotify_token_expires_at",
  authState: "spotify_auth_state",
} as const;

const TOKEN_MAX_AGE = 60 * 60 * 24 * 30;
const STATE_MAX_AGE = 60 * 10;

function cookieBase() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function setSpotifyAuthState(state: string): Promise<void> {
  const jar = await cookies();
  jar.set(SPOTIFY_COOKIE.authState, state, {
    ...cookieBase(),
    maxAge: STATE_MAX_AGE,
  });
}

export async function consumeSpotifyAuthState(
  incoming: string | null,
): Promise<boolean> {
  const jar = await cookies();
  const expected = jar.get(SPOTIFY_COOKIE.authState)?.value;
  jar.delete(SPOTIFY_COOKIE.authState);
  return Boolean(expected && incoming && expected === incoming);
}

export async function setSpotifyTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}): Promise<void> {
  const jar = await cookies();
  const expiresAt = String(Date.now() + tokens.expiresIn * 1000);

  jar.set(SPOTIFY_COOKIE.accessToken, tokens.accessToken, {
    ...cookieBase(),
    maxAge: TOKEN_MAX_AGE,
  });
  jar.set(SPOTIFY_COOKIE.refreshToken, tokens.refreshToken, {
    ...cookieBase(),
    maxAge: TOKEN_MAX_AGE,
  });
  jar.set(SPOTIFY_COOKIE.expiresAt, expiresAt, {
    ...cookieBase(),
    maxAge: TOKEN_MAX_AGE,
  });
}

export async function clearSpotifySession(): Promise<void> {
  const jar = await cookies();
  for (const name of Object.values(SPOTIFY_COOKIE)) {
    jar.delete(name);
  }
}

export async function getSpotifyTokensFromCookies(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}> {
  const jar = await cookies();
  const expiresRaw = jar.get(SPOTIFY_COOKIE.expiresAt)?.value;

  return {
    accessToken: jar.get(SPOTIFY_COOKIE.accessToken)?.value ?? null,
    refreshToken: jar.get(SPOTIFY_COOKIE.refreshToken)?.value ?? null,
    expiresAt: expiresRaw ? Number(expiresRaw) : null,
  };
}

export async function hasSpotifySession(): Promise<boolean> {
  const { refreshToken, accessToken } = await getSpotifyTokensFromCookies();
  return Boolean(refreshToken || accessToken);
}
