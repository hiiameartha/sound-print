const STORAGE_KEY = "life_is_fine_user_id";

export function getOrCreateLocalUserId(): string {
  const existing = globalThis?.localStorage?.getItem(STORAGE_KEY);
  if (existing) return existing;

  const userId = globalThis?.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  globalThis?.localStorage?.setItem(STORAGE_KEY, userId);
  return userId;
}
