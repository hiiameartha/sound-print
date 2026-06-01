export type HeroKpi = {
  id: string;
  label: string;
  value: number;
  accent: string;
};

export const HERO_KPIS: HeroKpi[] = [
  { id: "work", label: "工作", value: 68, accent: "bg-sky-500" },
  { id: "health", label: "健康", value: 82, accent: "bg-emerald-500" },
  { id: "wealth", label: "財富", value: 57, accent: "bg-amber-500" },
  { id: "happiness", label: "快樂", value: 75, accent: "bg-violet-500" },
];
