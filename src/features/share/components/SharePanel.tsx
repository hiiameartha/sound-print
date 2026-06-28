"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Copy, Download, Loader2, Share2 } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { SHARE_CARD_WIDTH } from "@/features/share/constants";
import { buildShareCardData } from "@/features/share/lib/build-share-card-data";
import {
  downloadShareCardPng,
  measureShareCard,
  shareCardPngFile,
} from "@/features/share/lib/download-share-card";
import {
  buildFacebookShareUrl,
  buildLineShareUrl,
  buildShareText,
  buildTwitterShareUrl,
  openShareWindow,
} from "@/features/share/lib/share-links";
import { ShareCard } from "@/features/share/components/ShareCard";
import { buildShareInviteUrl } from "@/features/share/lib/share-invite-url";
import { generateShareQrDataUrl } from "@/features/share/lib/share-qr-code";
import { usePersonalityCommentaryStore } from "@/store/personality-commentary-store";
import type { PersonalityProfile } from "@/features/personality/types/personality-profile";
import type { PersonalityCommentary } from "@/types/personality-commentary";
import { cn } from "@/lib/utils";

const PREVIEW_MAX_WIDTH = 360;

type SharePanelProps = {
  profile: PersonalityProfile;
  /** 從 DB 載入的歷史報告評論（/share?report=） */
  initialCommentary?: PersonalityCommentary | null;
};

