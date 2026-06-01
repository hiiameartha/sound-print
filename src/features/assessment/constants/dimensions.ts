import type { AssessmentDimensionKey } from "@/types/assessment";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Gamepad2,
  Heart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export type AssessmentDimension = {
  key: AssessmentDimensionKey;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

export const ASSESSMENT_DIMENSIONS: AssessmentDimension[] = [
  {
    key: "health",
    label: "健康",
    description: "身體狀態、睡眠與運動習慣",
    icon: Heart,
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "wealth",
    label: "財富",
    description: "收入穩定、儲蓄與財務安全感",
    icon: Wallet,
    accent: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "work",
    label: "工作",
    description: "成就感、負荷與職涯方向",
    icon: Briefcase,
    accent: "text-sky-600 dark:text-sky-400",
  },
  {
    key: "social",
    label: "社交",
    description: "人際連結、支持與歸屬感",
    icon: Users,
    accent: "text-violet-600 dark:text-violet-400",
  },
  {
    key: "entertainment",
    label: "娛樂",
    description: "休閒品質、興趣與放鬆時間",
    icon: Gamepad2,
    accent: "text-pink-600 dark:text-pink-400",
  },
  {
    key: "growth",
    label: "成長",
    description: "學習、技能與自我實現",
    icon: TrendingUp,
    accent: "text-cyan-600 dark:text-cyan-400",
  },
];

export const DEFAULT_ASSESSMENT_SCORES: Record<AssessmentDimensionKey, number> = {
  health: 5,
  wealth: 5,
  work: 5,
  social: 5,
  entertainment: 5,
  growth: 5,
};
