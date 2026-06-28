import { HeroSection } from "@/features/home";
import { getAnalyzedUserCount } from "@/features/personality-reports/get-analyzed-user-count";

export default async function HomePage() {
  const analyzedCount = await getAnalyzedUserCount();

  return <HeroSection analyzedCount={analyzedCount} />;
}
