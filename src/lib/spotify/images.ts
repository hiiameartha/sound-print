export type SpotifyImage = {
  url: string;
  height?: number | null;
  width?: number | null;
};

/** 優先選較小尺寸的封面，列表縮圖較省頻寬。 */
export function pickSpotifyImageUrl(
  images: SpotifyImage[] | undefined,
  preferredSize = 64,
): string | null {
  if (!images?.length) return null;

  const sorted = [...images].sort((a, b) => {
    const aSize = a.width ?? a.height ?? 0;
    const bSize = b.width ?? b.height ?? 0;
    return aSize - bSize;
  });

  const match =
    sorted.find((img) => {
      const size = img.width ?? img.height ?? 0;
      return size >= preferredSize;
    }) ?? sorted[sorted.length - 1];

  return match?.url ?? null;
}
