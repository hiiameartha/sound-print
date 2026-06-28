export { CompatibilityPanel } from "@/features/compatibility/components/CompatibilityPanel";
export { CompatibilityResultView } from "@/features/compatibility/components/CompatibilityResultView";
export { CompatibilityTraitRadarChart } from "@/features/compatibility/components/CompatibilityTraitRadarChart";
export {
  comparePersonalityReports,
  COMPATIBILITY_DIMENSION_HINTS,
} from "@/features/compatibility/engine/compatibility-engine";
export {
  buildCompatibilityInviteUrl,
  buildDashboardMusicMatchPath,
  buildSpotifyComparePath,
  buildSpotifyCompareUrl,
  COMPATIBILITY_INVITE_CTA,
  MUSIC_MATCH_LABELS,
  MUSIC_MATCH_SECTION_ID,
} from "@/features/compatibility/lib/build-compatibility-invite-url";
export type {
  CompatibilityDimension,
  CompatibilityInput,
  CompatibilityResult,
  CompatibilityScenario,
  CompatibilityTraitDelta,
} from "@/features/compatibility/types";
