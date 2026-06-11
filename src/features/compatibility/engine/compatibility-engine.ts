import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import type { PersonalityReport } from "@/features/personality-reports/types";
import type { PersonalityTraitKey } from "@/features/personality/types/traits";
import type {
  CompatibilityDimension,
  CompatibilityResult,
  CompatibilityScenario,
  CompatibilityScenarioLevel,
  CompatibilityTraitDelta,
} from "@/features/compatibility/types";

const TASTE_TRAITS: PersonalityTraitKey[] = [
  "explorer",
  "nostalgia",
  "adventurous",
];

const MOOD_TRAITS: PersonalityTraitKey[] = [
  "emotional",
  "romantic",
  "social",
];

function traitSimilarity(a: number, b: number): number {
  return 100 - Math.abs(a - b);
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function complementTraitScore(a: number, b: number): number {
  const delta = Math.abs(a - b);
  if (delta >= 14 && delta <= 38) {
    return Math.round(88 - Math.abs(delta - 26) * 1.2);
  }
  if (delta < 14) {
    return Math.round(52 + delta * 2.2);
  }
  return Math.round(Math.max(28, 96 - (delta - 38) * 1.8));
}

function reportLabel(report: PersonalityReport): string {
  const archetype =
    report.profile.primaryArchetype.title.split("（")[0]?.trim() ?? "音樂人格";
  const name = report.profile.highlights.displayName?.trim();
  return name ? `${name}（${archetype}）` : archetype;
}

function buildTraitDeltas(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): CompatibilityTraitDelta[] {
  return TRAIT_DISPLAY.map((display) => {
    const scoreA = reportA.profile.traits[display.key];
    const scoreB = reportB.profile.traits[display.key];
    return {
      key: display.key,
      label: display.label,
      emoji: display.emoji,
      scoreA,
      scoreB,
      delta: scoreB - scoreA,
    };
  });
}

function computeMusicOverlap(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): number {
  const traitsA = reportA.profile.traits;
  const traitsB = reportB.profile.traits;

  const tasteSimilarity = average(
    TASTE_TRAITS.map((key) => traitSimilarity(traitsA[key], traitsB[key])),
  );

  let bonus = 0;
  const topA = reportA.profile.highlights.topArtist;
  const topB = reportB.profile.highlights.topArtist;
  if (topA && topB && topA === topB) bonus += 18;

  const primaryA = reportA.profile.primaryArchetype.id;
  const primaryB = reportB.profile.primaryArchetype.id;
  if (primaryA === primaryB) bonus += 12;

  const genreDelta = Math.abs(
    reportA.profile.highlights.genreCount - reportB.profile.highlights.genreCount,
  );
  const genreBonus = Math.max(0, 10 - genreDelta);

  return Math.round(Math.min(100, tasteSimilarity * 0.78 + bonus + genreBonus));
}

function computePersonalityComplement(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): number {
  const traitsA = reportA.profile.traits;
  const traitsB = reportB.profile.traits;

  const complementAverage = average(
    TRAIT_DISPLAY.map((display) =>
      complementTraitScore(traitsA[display.key], traitsB[display.key]),
    ),
  );

  const primaryA = reportA.profile.primaryArchetype.id;
  const primaryB = reportB.profile.primaryArchetype.id;
  const secondaryA = reportA.profile.secondaryArchetype.id;
  const secondaryB = reportB.profile.secondaryArchetype.id;

  let archetypeBonus = 0;
  if (primaryA !== primaryB) archetypeBonus += 8;
  if (primaryA === secondaryB || primaryB === secondaryA) archetypeBonus += 6;

  return Math.round(Math.min(100, complementAverage + archetypeBonus));
}

function computeEmotionalSync(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): number {
  const traitsA = reportA.profile.traits;
  const traitsB = reportB.profile.traits;

  return Math.round(
    average(
      MOOD_TRAITS.map((key) => traitSimilarity(traitsA[key], traitsB[key])),
    ),
  );
}

function scenarioLevel(score: number): CompatibilityScenarioLevel {
  if (score >= 78) return "strong";
  if (score >= 62) return "good";
  if (score >= 48) return "okay";
  return "weak";
}

function scenarioVerdict(level: CompatibilityScenarioLevel): string {
  if (level === "strong") return "很強";
  if (level === "good") return "很合";
  if (level === "okay") return "普通";
  return "有挑戰";
}

function computeScenarios(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): CompatibilityScenario[] {
  const traitsA = reportA.profile.traits;
  const traitsB = reportB.profile.traits;

  const travelScore = Math.round(
    traitSimilarity(traitsA.explorer, traitsB.explorer) * 0.35 +
      traitSimilarity(traitsA.adventurous, traitsB.adventurous) * 0.35 +
      average([traitsA.explorer, traitsB.explorer]) * 0.15 +
      average([traitsA.adventurous, traitsB.adventurous]) * 0.15,
  );

  const socialGap = Math.abs(traitsA.social - traitsB.social);
  const workScore = Math.round(
    traitSimilarity(traitsA.emotional, traitsB.emotional) * 0.4 +
      traitSimilarity(traitsA.nostalgia, traitsB.nostalgia) * 0.3 +
      traitSimilarity(traitsA.social, traitsB.social) * 0.2 +
      Math.max(0, 10 - socialGap * 0.15),
  );

  const karaokeScore = Math.round(
    traitSimilarity(traitsA.social, traitsB.social) * 0.35 +
      traitSimilarity(traitsA.romantic, traitsB.romantic) * 0.25 +
      Math.max(traitsA.social, traitsB.social) * 0.2 +
      Math.max(traitsA.romantic, traitsB.romantic) * 0.2,
  );

  const scenarios: Array<{
    key: CompatibilityScenario["key"];
    label: string;
    score: number;
  }> = [
    { key: "travel", label: "一起旅行", score: travelScore },
    { key: "work", label: "一起工作", score: workScore },
    { key: "karaoke", label: "一起唱歌", score: karaokeScore },
  ];

  return scenarios.map((item) => {
    const level = scenarioLevel(item.score);
    return {
      key: item.key,
      label: item.label,
      score: item.score,
      level,
      verdict: scenarioVerdict(level),
    };
  });
}

function buildSummary(
  score: number,
  reportA: PersonalityReport,
  reportB: PersonalityReport,
  scenarios: CompatibilityScenario[],
): string {
  const nameA = reportA.profile.primaryArchetype.title.split("（")[0]?.trim();
  const nameB = reportB.profile.primaryArchetype.title.split("（")[0]?.trim();
  const strongest = [...scenarios].sort((a, b) => b.score - a.score)[0];

  if (score >= 85) {
    return `${nameA} 與 ${nameB} 的頻率高度合拍，${strongest?.label ?? "一起聽歌"}尤其有默契。`;
  }
  if (score >= 70) {
    return `你們在多數情境都能互補，${strongest?.label ?? "一起聽歌"}可能是最佳場景。`;
  }
  if (score >= 55) {
    return `一半相似、一半互補——像兩個曲風不同的房間，門沒關緊。`;
  }
  return `人格頻率差得有點遠，但差異本身也可能帶來有趣的化學反應。`;
}

/**
 * Rule-based、可測試；不依賴 OpenAI。
 */
export function comparePersonalityReports(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): CompatibilityResult {
  const musicOverlap = computeMusicOverlap(reportA, reportB);
  const personalityComplement = computePersonalityComplement(reportA, reportB);
  const emotionalSync = computeEmotionalSync(reportA, reportB);

  const dimensions: CompatibilityDimension[] = [
    { key: "musicOverlap", label: "音樂重疊", score: musicOverlap },
    {
      key: "personalityComplement",
      label: "人格互補",
      score: personalityComplement,
    },
    { key: "emotionalSync", label: "情緒同步", score: emotionalSync },
  ];

  const score = Math.round(
    musicOverlap * 0.3 + personalityComplement * 0.35 + emotionalSync * 0.35,
  );

  const scenarios = computeScenarios(reportA, reportB);
  const traitDetails = buildTraitDeltas(reportA, reportB);
  const traitDeltas = traitDetails.reduce(
    (acc, item) => {
      acc[item.key] = item.delta;
      return acc;
    },
    {} as Record<PersonalityTraitKey, number>,
  );

  return {
    sessionId: `${reportA.id}:${reportB.id}`,
    score,
    summary: buildSummary(score, reportA, reportB, scenarios),
    dimensions,
    scenarios,
    traitDeltas,
    traitDetails,
    reportAId: reportA.id,
    reportBId: reportB.id,
    labelA: reportLabel(reportA),
    labelB: reportLabel(reportB),
  };
}
