"use client";

import { forwardRef } from "react";
import dayjs from "dayjs";
import { SITE } from "@/constants/site";
import { formatTraitShareLine } from "@/features/personality/constants/trait-display";
import { SHARE_CARD_WIDTH } from "@/features/share/constants";
import type { ShareCardData } from "@/features/share/types";

type ShareCardProps = {
  data: ShareCardData;
};

const RADAR_SIZE = 320;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_MAX_R = 118;
const LABEL_R = 148;

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ data }, ref) {
    const dateLabel = dayjs(data.analyzedAt).format("YYYY.MM.DD");
    const accent = data.accent;
    const secondaryShort =
      data.secondaryArchetype.title.split("（")[0]?.trim() ??
      data.secondaryArchetype.title;

    return (
      <div
        ref={ref}
        style={{
          width: SHARE_CARD_WIDTH,
          boxSizing: "border-box",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          color: "#fafafa",
          background: "#050508",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}33 0%, transparent 68%)`,
            pointerEvents: "none",
          }}
        />

        <header style={{ position: "relative", zIndex: 1, padding: "52px 64px 0" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, monospace",
              fontSize: 22,
              letterSpacing: "0.2em",
              color: accent,
            }}
          >
            {SITE.name}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 24, color: "#71717a" }}>
            音樂人格報告 · {dateLabel}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 22, color: "#a1a1aa" }}>
            {data.displayName}
          </p>
        </header>

        <section style={{ position: "relative", zIndex: 1, padding: "40px 64px 0" }}>
          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "#d4d4d8",
            }}
          >
            🎧 你的音樂人格：
          </p>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.1,
              color: accent,
            }}
          >
            {data.primaryShortName}
          </p>
          <p style={{ margin: "12px 0 0", fontSize: 24, color: "#71717a" }}>
            副人格 · {secondaryShort}
          </p>
        </section>

        <section style={{ position: "relative", zIndex: 1, padding: "36px 64px 0" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, monospace",
              fontSize: 20,
              letterSpacing: "0.2em",
              color: "#71717a",
            }}
          >
            年度稱號
          </p>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#fafafa",
            }}
          >
            {data.yearlyTitle}
          </p>
        </section>

        {data.toxicCommentary ? (
          <section
            style={{
              position: "relative",
              zIndex: 1,
              margin: "32px 64px 0",
              padding: "28px 32px",
              borderRadius: 20,
              border: "1px solid rgba(251,113,133,0.35)",
              background: "rgba(251,113,133,0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "ui-monospace, monospace",
                fontSize: 18,
                letterSpacing: "0.14em",
                color: "#fb7185",
                fontWeight: 700,
              }}
            >
              AI 吐槽
            </p>
            <p
              style={{
                margin: "14px 0 0",
                fontSize: 28,
                lineHeight: 1.55,
                color: "#e4e4e7",
              }}
            >
              {data.toxicCommentary}
            </p>
          </section>
        ) : null}

        {data.humorousCommentary ? (
          <p
            style={{
              position: "relative",
              zIndex: 1,
              margin: "24px 64px 0",
              fontSize: 26,
              lineHeight: 1.5,
              color: "#a1a1aa",
              fontStyle: "italic",
            }}
          >
            {data.humorousCommentary}
          </p>
        ) : null}

        <section
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 32,
            padding: "40px 64px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px 24px",
            }}
          >
            {data.radar.map((point) => (
              <p
                key={point.key}
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#e4e4e7",
                }}
              >
                {formatTraitShareLine(point.key, point.score)}
              </p>
            ))}
          </div>
          <PersonalityRadarSvg points={data.radar} accent={accent} />
        </section>

        <footer
          style={{
            position: "relative",
            zIndex: 1,
            margin: "0 64px 52px",
            padding: "24px 28px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: `${accent}18`,
          }}
        >
          <p style={{ margin: 0, fontSize: 22, color: "#fafafa" }}>
            Tell me what you listen to, and I&apos;ll tell you who you are.
          </p>
        </footer>
      </div>
    );
  },
);

function PersonalityRadarSvg({
  points,
  accent,
}: {
  points: ShareCardData["radar"];
  accent: string;
}) {
  const n = points.length;
  const angleStep = (Math.PI * 2) / n;

  const dataVertices = points.map((p, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = (p.score / 100) * RADAR_MAX_R;
    return {
      x: RADAR_CENTER + r * Math.cos(angle),
      y: RADAR_CENTER + r * Math.sin(angle),
    };
  });

  return (
    <svg
      width={RADAR_SIZE}
      height={RADAR_SIZE}
      viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
      role="img"
      aria-label="人格雷達圖"
    >
      {[0.5, 1].map((level) => {
        const gridVerts = points.map((_, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const r = RADAR_MAX_R * level;
          return `${RADAR_CENTER + r * Math.cos(angle)},${RADAR_CENTER + r * Math.sin(angle)}`;
        });
        return (
          <polygon
            key={level}
            points={gridVerts.join(" ")}
            fill="none"
            stroke="#3f3f46"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={dataVertices.map((v) => `${v.x},${v.y}`).join(" ")}
        fill={`${accent}28`}
        stroke={accent}
        strokeWidth={2}
      />
      {points.map((p, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const lx = RADAR_CENTER + LABEL_R * Math.cos(angle);
        const ly = RADAR_CENTER + LABEL_R * Math.sin(angle);
        return (
          <text
            key={p.key}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#71717a"
            fontSize={13}
          >
            {p.emoji}
          </text>
        );
      })}
    </svg>
  );
}
