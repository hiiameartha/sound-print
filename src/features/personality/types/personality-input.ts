/**
 * Provider-agnostic listening signals.
 * Populated by adapters (e.g. Spotify); consumed by trait scorers and archetype rules.
 */
export type PersonalityInput = {
  displayName: string;
  topArtist: string | null;
  genreCount: number;
  trackSampleSize: number;

  allGenres: string[];

  /** Genre tag hit ratios (0–1) */
  chillRatio: number;
  partyRatio: number;
  romanticGenreRatio: number;
  emotionalGenreRatio: number;
  kpopRatio: number;
  indieRatio: number;
  intenseRatio: number;

  /** Short-term vs medium-term top artist overlap (0–1), higher = more stable taste */
  artistOverlap: number;
  /** 1 - artistOverlap */
  exploration: number;
  genreBreadth: number;
  recentArtistDiversity: number;

  /** Share of recently played tracks that also appear in top tracks (0–1) */
  repeatListeningRatio: number;

  avgTrackPopularity: number;
  avgArtistPopularity: number;
  recentTrackCount: number;
};
