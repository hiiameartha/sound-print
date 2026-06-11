export const SPOTIFY_SCOPES = [
  "user-top-read",
  "user-read-recently-played",
  "user-read-private",
] as const;

export type SpotifyConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function getSpotifyConfig(): SpotifyConfig | null {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ??
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000"}/api/spotify/callback`;

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret, redirectUri };
}

export const SPOTIFY_ACCOUNTS_BASE = "https://accounts.spotify.com";
export const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
