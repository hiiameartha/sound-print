import { TRAIT_DISPLAY } from "@/features/personality/constants/trait-display";
import type { PersonalityReport } from "@/features/personality-reports/types";
import type { PersonalityTraitKey } from "@/features/personality/types/traits";
import type {
  CompatibilityResult,
  CompatibilityTraitDelta,
} from "@/features/compatibility/types";

function traitSimilarity(a: number, b: number): number {
  return 100 - Math.abs(a - b);
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

function archetypeBonus(reportA: PersonalityReport, reportB: PersonalityReport): number {
  const primaryA = reportA.profile.primaryArchetype.id;
  const primaryB = reportB.profile.primaryArchetype.id;
  const secondaryA = reportA.profile.secondaryArchetype.id;
  const secondaryB = reportB.profile.secondaryArchetype.id;

  let bonus = 0;
  if (primaryA === primaryB) bonus += 12;
  if (primaryA === secondaryB || primaryB === secondaryA) bonus += 6;
  return bonus;
}

function buildSummary(score: number, reportA: PersonalityReport, reportB: PersonalityReport): string {
  const nameA = reportA.profile.primaryArchetype.title.split("（")[0]?.trim();
  const nameB = reportB.profile.primaryArchetype.title.split("（")[0]?.trim();

  if (score >= 85) {
    return `${nameA} 與 ${nameB} 的播放清單簡直是靈魂共振，建議組團辦公室耳機局。`;
  }
  if (score >= 70) {
    return `你們有多處頻率重疊，差異處剛好能互補歌單死角。`;
  }
  if (score >= 55) {
    return `一半相似、一半互補——像兩個曲風不同的房間，門沒關緊。`;
  }
  return `人格頻率差得有點遠，但這正是合唱團有趣的地方。`;
}

/**
 * Rule-based、可測試；不依賴 OpenAI。
 */
export function comparePersonalityReports(
  reportA: PersonalityReport,
  reportB: PersonalityReport,
): CompatibilityResult {
  const traitScores = TRAIT_DISPLAY.map((d) =>
    traitSimilarity(
      reportA.profile.traits[d.key],
      reportB.profile.traits[d.key],
    ),
  );
  const traitAverage =
    traitScores.reduce((sum, v) => sum + v, 0) / traitScores.length;

  const score = Math.round(
    Math.min(100, traitAverage + archetypeBonus(reportA, reportB)),
  );

  const traitDeltas = buildTraitDeltas(reportA, reportB).reduce(
    (acc, item) => {
      acc[item.key] = item.delta;
      return acc;
    },
    {} as Record<PersonalityTraitKey, number>,
  );

  return {
    sessionId: `${reportA.id}:${reportB.id}`,
    score,
    summary: buildSummary(score, reportA, reportB),
    traitDeltas,
    traitDetails: buildTraitDeltas(reportA, reportB),
    reportAId: reportA.id,
    reportBId: reportB.id,
  };
}
