import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { COMPATIBILITY_COMPARE_PARAM } from "@/features/compatibility/lib/build-compatibility-invite-url";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "音樂合拍",
  description: "已移至儀表板，與好友比較音樂喜好。",
  path: "/compatibility",
});

type CompatibilityPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CompatibilityPage({
  searchParams,
}: CompatibilityPageProps) {
  const params = await searchParams;
  const withParam = params[COMPATIBILITY_COMPARE_PARAM];
  const friendReportId = Array.isArray(withParam) ? withParam[0] : withParam;

  if (friendReportId) {
    redirect(
      `/dashboard?${COMPATIBILITY_COMPARE_PARAM}=${encodeURIComponent(friendReportId)}#music-match`,
    );
  }

  redirect("/dashboard#music-match");
}
