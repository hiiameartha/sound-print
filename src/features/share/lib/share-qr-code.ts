import QRCode from "qrcode";
import { buildShareInviteUrl } from "@/features/share/lib/share-invite-url";

export async function generateShareQrDataUrl(
  url: string = buildShareInviteUrl(),
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 220,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#fafafa",
      light: "#050508",
    },
  });
}
