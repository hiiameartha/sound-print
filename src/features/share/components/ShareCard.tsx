"use client";

import { forwardRef } from "react";
import dayjs from "dayjs";
import { SITE } from "@/constants/site";
import { formatTraitShareLine } from "@/features/personality/constants/trait-display";
import { SHARE_CARD_WIDTH } from "@/features/share/constants";
import {
  formatShareInviteUrlForDisplay,
  SHARE_INVITE_CTA,
} from "@/features/share/lib/share-invite-url";
import type { ShareCardData } from "@/features/share/types";

type ShareCardProps = {
  data: ShareCardData;
  inviteUrl: string;
  inviteQrDataUrl: string | null;
};

const RADAR_SIZE = 320;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_MAX_R = 118;
const LABEL_R = 148;

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ data, inviteUrl, inviteQrDataUrl }, ref) {
    const dateLabel = dayjs(data.analyzedAt).format("YYYY.MM.DD");
    const accent = data.accent;
    const inviteUrlLabel = formatShareInviteUrlForDisplay(inviteUrl);
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
            padding: "32px 36px",
            borderRadius: 20,
            border: "1px solid rgba(29,185,84,0.35)",
            background:
              "linear-gradient(135deg, rgba(29,185,84,0.12) 0%, rgba(5,5,8,0.6) 100%)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, monospace",
              fontSize: 18,
              letterSpacing: "0.16em",
              color: "#1DB954",
              fontWeight: 700,
            }}
          >
            {SITE.name} · {SHARE_INVITE_CTA.action}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              gap: 28,
              marginTop: 24,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: 16,
                border: "2px solid rgba(250,250,250,0.15)",
                overflow: "hidden",
                background: "#050508",
              }}
            >
              {inviteQrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={inviteQrDataUrl}
                  alt=""
                  width={220}
                  height={220}
                  style={{ display: "block" }}
                />
              ) : null}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontWeight: 800,
                  lineHeight: 1.25,
                  color: "#fafafa",
                }}
              >
                {SHARE_INVITE_CTA.headline}
              </p>
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: "#a1a1aa",
                }}
              >
                掃描左側 QR Code，或開啟下方網址連結 Spotify，即可取得你的音樂人格報告。
              </p>
              <p
                style={{
                  margin: "20px 0 0",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#1DB954",
                  wordBreak: "break-all",
                }}
              >
                {inviteUrlLabel}
              </p>
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: 20,
                  lineHeight: 1.5,
                  color: "#71717a",
                }}
              >
                {SHARE_INVITE_CTA.steps}
              </p>
            </div>
          </div>
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
