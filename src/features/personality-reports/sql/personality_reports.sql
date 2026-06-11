- 音樂人格報告
create extension if not exists pgcrypto;

create table if not exists public.personality_reports (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,

  primary_archetype text not null,
  secondary_archetype text not null,

  romantic smallint not null check (romantic between 0 and 100),
  social smallint not null check (social between 0 and 100),
  nostalgia smallint not null check (nostalgia between 0 and 100),
  explorer smallint not null check (explorer between 0 and 100),
  emotional smallint not null check (emotional between 0 and 100),
  adventurous smallint not null check (adventurous between 0 and 100),

  spotify_snapshot jsonb,

  humorous_commentary text,
  yearly_title text,

  created_at timestamptz not null default now()
);

create index if not exists personality_reports_user_id_created_at_idx
  on public.personality_reports (user_id, created_at desc);
