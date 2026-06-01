export function formatHistoryLabel(isoDate: string): string {
  return new Date(isoDate).toLocaleString("zh-TW", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
