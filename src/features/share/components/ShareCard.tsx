"use client";

import { forwardRef } from "react";
import dayjs from "dayjs";
import { SHARE_CARD_WIDTH } from "@/features/share/constants";
import type { ShareCardData } from "@/features/share/types";

type ShareCardProps = {
  data: ShareCardData;
};

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ data }, ref) {
    const dateLabel = dayjs(data.completedAt).format("YYYY.MM.DD");
    const ringDegrees = Math.round((data.percent / 100) * 360);

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
            background: `radial-gradient(circle, ${data.tier.accent}33 0%, transparent 68%)`,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "56px 64px 0",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, monospace",
              fontSize: 22,
              letterSpacing: "0.28em",
              color: "#22d3ee",
            }}
          >
            LIFE.EXE
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, monospace",
              fontSize: 20,
              color: "#52525b",
            }}
          >
            {dateLabel}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "40px 64px 32px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "ui-monospace, monospace",
                fontSize: 20,
                letterSpacing: "0.35em",
                color: "#71717a",
              }}
            >
              你的專屬稱號
            </p>

            <h1
              style={{
                margin: "20px 0 0",
                fontSize: data.title.length > 10 ? 68 : 80,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                background:
                  "linear-gradient(180deg, #ffffff 0%, #a5f3fc 45%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 80px rgba(34,211,238,0.35)",
              }}
            >
              {data.title}
            </h1>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                marginTop: 28,
                padding: "14px 28px",
                borderRadius: 999,
                border: `2px solid ${data.tier.accent}66`,
                background: `${data.tier.accent}18`,
              }}
            >
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 36,
                  fontWeight: 800,
                  color: data.tier.accent,
                  letterSpacing: "0.05em",
                }}
              >
                {data.tier.code}
              </span>
              <span
                style={{
                  width: 2,
                  height: 28,
                  background: "#3f3f46",
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#d4d4d8",
                }}
              >
                {data.tier.label}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 56,
              marginTop: 52,
            }}
          >
            <ScoreRing
              percent={data.percent}
              degrees={ringDegrees}
              accent={data.tier.accent}
            />
            <div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 22,
                  color: "#71717a",
                  letterSpacing: "0.12em",
                }}
              >
                人生總分
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginTop: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 96,
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "#fafafa",
                  }}
                >
                  {data.totalScore}
                </span>
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 36,
                    color: "#52525b",
                  }}
                >
                  /60
                </span>
              </div>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 28,
                  fontWeight: 600,
                  color: data.tier.accent,
                }}
              >
                達成率 {data.percent}%
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 20,
              marginTop: 48,
            }}
          >
            <HighlightStat
              variant="best"
              badge="王牌維度"
              emoji="▲"
              label={data.bestLabel}
              score={data.bestScore}
            />
            <HighlightStat
              variant="weak"
              badge="待補強"
              emoji="▽"
              label={data.weakestLabel}
              score={data.weakestScore}
            />
          </div>

          <AiCommentarySection data={data} />

          <p
            style={{
              margin: "32px 0 0",
              textAlign: "center",
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.45,
              color: "#a1a1aa",
              fontStyle: "italic",
            }}
          >
            「{data.hookLine}」
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            margin: "0 64px 56px",
            padding: "28px 32px",
            borderRadius: 20,
            background:
              "linear-gradient(90deg, rgba(34,211,238,0.15) 0%, rgba(167,139,250,0.12) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#fafafa",
              }}
            >
              你的人生幾分？
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontFamily: "ui-monospace, monospace",
                fontSize: 18,
                color: "#71717a",
              }}
            >
              掃描六維度 · 解鎖專屬稱號
            </p>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, monospace",
              fontSize: 22,
              fontWeight: 700,
              color: "#22d3ee",
              letterSpacing: "0.06em",
            }}
          >
            Life.EXE →
          </p>
        </div>
      </div>
    );
  },
);

