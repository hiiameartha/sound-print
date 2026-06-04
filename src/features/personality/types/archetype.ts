export const ARCHETYPE_IDS = [
  "midnight-philosopher",
  "hopeless-romantic",
  "song-repeater",
  "kpop-ambassador",
  "indie-wanderer",
  "mood-dj",
] as const;

export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];

export type ArchetypeMatch = {
  id: ArchetypeId;
  title: string;
  score: number;
};

export const ARCHETYPE_TITLES: Record<ArchetypeId, string> = {
  "midnight-philosopher": "Midnight Philosopher（凌晨哲學家）",
  "hopeless-romantic": "Hopeless Romantic（浪漫主義者）",
  "song-repeater": "Song Repeater（單曲循環患者）",
  "kpop-ambassador": "KPOP Ambassador（KPOP外交官）",
  "indie-wanderer": "Indie Wanderer（獨立音樂旅人）",
  "mood-dj": "Mood DJ（情緒DJ）",
};