export function SharePanel({
  profile,
  initialCommentary = null,
}: SharePanelProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const previewShellRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(SHARE_CARD_WIDTH);
  const [previewWidth, setPreviewWidth] = useState(PREVIEW_MAX_WIDTH);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const storeCommentary = usePersonalityCommentaryStore((s) => s.commentary);
  const sourceAnalyzedAt = usePersonalityCommentaryStore(
    (s) => s.sourceAnalyzedAt,
  );

  const storeCommentaryReady =
    sourceAnalyzedAt === profile.analyzedAt && storeCommentary !== null;

  const effectiveCommentary = initialCommentary ?? (storeCommentaryReady ? storeCommentary : null);
  const commentaryReady = effectiveCommentary !== null;

  const cardData = useMemo(
    () => buildShareCardData(profile, effectiveCommentary),
    [profile, effectiveCommentary],
  );

  const shareText = useMemo(() => buildShareText(cardData), [cardData]);
  const inviteUrl = useMemo(() => buildShareInviteUrl(), []);
  const [inviteQrDataUrl, setInviteQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void generateShareQrDataUrl(inviteUrl).then((dataUrl) => {
      if (!cancelled) setInviteQrDataUrl(dataUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [inviteUrl]);

  useLayoutEffect(() => {
    const node = exportRef.current;
    if (!node) return;

    const updateHeight = () => {
      setCardHeight(measureShareCard(node).height);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [cardData, inviteQrDataUrl]);

  useLayoutEffect(() => {
    const shell = previewShellRef.current;
    if (!shell) return;

    const updateWidth = () => {
      const next = Math.min(PREVIEW_MAX_WIDTH, Math.floor(shell.clientWidth));
      setPreviewWidth(next > 0 ? next : PREVIEW_MAX_WIDTH);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  const previewScale = previewWidth / SHARE_CARD_WIDTH;
  const previewHeight = Math.ceil(cardHeight * previewScale);
  const inviteReady = inviteQrDataUrl !== null;

  const runExport = useCallback(
    async (action: "download" | "native") => {
      const node = exportRef.current;
      if (!node) return;

      if (!inviteQrDataUrl) {
        setStatusMessage("分享卡載入中，請稍候再下載");
        return;
      }

      setIsExporting(true);
      setStatusMessage(null);

      try {
        if (action === "download") {
          const size = await downloadShareCardPng(node);
          setStatusMessage(`已下載 ${size.width}×${size.height} PNG`);
          return;
        }

        const shared = await shareCardPngFile(node, shareText);
        if (!shared) {
          const size = await downloadShareCardPng(node);
          setStatusMessage(
            `此裝置不支援直接分享，已改為下載 ${size.width}×${size.height} PNG`,
          );
        } else {
          setStatusMessage("已開啟系統分享");
        }
      } catch {
        setStatusMessage("匯出失敗，請再試一次");
      } finally {
        setIsExporting(false);
      }
    },
    [inviteQrDataUrl, shareText],
  );

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setStatusMessage("已複製分享文案");
    } catch {
      setStatusMessage("複製失敗，請手動選取文字");
    }
  }, [shareText]);

  const handleLine = useCallback(() => {
    openShareWindow(buildLineShareUrl(shareText));
  }, [shareText]);

  const handleFacebook = useCallback(() => {
    openShareWindow(buildFacebookShareUrl(inviteUrl));
  }, [inviteUrl]);

  const handleTwitter = useCallback(() => {
    openShareWindow(buildTwitterShareUrl(shareText, inviteUrl));
  }, [inviteUrl, shareText]);

  return (
    <DashboardCard
      title="分享人格報告"
      subtitle="1080px 寬 · 含 QR Code 邀請好友檢測 · 一鍵下載 PNG"
    >
      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
        <div
          ref={previewShellRef}
          className="mx-auto w-full min-w-0 max-w-[360px] shrink-0 lg:mx-0"
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-border/80 shadow-lg ring-1 ring-cyan-500/10"
            style={{ height: previewHeight }}
          >
            <div
              className="pointer-events-none absolute left-0 top-0 origin-top-left"
              style={{
                width: SHARE_CARD_WIDTH,
                transform: `scale(${previewScale})`,
              }}
            >
              <ShareCard
                data={cardData}
                inviteUrl={inviteUrl}
                inviteQrDataUrl={inviteQrDataUrl}
              />
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            預覽 · 輸出 {SHARE_CARD_WIDTH}×{cardHeight}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {!commentaryReady && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              AI 年度稱號與幽默評論尚未就緒；產生後請重新下載 PNG 以更新分享卡。
            </p>
          )}
          <p className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-800 dark:text-cyan-300">
            🎧 {cardData.primaryShortName}
            <span className="mx-2 text-muted-foreground">|</span>
            {cardData.yearlyTitle}
          </p>

          <div className="flex flex-wrap gap-2">
            <ActionButton
              onClick={() => void runExport("download")}
              disabled={isExporting || !inviteReady}
              variant="primary"
              icon={
                isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Download className="h-4 w-4" aria-hidden />
                )
              }
              label="下載 PNG"
            />
            <ActionButton
              onClick={() => void runExport("native")}
              disabled={isExporting || !inviteReady}
              icon={<Share2 className="h-4 w-4" aria-hidden />}
              label="系統分享"
            />
          </div>

          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            社群分享
          </p>
          <div className="flex flex-wrap gap-2">
            <ActionButton
              onClick={handleLine}
              disabled={isExporting}
              label="LINE"
              className="border-[#06C755]/40 text-[#06C755] hover:bg-[#06C755]/10"
            />
            <ActionButton
              onClick={handleFacebook}
              disabled={isExporting}
              label="Facebook"
              className="border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/10"
            />
            <ActionButton
              onClick={handleTwitter}
              disabled={isExporting}
              label="X"
              className="border-foreground/20 hover:bg-muted"
            />
            <ActionButton
              onClick={() => void handleCopyText()}
              disabled={isExporting}
              icon={<Copy className="h-4 w-4" aria-hidden />}
              label="複製文案"
            />
          </div>

          {statusMessage && (
            <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
              {statusMessage}
            </p>
          )}
        </div>
      </div>

      <div
        className="pointer-events-none fixed top-0 -left-[10000px] w-max"
        aria-hidden
      >
        <ShareCard
          ref={exportRef}
          data={cardData}
          inviteUrl={inviteUrl}
          inviteQrDataUrl={inviteQrDataUrl}
        />
      </div>
    </DashboardCard>
  );
}

type ActionButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "default";
  className?: string;
};

function ActionButton({
  onClick,
  disabled,
  label,
  icon,
  variant = "default",
  className,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:text-cyan-300",
        variant === "default" && "border-border text-foreground hover:bg-muted",
        className,
      )}
    >
      {icon}
      {label}
    </button>
  );
}