function AiCommentarySection({ data }: { data: ShareCardData }) {
  return (
    <div style={{ marginTop: 44 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            height: 1,
            flex: 1,
            background: "linear-gradient(90deg, transparent, #3f3f46)",
          }}
        />
        <p
          style={{
            margin: 0,
            fontFamily: "ui-monospace, monospace",
            fontSize: 20,
            letterSpacing: "0.2em",
            color: data.hasAiCommentary ? "#22d3ee" : "#71717a",
          }}
        >
          AI 人生評論
          {!data.hasAiCommentary && " · 載入中"}
        </p>
        <span
          style={{
            height: 1,
            flex: 1,
            background: "linear-gradient(90deg, #3f3f46, transparent)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <CommentaryBlock
          label="幽默分析"
          accent="#a78bfa"
          border="rgba(167,139,250,0.35)"
          background="rgba(167,139,250,0.1)"
          text={data.commentary.humorousAnalysis}
          dimmed={!data.hasAiCommentary}
        />
        <CommentaryBlock
          label="鼓勵建議"
          accent="#34d399"
          border="rgba(52,211,153,0.35)"
          background="rgba(52,211,153,0.1)"
          text={data.commentary.encouragement}
          dimmed={!data.hasAiCommentary}
        />
      </div>
    </div>
  );
}

type CommentaryBlockProps = {
  label: string;
  accent: string;
  border: string;
  background: string;
  text: string;
  dimmed?: boolean;
};

function CommentaryBlock({
  label,
  accent,
  border,
  background,
  text,
  dimmed,
}: CommentaryBlockProps) {
  return (
    <div
      style={{
        padding: "28px 26px",
        borderRadius: 22,
        border: `1px solid ${border}`,
        background,
        opacity: dimmed ? 0.75 : 1,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "ui-monospace, monospace",
          fontSize: 17,
          letterSpacing: "0.14em",
          color: accent,
          fontWeight: 700,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "14px 0 0",
          fontSize: 26,
          lineHeight: 1.55,
          color: dimmed ? "#71717a" : "#e4e4e7",
          fontWeight: 400,
        }}
      >
        {text}
      </p>
    </div>
  );
}

type ScoreRingProps = {
  percent: number;
  degrees: number;
  accent: string;
};

function ScoreRing({ percent, degrees, accent }: ScoreRingProps) {
  return (
    <div
      style={{
        position: "relative",
        width: 168,
        height: 168,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(${accent} ${degrees}deg, #27272a ${degrees}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: "50%",
          background: "#050508",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: accent,
            lineHeight: 1,
          }}
        >
          {percent}%
        </span>
      </div>
    </div>
  );
}

type HighlightStatProps = {
  variant: "best" | "weak";
  badge: string;
  emoji: string;
  label: string;
  score: number;
};

function HighlightStat({
  variant,
  badge,
  emoji,
  label,
  score,
}: HighlightStatProps) {
  const isBest = variant === "best";
  const accent = isBest ? "#34d399" : "#fb7185";
  const bg = isBest ? "rgba(52,211,153,0.14)" : "rgba(251,113,133,0.1)";
  const border = isBest ? "rgba(52,211,153,0.45)" : "rgba(251,113,133,0.35)";

  return (
    <div
      style={{
        padding: isBest ? "28px 32px" : "24px 28px",
        borderRadius: 24,
        border: `2px solid ${border}`,
        background: bg,
        boxShadow: isBest
          ? "0 0 40px rgba(52,211,153,0.12)"
          : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 18,
            letterSpacing: "0.12em",
            color: accent,
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
        <span style={{ fontSize: 22, color: accent }}>{emoji}</span>
      </div>
      <p
        style={{
          margin: isBest ? "16px 0 0" : "12px 0 0",
          fontSize: isBest ? 44 : 36,
          fontWeight: 800,
          color: "#fafafa",
          lineHeight: 1.1,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "8px 0 0",
          fontFamily: "ui-monospace, monospace",
          fontSize: isBest ? 36 : 30,
          fontWeight: 700,
          color: accent,
        }}
      >
        {score}
        <span style={{ fontSize: 22, color: "#52525b", fontWeight: 500 }}>
          {" "}
          /10
        </span>
      </p>
    </div>
  );
}
