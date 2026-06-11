"use client";

import { Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpotifyListeningThumbnailProps = {
  imageUrl: string | null;
  alt: string;
  variant?: "square" | "circle";
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
} as const;

export function SpotifyListeningThumbnail({
  imageUrl,
  alt,
  variant = "square",
  size = "md",
  className,
}: SpotifyListeningThumbnailProps) {
  const shapeClass =
    variant === "circle" ? "rounded-full" : "rounded-md";

  if (!imageUrl) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-muted",
          SIZE_CLASS[size],
          shapeClass,
          className,
        )}
        aria-hidden
      >
        <Music2 className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      width={size === "sm" ? 40 : 48}
      height={size === "sm" ? 40 : 48}
      loading="lazy"
      className={cn(
        "shrink-0 object-cover",
        SIZE_CLASS[size],
        shapeClass,
        className,
      )}
    />
  );
}
