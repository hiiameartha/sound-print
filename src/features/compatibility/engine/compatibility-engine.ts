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

/** 口味／曲風取向 → 音樂重疊 */
const TASTE_TRAITS: PersonalityTraitKey[] = [
  "explorer",
  "nostalgia",
  "adventurous",
];

/** 情緒與社交氛圍 → 情緒同步 */
const MOOD_TRAITS: PersonalityTraitKey[] = [
  "emotional",
  "romantic",
  "social",
];

/** 互動面向 → 人格互補（與其他維度相同：各特質接近度平均） */
const COMPLEMENT_TRAITS: PersonalityTraitKey[] = [
  "romantic",
  "social",
  "adventurous",
];

export const COMPATIBILITY_DIMENSION_HINTS: Record<
  CompatibilityDimension["key"],
  string
> = {
  musicOverlap: "探索值、懷舊值、冒險值接近度的平均",
  personalityComplement: "浪漫／社交／冒險接近度的平均（越接近代表喜好越像）",
  emotionalSync: "情緒值、浪漫值、社交值接近度的平均",
};

function traitSimilarity(a: number, b: number): number {
  return 100 - Math.abs(a - b);
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
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

  return Math.round(
    average(
      TASTE_TRAITS.map((key) => traitSimilarity(traitsA[key], traitsB[key])),
    ),
  );
}

function computePersonalityComplement(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): number {
  const traitsA = reportA.profile.traits;
  const traitsB = reportB.profile.traits;

  return Math.round(
    average(
      COMPLEMENT_TRAITS.map((key) =>
        traitSimilarity(traitsA[key], traitsB[key]),
      ),
    ),
  );
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
    {
      key: "musicOverlap",
      label: "口味相似",
      score: musicOverlap,
      hint: COMPATIBILITY_DIMENSION_HINTS.musicOverlap,
    },
    {
      key: "personalityComplement",
      label: "聆聽風格",
      score: personalityComplement,
      hint: COMPATIBILITY_DIMENSION_HINTS.personalityComplement,
    },
    {
      key: "emotionalSync",
      label: "心情頻率",
      score: emotionalSync,
      hint: COMPATIBILITY_DIMENSION_HINTS.emotionalSync,
    },
  ];

  const score = Math.round(
    (musicOverlap + personalityComplement + emotionalSync) / 3,
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
