import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { ArchetypeMatch } from "@/features/personality/types/archetype";

type SecondaryArchetypeCardProps = {
  archetype: ArchetypeMatch;
};

export function SecondaryArchetypeCard({ archetype }: SecondaryArchetypeCardProps) {
  return (
    <DashboardCard>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        副人格
      </p>
      <p className="mt-3 text-xl font-semibold leading-snug sm:text-2xl">
        {archetype.title.split("（")[0]?.trim() ?? archetype.title}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{archetype.title}</p>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        契合度 · {archetype.score}
      </p>
    </DashboardCard>
  );
}
