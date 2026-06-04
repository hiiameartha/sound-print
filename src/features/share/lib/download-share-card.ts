import { toPng } from "html-to-image";
import { SHARE_CARD_WIDTH } from "@/features/share/constants";

export type ShareCardExportSize = {
  width: number;
  height: number;
};

export function measureShareCard(element: HTMLElement): ShareCardExportSize {
  return {
    width: element.offsetWidth || SHARE_CARD_WIDTH,
    height: element.scrollHeight || element.offsetHeight,
  };
}

export async function captureShareCardPng(
  element: HTMLElement,
): Promise<{ dataUrl: string; size: ShareCardExportSize }> {
  const size = measureShareCard(element);

  const dataUrl = await toPng(element, {
    width: size.width,
    height: size.height,
    pixelRatio: 1,
    cacheBust: true,
    style: {
      transform: "none",
      margin: "0",
      overflow: "visible",
    },
  });

  return { dataUrl, size };
}

export async function downloadShareCardPng(
  element: HTMLElement,
  filename = "life-exe-report.png",
): Promise<ShareCardExportSize> {
  const { dataUrl, size } = await captureShareCardPng(element);
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
  return size;
}

export async function shareCardPngFile(
  element: HTMLElement,
  shareText: string,
): Promise<boolean> {
  const { dataUrl } = await captureShareCardPng(element);
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], "life-exe-report.png", { type: "image/png" });

  if (!navigator.share) {
    return false;
  }

  const payload: ShareData = {
    title: "Life.EXE 人生報告",
    text: shareText,
    files: [file],
  };

  if (navigator.canShare && !navigator.canShare(payload)) {
    return false;
  }

  await navigator.share(payload);
  return true;
}
