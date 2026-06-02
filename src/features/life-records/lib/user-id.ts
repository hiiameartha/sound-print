export function getOrCreateLocalUserId(): string {
  const key = "life_exe_user_id";
  const existing = globalThis?.localStorage?.getItem(key);
  if (existing) return existing;

  const userId = globalThis?.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  globalThis?.localStorage?.setItem(key, userId);
  return userId;
}

