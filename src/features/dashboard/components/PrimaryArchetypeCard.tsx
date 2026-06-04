import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { ArchetypeMatch } from "@/features/personality/types/archetype";
import { getArchetypeAccent } from "@/features/share/lib/share-card-content";

type PrimaryArchetypeCardProps = {
  archetype: ArchetypeMatch;
};

export function PrimaryArchetypeCard({ archetype }: PrimaryArchetypeCardProps) {
  const accent = getArchetypeAccent(archetype.id);

  return (
    <DashboardCard>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        🎧 你的音樂人格
      </p>
      <p
        className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
        style={{ color: accent }}
      >
        {archetype.title.split("（")[0]?.trim() ?? archetype.title}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{archetype.title}</p>
      <p className="mt-4 font-mono text-sm text-muted-foreground">
        主人格契合度 · {archetype.score}
      </p>
    </DashboardCard>
  );
}
